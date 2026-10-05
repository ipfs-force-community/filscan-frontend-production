/**
 * ⚠️ Fake 数据 —— 仅用于本地渲染验证。
 *
 * 背景：后端「区块奖励流向」接口（契约 B）此刻尚未部署，本地拿不到真数据，
 * 因此按契约 B 的响应形状构造一段固定序列，让本卡的渲染/切档/竖线逻辑可被肉眼验证。
 *
 * 命名遵循本仓 Fake 约定（不叫 Mock）。默认关闭：`USE_FAKE_REWARD_STREAMS = false`，
 * 组件默认走真实接口 `apiUrl.static_reward_streams`；只有把开关显式置 true 时才走这里。
 * **不得把 Fake 数据当作长期数据源**。
 *
 * 端到端真机验证待主会话部署后端接口后进行。
 */

/** Fake 总开关：默认 false ⇒ 组件走真实接口。 */
export const USE_FAKE_REWARD_STREAMS = false

/**
 * Fake 用的 NV29 激活高度：
 *   - 0   ⇒ 未排期（主网当前口径）：全窗口 miner=100%，不画竖线；
 *   - >0  ⇒ 已激活（Cali 口径）：激活点之后按权重拆成 miner/service/burn，并画竖线。
 */
export const FAKE_REWARD_STREAMS_NV29_EPOCH = 0

const ONE_FIL = 1000000000000000000 // 1 FIL = 1e18 attoFIL

// 固定形状：窗口内的点数（24h=每小时 1 点；7d/30d=每天 1 点）
const FAKE_POINTS: Record<string, number> = { '24h': 24, '7d': 7, '30d': 30 }

/**
 * 返回契约 B 形状的固定序列（外壳 {code,msg,data:{nv29_epoch,items}}）。
 * 各字段均按 attoFIL 十进制字符串给出，与现有统计曲线口径一致。
 */
export function fakeRewardStreamsResponse(interval: string) {
  const points = FAKE_POINTS[interval] || 24
  const stepSec = interval === '24h' ? 3600 : 86400
  const stepEpoch = interval === '24h' ? 120 : 2880
  const baseTime = Math.floor(Date.now() / 1000) - (points - 1) * stepSec
  const baseEpoch = 6430000

  const nv29 = FAKE_REWARD_STREAMS_NV29_EPOCH

  const items = []
  for (let i = 0; i < points; i++) {
    const epoch = baseEpoch + i * stepEpoch
    // 每个窗口的总区块奖励（attoFIL；随点位轻微起伏，仅形状示意）
    const total = (800 + (i % 6) * 30) * ONE_FIL
    // 与真实语义一致：激活高度之后（epoch >= nv29）才按权重拆分
    const split = nv29 > 0 && epoch >= nv29
    // 拆分后示意权重：矿工 50% / 服务流 35% / 销毁 15%
    const miner = split ? total * 0.5 : total
    const service = split ? total * 0.35 : 0
    const burn = split ? total * 0.15 : 0
    items.push({
      block_time: baseTime + i * stepSec,
      epoch,
      miner: String(Math.round(miner)),
      service: String(Math.round(service)),
      burn: String(Math.round(burn)),
      total: String(Math.round(miner + service + burn)),
    })
  }

  return { code: 0, msg: '', data: { nv29_epoch: nv29, items } }
}
