/**
 * ⚠️ Fake 数据 —— 仅用于本地渲染验证（首页「区块奖励分配」块）。
 *
 * 背景：后端 TotalIndicators 的累计三股字段（契约 A2：reward_stream_minted_total /
 * reward_stream_miner_total / reward_stream_service_total / reward_stream_burn_minted_total）
 * 此刻尚未部署到线上，本地拿不到真数据，故按 A2 的响应形状构造 fixture，让两种分支
 * （已激活 NV29 / 未激活）都能被肉眼验证。
 *
 * 命名遵循本仓 Fake 约定（不叫 Mock）。默认关闭：`USE_FAKE_HOME_ALLOCATION = false`，
 * 组件默认走真实接口 `apiUrl.home_meta`；只有显式置 true 时才走这里。**不得当作长期数据源。**
 *
 * 端到端真机验证待主会话部署后端 A2 字段后进行。
 */

/** Fake 总开关：默认 false ⇒ 组件走真实接口。 */
export const USE_FAKE_HOME_ALLOCATION = false

/**
 * Fake 用的 NV29 激活高度与当前高度：
 *   - `FAKE_HOME_ALLOC_NV29_EPOCH = 0`（或高于当前高度）⇒ 未激活分支：只显示一句说明；
 *   - 置为已过的高度（如 Cali 实测 4,109,133）⇒ 激活分支：显示三股与占比。
 * Cali 激活高度来源：NV29 impact README §0（params_calibnet.go）。
 */
export const FAKE_HOME_ALLOC_NV29_EPOCH = 4109133
export const FAKE_HOME_ALLOC_LATEST_HEIGHT = 4200000

/**
 * FIL（整数）→ attoFIL 十进制字符串（本仓约定：接口按 attoFIL 下发，展示用 formatFil ÷1e18）。
 * 用字符串补零而非 Number 相乘，避免 1e18 量级下的浮点精度损失。
 */
const toAtto = (fil: number): string => String(fil) + '0'.repeat(18)

/**
 * 返回契约 A2 形状的 fixture（外壳 {total_indicators:{…}}）。
 *
 * 数值口径取自 NV29 impact README 的 Cali 实测比例（形状示意，非逐值复刻）：
 *   - 近 24h 三流比例 50.0% / 45.0% / 5.0%（README §0「近 2 小时 50.00 / 45.00 / 5.00」）；
 *   - 累计三股按 111 / 40 / 8 FIL×1e6 的整数构造，合计恰为三者之和（自洽）。
 */
export function fakeHomeAllocationData() {
  return {
    total_indicators: {
      nv29_epoch: FAKE_HOME_ALLOC_NV29_EPOCH,
      latest_height: FAKE_HOME_ALLOC_LATEST_HEIGHT,
      // 累计（attoFIL）
      reward_stream_minted_total: toAtto(159000000),
      reward_stream_miner_total: toAtto(111000000),
      reward_stream_service_total: toAtto(40000000),
      reward_stream_burn_minted_total: toAtto(8000000),
      // 近 24h（attoFIL）
      reward_stream_miner_24h: toAtto(50000),
      reward_stream_service_24h: toAtto(45000),
      reward_stream_burn_24h: toAtto(5000),
      reward_stream_total_24h: toAtto(100000),
    },
  }
}
