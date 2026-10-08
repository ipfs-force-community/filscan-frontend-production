/**
 * ⚠️ Fake 数据 —— 仅用于本地渲染验证（批次 2 · 契约 E/F：服务受益方排行表，前 10 名）。
 *
 * 背景：后端新增 jsonrpc 方法 `RewardStreamLedger`（契约 E，此轮再增 recipient.claimed_period，
 * recipients 按 pending_claim 降序、不截断），前端据此把「区块奖励分配」改成仿「合约排行」的
 * 服务受益方排行表。本地拿不到真数据时，用本 fixture 让「已激活 / 未激活 / 字段缺失」三种数据
 * 以及「只显示前 10 名」的截断都能被肉眼验证。
 *
 * 命名遵循本仓 Fake 约定（不叫 Mock）。默认关闭：`USE_FAKE_REWARD_LEDGER = false`，
 * 组件默认走真实接口 `apiUrl.reward_stream_ledger`；只有显式置 true 时才走这里。
 * **不得把 Fake 数据当作长期数据源。**
 *
 * 端到端真机验证待后端 E 部署后（顺序：londobell → backend → frontend）进行。
 */

/** Fake 总开关：默认 false ⇒ 组件走真实接口。 */
export const USE_FAKE_REWARD_LEDGER = false

/** 三种数据形态：已激活（字段齐全）/ 未激活 / 已激活但字段缺失（后端只回了 nv29）。 */
export type FakeLedgerMode = 'active' | 'inactive' | 'missing'

/** 默认形态：已激活（字段齐全）。 */
export const FAKE_REWARD_LEDGER_MODE: FakeLedgerMode = 'active'

// 真实抓取值锚：epoch 取自 londobell Calibnet 读数；地址与份额为文档
// .hermes/plans/2026-10-08-nv29-adapt/README.md §9.2 勘误 / §11.2 Cali 实测的**真实值**：
//   份额表收件人 t0199897(73.7463%) / t0200442(26.2537%)，tombstone 收款人 t0200206；
//   三笔待提取量级 3,943.37 / 4,062.44 / 5,098.43 FIL，待提取合计 13,104.24 FIL。
// 其余 9 条为**示意值，非链上读数**（仅为把「只显示前 10 名」的截断摆出来）。
const REAL_EPOCH = 4129200

// attoFIL（1 FIL = 1e18 attoFIL）
const PENDING_TOTAL = '13104240000000000000000' // 13,104.24 FIL（= 下列三笔真实量级之和）
const REAL_RECIPIENTS = [
  {
    address: 't0200442',
    share_pct: '26.2537',
    claimed_period: '0',
    pending_claim: '5098430000000000000000', // 5,098.43 FIL（真实量级）
  },
  {
    address: 't0200206',
    share_pct: '0.00',
    claimed_period: '0',
    pending_claim: '4062440000000000000000', // 4,062.44 FIL（tombstone 收款人：已移除流遗留欠款）
    removed_stream: true, // 后端契约：该地址只出现在已移除流的遗留欠款里 ⇒ 份额列加「已移除流」小标记
  },
  {
    address: 't0199897',
    share_pct: '73.7463',
    claimed_period: '512340000000000000000', // 512.34 FIL（本期已提取示例）
    pending_claim: '3943370000000000000000', // 3,943.37 FIL（真实量级）
  },
]

// 9 条示意值（非链上读数）——金额均小于上面三笔真实量级，故按 pending 降序时排在第 4–12 位；
// 最小的两条（t0199008 / t0199009）落在第 11、12 位，用于肉眼确认「只显示前 10 名」的截断。
const ILLUSTRATIVE_RECIPIENTS = [
  {
    address: 't0199001',
    share_pct: '15.2000',
    claimed_period: '0',
    pending_claim: '1200000000000000000000',
  },
  {
    address: 't0199002',
    share_pct: '12.4000',
    claimed_period: '0',
    pending_claim: '980500000000000000000',
  },
  {
    address: 't0199003',
    share_pct: '9.6000',
    claimed_period: '0',
    pending_claim: '760250000000000000000',
  },
  {
    address: 't0199004',
    share_pct: '6.8000',
    claimed_period: '0',
    pending_claim: '540800000000000000000',
  },
  {
    address: 't0199005',
    share_pct: '5.1000',
    claimed_period: '0',
    pending_claim: '410150000000000000000',
  },
  {
    address: 't0199006',
    share_pct: '4.0500',
    claimed_period: '0',
    pending_claim: '320400000000000000000',
  },
  {
    address: 't0199007',
    share_pct: '2.6000',
    claimed_period: '0',
    pending_claim: '210750000000000000000',
  },
  {
    address: 't0199008',
    share_pct: '1.5500',
    claimed_period: '0',
    pending_claim: '120600000000000000000',
  },
  {
    address: 't0199009',
    share_pct: '0.7500',
    claimed_period: '0',
    pending_claim: '60300000000000000000',
  },
]

/**
 * 返回契约 E 形状的 fixture（外壳 {code,msg,data:{…}}）。
 * @param mode 'active' 字段齐全；'inactive' nv29:false；'missing' nv29:true 但其余字段缺失。
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
    // 后端只回了 nv29：其余字段缺失 ⇒ 表内必须显示 '--'，不得渲染成 0。
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
      pending_claim: PENDING_TOTAL,
      claimed_period: '512340000000000000000', // 本期已提取合计示例
      current_split: { miner: '50.0', service: '45.0', burn: '5.0' },
      // 已按 pending_claim 降序；共 12 条（前 10 名可见，最后两条为截断验证）
      recipients: [...REAL_RECIPIENTS, ...ILLUSTRATIVE_RECIPIENTS],
    },
  }
}
