#!/usr/bin/env node
/**
 * 守卫：「全网指标」数字墙每格只能是一个数字。
 *
 * 判据：contents/home.tsx 里的指标清单（home_meta = 首页「网络概览」墙、
 * meta_list = 统计页 /statistics/charts#networks 的「全网指标」墙）中，
 * **不得出现大写开头的 JSX 标签**（`<Foo … />` 即 React 组件）。
 * 允许的只有小写标签（span / i / b / br / div）与纯文本数字。
 *
 * 背景：曾把块级组件 `<RewardAllocationBlock/>` 塞进 meta_list 的一格，
 * 整块面板在网格里铺开、把整行撑到 700px+，后续卡片被挤到很远
 * （用户 2026-10-08：「红框里的网页完全不应该出现在这里，这里只能是一个数字」）。
 * 块级组件的落点是专门的位置（首页 RewardAllocation 卡、统计页 #reward_split 卡），不是数字墙。
 *
 * 用法：node ops/check_meta_tiles.js [待检查文件]   退出码 0=通过，1=违约，2=脚本自身无法解析
 *      （默认 contents/home.tsx；传文件便于对它做反向自测）
 */
const fs = require('fs')
const path = require('path')

const FILE = path.resolve(
  process.argv[2] || path.join(__dirname, '..', 'contents', 'home.tsx'),
)

function findArrayRegions(lines) {
  const regions = []
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^export const ([A-Za-z0-9_]+) = \[/)
    if (!m) continue
    let depth = 0
    let end = -1
    for (let j = i; j < lines.length; j++) {
      depth += (lines[j].match(/\[/g) || []).length
      depth -= (lines[j].match(/\]/g) || []).length
      if (j > i && depth <= 0) {
        end = j
        break
      }
    }
    regions.push({ name: m[1], start: i, end: end < 0 ? lines.length - 1 : end })
  }
  return regions
}

function main() {
  if (!fs.existsSync(FILE)) {
    console.error(`check:meta-tiles 无法解析：找不到 ${FILE}`)
    process.exit(2)
  }
  const lines = fs.readFileSync(FILE, 'utf8').split('\n')
  const regions = findArrayRegions(lines)
  if (regions.length === 0) {
    console.error('check:meta-tiles 无法解析：contents/home.tsx 里没找到 `export const X = [` 清单')
    process.exit(2)
  }

  const violations = []
  for (const r of regions) {
    for (let k = r.start; k <= r.end; k++) {
      const line = lines[k]
      // 大写开头的 JSX 标签 = React 组件（块级内容）；自闭合与闭合标签都算
      const tagRe = /<(\/?)([A-Z][A-Za-z0-9_.]*)/g
      let m
      while ((m = tagRe.exec(line)) !== null) {
        violations.push({
          name: r.name,
          line: k + 1,
          tag: `${m[1]}${m[2]}`,
          text: line.trim().slice(0, 100),
        })
      }
    }
  }

  if (violations.length > 0) {
    console.error('✗ check:meta-tiles —— 数字墙里出现了块级组件（每格只能是一个数字）：')
    for (const v of violations) {
      console.error(`  contents/home.tsx:${v.line} [${v.name}] <${v.tag}>  ${v.text}`)
    }
    console.error(
      '  修法：把块级组件移到它的专用位置（首页 RewardAllocation 卡 / 统计页 #reward_split 卡），' +
        '数字墙这一格只留一个数字（dataIndex 取标量字段 + render 返回数字/文本）。',
    )
    process.exit(1)
  }

  const names = regions.map((r) => r.name).join(', ')
  console.log(`✓ check:meta-tiles —— 数字墙清单（${names}）内无块级组件，每格仍是一个数字`)
}

main()
