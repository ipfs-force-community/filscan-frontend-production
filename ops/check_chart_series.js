#!/usr/bin/env node
/**
 * 守卫：图表 series 的 dataIndex 必须是后端真实字段；已接入语言的 i18n key 集合不得新增漂移。
 *
 * 判据一（后端字段契约）：
 *   contents/*.tsx 里的**图表 series**（同时带 `type: 'line'|'bar'` 与 `dataIndex` 的对象字面量），
 *   其 dataIndex 必须出现在后端 `../filscan_backend/api/*.go` 或
 *   `../filscan_backend/modules/pro/api/*.go` 的 json tag 集合里。
 *   背景：前后端字段名靠人肉对齐，前端先改名、后端没跟 ⇒ 曲线静默画空、页面不报错。
 *   缺一即 exit 1 并报 `文件:行号`。
 *   · 只查图表 series，不查表格列 / 表单字段 / 区间选择器 —— 后者的 dataIndex 大量是前端本地键。
 *   · FRONTEND_LOCAL_SERIES：明确由前端本地合成、不对应任何 Go json tag 的 series（见下），不参与判据。
 *
 * 判据二（i18n 一致性，只降不升）：
 *   比较范围＝**实际接入的语言**，由 i18n/index.ts 的 import 语句推导（`from './<lang>/<ns>'`）。
 *   例如 ja/*.js 虽在仓库里，但 index.ts 没 import ⇒ 不参与判据（它是不生效的桩）。
 *   同一命名空间在「接入它的语言」之间顶层 key 必须一致；既有漂移记在
 *   `ops/i18n_key_baseline.json`，**只对超出基线的漂移失败**（新增/变大即 exit 1）；
 *   基线里的条目补齐后会提示收紧，跑 `node ops/check_chart_series.js --update-baseline` 重写基线。
 *
 * 用法：node ops/check_chart_series.js [--update-baseline]
 *      退出码 0=通过，1=违约，2=脚本自身无法解析
 *      （路径按脚本位置推导：contents/ 与 i18n/ 在 ../ 下，后端在 ../../filscan_backend/ 下）
 */
const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const CONTENTS_DIR = path.join(ROOT, 'contents')
const I18N_DIR = path.join(ROOT, 'i18n')
const I18N_INDEX = path.join(I18N_DIR, 'index.ts')
const BASELINE_FILE = path.join(__dirname, 'i18n_key_baseline.json')
const BACKEND_API_DIRS = [
  path.join(ROOT, '..', 'filscan_backend', 'api'),
  path.join(ROOT, '..', 'filscan_backend', 'modules', 'pro', 'api'),
]

const SERIES_TYPES = new Set(['line', 'bar'])

// 前端本地合成的 series 键（不对应后端 json tag，故不参与判据一）：
//   contents/analysis.tsx 的 fil_trend 消费 K 线接口 GetFilecoinKLine 返回的原始数组，
//   usd / btc / market / volume 是前端 store（store/modules/analysis.ts）自己拼出来的键，后端无此字段。
const FRONTEND_LOCAL_SERIES = new Set(['usd', 'btc', 'market', 'volume'])

// ---------------------------------------------------------------------------
// 通用：字符串 / 注释感知的源码扫描，产出「叶子对象字面量」（体里没有嵌套 { } ）。
// ---------------------------------------------------------------------------
function leafObjects(src) {
  const objs = []
  const stack = []
  let i = 0
  let line = 1
  const n = src.length
  while (i < n) {
    const c = src[i]
    if (c === '\n') {
      line++
      i++
      continue
    }
    if (c === '/' && src[i + 1] === '/') {
      while (i < n && src[i] !== '\n') i++
      continue
    }
    if (c === '/' && src[i + 1] === '*') {
      i += 2
      while (i < n && !(src[i] === '*' && src[i + 1] === '/')) {
        if (src[i] === '\n') line++
        i++
      }
      i += 2
      continue
    }
    if (c === '"' || c === "'" || c === '`') {
      const q = c
      i++
      while (i < n && src[i] !== q) {
        if (src[i] === '\\') i++
        if (src[i] === '\n') line++
        i++
      }
      i++
      continue
    }
    if (c === '{' || c === '[') {
      stack.push({ ch: c, start: i, line })
      i++
      continue
    }
    if (c === '}' || c === ']') {
      const o = stack.pop()
      if (o && o.ch === '{' && c === '}') {
        const text = src.slice(o.start + 1, i)
        const noStrings = text.replace(/'[^']*'|"[^"]*"|`[^`]*`/g, '')
        objs.push({ text, line: o.line, hasNested: /[{}]/.test(noStrings) })
      }
      i++
      continue
    }
    i++
  }
  return objs
}

// ---------------------------------------------------------------------------
// 判据一
// ---------------------------------------------------------------------------
function collectGoJsonTags() {
  const dirs = BACKEND_API_DIRS.filter((d) => fs.existsSync(d))
  if (!dirs.length) return null
  const tags = new Set()
  for (const dir of dirs) {
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith('.go') || f.endsWith('_test.go')) continue
      const src = fs.readFileSync(path.join(dir, f), 'utf8')
      const re = /json:"([^"]+)"/g
      let m
      while ((m = re.exec(src)) !== null) {
        for (const part of m[1].split(',')) {
          const t = part.trim()
          if (t && t !== '-') tags.add(t)
        }
      }
    }
  }
  return tags
}

function collectSeriesDataIndexes() {
  if (!fs.existsSync(CONTENTS_DIR)) return null
  const found = []
  for (const f of fs.readdirSync(CONTENTS_DIR)) {
    if (!f.endsWith('.tsx')) continue
    const src = fs.readFileSync(path.join(CONTENTS_DIR, f), 'utf8')
    for (const o of leafObjects(src)) {
      if (o.hasNested) continue
      if (!/dataIndex\s*:/.test(o.text)) continue
      const t = o.text.match(/\btype\s*:\s*['"]([^'"]+)['"]/)
      if (!t || !SERIES_TYPES.has(t[1])) continue
      const d = o.text.match(/dataIndex\s*:\s*['"]([^'"]+)['"]/)
      if (!d) continue
      found.push({ file: f, line: o.line, dataIndex: d[1], type: t[1] })
    }
  }
  return found
}

function checkDataIndexes() {
  const tags = collectGoJsonTags()
  if (!tags)
    return {
      parseError: `找不到后端 api 目录：${BACKEND_API_DIRS.join(' / ')}`,
    }
  const series = collectSeriesDataIndexes()
  if (!series) return { parseError: `找不到 contents 目录：${CONTENTS_DIR}` }
  const checked = series.filter((s) => !FRONTEND_LOCAL_SERIES.has(s.dataIndex))
  const missing = checked.filter((s) => !tags.has(s.dataIndex))
  return { series, checked, missing }
}

// ---------------------------------------------------------------------------
// 判据二：接入范围由 i18n/index.ts 推导；key 集合直接求值模块取值（比正则稳）。
// ---------------------------------------------------------------------------
function collectWiredLangs() {
  if (!fs.existsSync(I18N_INDEX)) return null
  const src = fs.readFileSync(I18N_INDEX, 'utf8')
  const re = /from\s+['"]\.\/([a-z]{2})\/([A-Za-z0-9_.-]+)['"]/g
  const wired = new Map() // lang -> Set(nsFile)
  let m
  while ((m = re.exec(src)) !== null) {
    const lang = m[1]
    const ns = m[2].replace(/\.js$/, '') + '.js'
    if (!wired.has(lang)) wired.set(lang, new Set())
    wired.get(lang).add(ns)
  }
  return wired.size ? wired : null
}

function loadI18nKeys(file) {
  let src = fs.readFileSync(file, 'utf8')
  const m = src.match(/\b(?:const|let|var)\s+([A-Za-z0-9_$]+)\s*=\s*\{/)
  if (!m) return null
  const name = m[1]
  src = src.replace(/export\s+default[^\n;]*;?/, '')
  try {
    // eslint-disable-next-line no-new-func
    const obj = new Function(`${src}\nreturn ${name};`)()
    if (!obj || typeof obj !== 'object') return null
    return new Set(Object.keys(obj))
  } catch (e) {
    return null
  }
}

// 返回 { drift: {"<lang>/<ns>": [缺的 key…]}, unwired: [未接入语言…], parseError? }
function collectI18nDrift() {
  const wired = collectWiredLangs()
  if (!wired) return { parseError: `无法从 ${I18N_INDEX} 推导已接入语言` }

  const allDirs = fs.existsSync(I18N_DIR)
    ? fs
        .readdirSync(I18N_DIR)
        .filter((d) => fs.statSync(path.join(I18N_DIR, d)).isDirectory())
    : []
  const unwired = allDirs.filter((d) => !wired.has(d))

  const namespaces = new Set()
  for (const nsSet of wired.values()) nsSet.forEach((ns) => namespaces.add(ns))

  const drift = {}
  for (const ns of [...namespaces].sort()) {
    const perLang = {}
    for (const [lang, nsSet] of wired) {
      if (!nsSet.has(ns)) continue // 该语言没接入这个命名空间，不参与比较
      const file = path.join(I18N_DIR, lang, ns)
      perLang[lang] = fs.existsSync(file) ? loadI18nKeys(file) : null
    }
    const present = Object.keys(perLang).filter((l) => perLang[l])
    if (present.length < 2) continue
    const union = new Set()
    present.forEach((l) => perLang[l].forEach((k) => union.add(k)))
    for (const lang of present) {
      const miss = [...union].filter((k) => !perLang[lang].has(k))
      if (miss.length) drift[`${lang}/${ns}`] = miss.sort()
    }
  }
  return { drift, unwired }
}

function loadBaseline() {
  if (!fs.existsSync(BASELINE_FILE)) return {}
  try {
    return JSON.parse(fs.readFileSync(BASELINE_FILE, 'utf8')).drift || {}
  } catch (e) {
    return null
  }
}

function checkI18n(updateBaseline) {
  const res = collectI18nDrift()
  if (res.parseError) return res
  if (updateBaseline) {
    const payload = {
      _note:
        'i18n key 一致性基线：已接入语言（由 i18n/index.ts 的 import 推导）之间**既有**的 key 漂移。' +
        '机检只对「超出本基线的漂移」失败（只降不升）；补齐后跑 node ops/check_chart_series.js --update-baseline 收紧。' +
        '条目格式 "<lang>/<命名空间文件>" → 该文件相对同命名空间并集缺的 key 列表。',
      generated_at: new Date().toISOString().slice(0, 19) + 'Z',
      drift: res.drift,
    }
    fs.writeFileSync(BASELINE_FILE, JSON.stringify(payload, null, 2) + '\n')
    return { ...res, written: true }
  }
  const baseline = loadBaseline()
  if (baseline === null)
    return { parseError: `基线文件无法解析：${BASELINE_FILE}` }

  const grown = []
  const fixed = []
  for (const key of Object.keys(res.drift)) {
    const now = res.drift[key]
    const base = baseline[key] || []
    const added = now.filter((k) => !base.includes(k))
    if (added.length)
      grown.push({ key, added, base: base.length, now: now.length })
  }
  for (const key of Object.keys(baseline)) {
    if (!res.drift[key]) fixed.push(key)
  }
  return { ...res, baseline, grown, fixed }
}

// ---------------------------------------------------------------------------
function main() {
  const updateBaseline = process.argv.includes('--update-baseline')
  let failed = false

  // ---- 判据一 ----
  const d1 = checkDataIndexes()
  if (d1.parseError) {
    console.error(`✗ check:chart-series 无法解析：${d1.parseError}`)
    process.exit(2)
  }
  if (d1.missing.length) {
    failed = true
    console.error(
      '✗ check:chart-series —— 图表 series 的 dataIndex 在后端 api/*.go 里没有对应的 json tag：',
    )
    for (const m of d1.missing) {
      console.error(
        `  contents/${m.file}:${m.line} [${m.type}] dataIndex: '${m.dataIndex}'`,
      )
    }
    console.error(
      '  修法：把前端 dataIndex 改成后端 json tag 的逐字字段名，或补后端字段。',
    )
  } else {
    console.log(
      `✓ check:chart-series —— 图表 series dataIndex 全部命中后端 json tag` +
        `（来源 ${BACKEND_API_DIRS.filter((d) => fs.existsSync(d)).length} 个后端 api 目录；` +
        `检查 ${d1.checked.length} 处；已排除前端本地键 ${[...FRONTEND_LOCAL_SERIES].join(', ')}）`,
    )
  }

  // ---- 判据二 ----
  const d2 = checkI18n(updateBaseline)
  if (d2.parseError) {
    console.error(`✗ check:chart-series 无法解析：${d2.parseError}`)
    process.exit(2)
  }
  if (d2.written) {
    console.log(
      `✓ check:chart-series —— 已重写基线 ${path.relative(ROOT, BASELINE_FILE)}：` +
        `${Object.keys(d2.drift).length} 条既有漂移被记账（只降不升）。`,
    )
  } else if (d2.grown.length) {
    failed = true
    console.error(
      '✗ check:chart-series —— i18n 出现基线之外的新增漂移（同命名空间接入语言之间的 key 必须齐）：',
    )
    for (const g of d2.grown) {
      console.error(
        `  i18n/${g.key} 新增缺 key（${g.base}→${g.now}）：${g.added.slice(0, 8).join(', ')}`,
      )
    }
    console.error(
      '  修法：补齐缺失 key；确实属于历史欠账的，跑 --update-baseline 显式记账（会写进版本库）。',
    )
  } else {
    const debt = Object.keys(d2.drift).length
    console.log(
      `✓ check:chart-series —— 已接入语言 i18n key 无新增漂移` +
        `（接入语言：${[...collectWiredLangs().keys()].join('/')}；` +
        `基线内既有欠账 ${debt} 条${d2.fixed.length ? `；已补齐可收紧 ${d2.fixed.length} 条` : ''}）`,
    )
    if (d2.fixed.length) {
      console.log(
        `  提示：以下基线条目已修复，跑 --update-baseline 收紧：${d2.fixed.slice(0, 8).join(', ')}`,
      )
    }
  }

  if (d2.unwired && d2.unwired.length) {
    console.log(
      `  注：i18n/${d2.unwired.join(', i18n/')} 在仓库里但 i18n/index.ts 未 import（不生效的桩），不参与判据二。`,
    )
  }

  process.exit(failed ? 1 : 0)
}

main()
