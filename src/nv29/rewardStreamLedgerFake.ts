/**
 * ⚠️ Fake 数据 —— 仅用于本地渲染验证（批次 2 · 契约 F1 的新增三项）。
 *
 * 背景：后端新增 jsonrpc 方法 `RewardStreamLedger`（契约 E）此刻尚未部署，本地拿不到真数据，
 * 故按契约 E 的响应形状构造 fixture，让「NV29 已激活 / 未激活 / 字段缺失」三种数据下都能被
 * 肉眼验证。
 *
 * 命名遵循本仓 Fake 约定（不叫 Mock）。默认关闭：`USE_FAKE_REWARD_LEDGER = false`，
 * 组件默认走真实接口 `apiUrl.reward_stream_ledger`；只有显式置 true 时才走这里。
 * **不得把 Fake 数据当作长期数据源。**
 *
 * 端到端真机验证待主会话部署后端 E 后（顺序：londobell → backend → frontend）进行。
 */

/** Fake 总开关：默认 false ⇒ 组件走真实接口。 */
export const USE_FAKE_REWARD_LEDGER = false

/** 三种数据形态：已激活（字段齐全）/ 未激活 / 已激活但字段缺失（后端只回了 nv29）。 */
export type FakeLedgerMode = 'active' | 'inactive' | 'missing'

/** 默认形态：已激活（字段齐全）。 */
export const FAKE_REWARD_LEDGER_MODE: FakeLedgerMode = 'active'

// 取真实抓取值作锚：epoch 与 TotalExplicitMinted 来自 londobell 仓
// cmd/londobell-api/controller/aggregators/reward_streams_test.go 里的 Calibnet v19 真实读数
// （`{"Epoch":4129200, ... "TotalExplicitMinted":"77211820386747518854736"}`）——
// TotalExplicitMinted 即「服务流累计铸造量」，与「待提取（奖励池欠服务方）」同量纲，
// 用它当 pending_claim 的示意值（非逐值复刻，仅量级/形状正确）。current_split / recipients
// 形状与示例值取自本批次契约 E 的响应示例（`{"current_split":{"miner":"50.0",...},
// "recipients":[{"address":"f014260492","share_pct":"73.75",...}]}`）。
const REAL_EPOCH = 4129200
const REAL_EXPLICIT_MINTED = '77211820386747518854736'

/**
 * 返回契约 E 形状的 fixture（外壳 {code,msg,data:{…}}）。
 * @param mode 'active' 三股/受益方齐全；'inactive' nv29:false；'missing' nv29:true 但其余字段缺失。
 */
export function fakeRewardStreamLedgerResponse(
  mode: FakeLedgerMode = FAKE_REWARD_LEDGER_MODE,
) {
  if (mode === 'inactive') {
    return {
      code: 0,
      msg: '',
      data: {
        epoch: REAL_EPOCH,
        nv29: false,
        pending_claim: '0',
        claimed_period: '0',
        current_split: { miner: '100.0', service: '0.0', burn: '0.0' },
        recipients: [],
      },
    }
  }

  if (mode === 'missing') {
    // 后端只回了 nv29：其余字段缺失 ⇒ 三项必须显示 '--'，不得渲染成 0。
    return {
      code: 0,
      msg: '',
      data: { epoch: REAL_EPOCH, nv29: true },
    }
  }

  return {
    code: 0,
    msg: '',
    data: {
      epoch: REAL_EPOCH,
      nv29: true,
      pending_claim: REAL_EXPLICIT_MINTED,
      claimed_period: '0',
      current_split: { miner: '50.0', service: '45.0', burn: '5.0' },
      recipients: [
        {
          address: 'f014260492',
          share_pct: '73.75',
          pending_claim: REAL_EXPLICIT_MINTED,
        },
      ],
    },
  }
}
