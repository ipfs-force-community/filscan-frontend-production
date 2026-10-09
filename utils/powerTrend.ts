/** @format */
/**
 * 「算力走势」图（src/statistics/Trend.tsx）的单位自适应 / 档位可用性工具。
 *
 * 设计约束：
 * 1) 纯函数、零依赖（不 import React / next / dayjs），可被单测直接引用；
 * 2) 只做「换算」和「选档」判断，不插值、不造假数据；
 * 3) 1024 进制，与 utils/index.tsx 里 unitConversion 的 sizes 表保持一致。
 */

export type PowerUnit = 'EiB' | 'PiB' | 'TiB'

/** 单位在 1024 进制表里的下标（与 utils.unitConversion 的 num 参数对齐） */
export const POWER_UNIT_INDEX: Record<PowerUnit, number> = {
  TiB: 4,
  PiB: 5,
  EiB: 6,
}

export const POWER_UNIT_BYTES: Record<PowerUnit, number> = {
  TiB: Math.pow(1024, 4),
  PiB: Math.pow(1024, 5),
  EiB: Math.pow(1024, 6),
}

/**
 * 按数据量级选单位。
 * >= 1 EiB  -> EiB（主网有效算力 ~12 EiB 仍显示 EiB，不会退到小单位）
 * >= 1 PiB  -> PiB（calibration 有效算力 ~1.04 PiB）
 * 其余      -> TiB（含 < 1 TiB，三档到底，不再向下退）
 */
export function pickPowerUnit(maxBytes: number | string): PowerUnit {
  const v = Math.abs(Number(maxBytes) || 0)
  if (v >= POWER_UNIT_BYTES.EiB) return 'EiB'
  if (v >= POWER_UNIT_BYTES.PiB) return 'PiB'
  return 'TiB'
}

/** 字节 -> 指定单位下的数值（保留 len 位小数，默认 4 位） */
export function scaleToPowerUnit(
  bytes: number | string,
  unit: PowerUnit,
  len = 4,
): number {
  const n = Number(bytes) || 0
  const pow = Math.pow(10, Math.max(0, len))
  return Math.round((n / POWER_UNIT_BYTES[unit]) * pow) / pow
}

/**
 * 数值远小于最小可表示精度时提升小数位（避免非 0 显示成 0），返回该小数位数。
 * 例：EiB 档下 3.664e14 B = 0.00032（2 位会变成 0.00）→ 返回 5。
 */
export function powerUnitDigits(
  bytes: number | string,
  unit: PowerUnit,
  len = 2,
): number {
  const value = Number(bytes) || 0
  const scaled = value / POWER_UNIT_BYTES[unit]
  if (scaled !== 0 && Math.abs(scaled) < Math.pow(10, -len)) {
    return Math.min(6, -Math.floor(Math.log10(Math.abs(scaled))) + 1)
  }
  return len
}

/** 与 formatPowerWithUnit 同口径的数值（tooltip 需要把数值和单位分开时用） */
export function scaleToPowerUnitForDisplay(
  bytes: number | string,
  unit: PowerUnit,
  len = 2,
): number {
  return scaleToPowerUnit(bytes, unit, powerUnitDigits(bytes, unit, len))
}

/**
 * 字节 -> 数值 + 单位，如 `1.04 PiB`（len 默认 2，与原有 tooltip 风格一致）。
 * 单位不变，但数值远小于最小可表示精度时自动提升小数位，
 * 避免「非 0 的值被显示成 0」（例如主网右轴用 EiB 时，某点净增 3.6e14 B = 0.00032 EiB）。
 * 真正的 0 仍然显示 0。
 */
export function formatPowerWithUnit(
  bytes: number | string,
  unit: PowerUnit,
  len = 2,
): string {
  return `${scaleToPowerUnitForDisplay(bytes, unit, len)} ${unit}`
}

/**
 * 轴刻度文案。轴上的数值已经是目标单位，这里只裁剪小数：
 * 12.335739 -> `12.34 EiB`；1064.19 -> `1064.19 TiB`；0.2074 -> `0.2074 TiB`
 */
export function formatPowerAxisTick(
  value: number | string,
  unit: PowerUnit,
): string {
  const n = Number(value)
  if (!isFinite(n)) return `${value} ${unit}`
  const abs = Math.abs(n)
  const rounded = Number(n.toFixed(abs >= 1 ? 2 : 4))
  return `${rounded} ${unit}`
}

/** 左轴 = 有效算力（QA）+ 原值算力（RAW）；右轴 = 可升级算力 + 算力增量（change_quality_adj_power）。两个轴各自定档。 */
export const POWER_TREND_AXIS_FIELDS: string[][] = [
  ['total_quality_adj_power', 'total_raw_byte_power'],
  ['pending_upgrade_power', 'change_quality_adj_power'],
]

/** 给定序列里指定字段的最大绝对值（字节）；空数据返回 0 */
export function maxAbsBytes(list: any[], fields: string[]): number {
  let max = 0
  ;(list || []).forEach((item) => {
    fields.forEach((field) => {
      const v = Math.abs(Number(item?.[field]))
      if (isFinite(v) && v > max) max = v
    })
  })
  return max
}

/**
 * 每个轴的单位上限：与改动前的写死值一致（左轴 EiB、右轴 PiB）。
 * 定档只允许为量级更小的网络（测试网）向下取小单位，不允许超过上限
 * ⇒ 主网（左轴 12.3 EiB / 右轴 ~2500 PiB）显示与改动前逐字一致。
 */
export const POWER_TREND_AXIS_UNIT_CAPS: PowerUnit[] = ['EiB', 'PiB']

/** 把单位压到不超过上限；上限比 unit 更小则返回上限 */
export function capPowerUnit(unit: PowerUnit, cap?: PowerUnit): PowerUnit {
  if (!cap) return unit
  return POWER_UNIT_INDEX[unit] > POWER_UNIT_INDEX[cap] ? cap : unit
}

/** 每个轴按各自数据的最大绝对值定档（再按该轴单位上限收敛） */
export function pickAxisUnits(
  list: any[],
  axisFields: string[][] = POWER_TREND_AXIS_FIELDS,
  caps: PowerUnit[] = POWER_TREND_AXIS_UNIT_CAPS,
): PowerUnit[] {
  return axisFields.map((fields, i) =>
    capPowerUnit(pickPowerUnit(maxAbsBytes(list, fields)), caps[i]),
  )
}

/**
 * Trend 的默认档位（7 天；与 contents/statistic.tsx 的 power_trend_intervals 一致）。
 * 默认避开 30d：主网 30d 档接口实测约 11s（24h/7d 分别 ~0.2s/~1.1s），
 * 30d 仍是可选档位，只是不再作为首屏默认（属已登记的既有后端性能问题）。
 */
export const DEFAULT_TREND_INTERVAL = '7d'

/** 能画出折线的最少点数（< 2 点画不出线） */
export const MIN_TREND_POINTS = 2

/** 四个档位（与 contents/statistic.tsx 的 power_trend_intervals 一致）：用于置灰判断与预取 */
export const TREND_INTERVALS: string[] = ['24h', '7d', '30d', '1y']

/** 点数不足（测试网无历史数据）的档位，用于按钮置灰 */
export function unavailableTrendIntervals(
  counts: Record<string, number>,
  order: string[] = TREND_INTERVALS,
): string[] {
  return order.filter(
    (interval) => (counts?.[interval] ?? 0) < MIN_TREND_POINTS,
  )
}

/**
 * NV29 解释层竖线：返回应当画竖线的点下标，否则 -1。
 *
 * 只在**窗口跨越激活高度**时画线（`items[idx].epoch >= nv29Epoch` 且
 * `items[0].epoch < nv29Epoch`，即窗口内既有激活前、又有激活后的点）——
 * 否则整窗都在激活之后，画在左边缘会被误读成「NV29 在本窗口起点激活」。
 * `nv29Epoch <= 0`（未排期/接口未带该字段）或点数 < 2 一律 -1。
 */
export function shouldDrawNv29Line(items: any[], nv29Epoch: number): number {
  if (!(Number(nv29Epoch) > 0)) return -1
  if (!items || items.length < MIN_TREND_POINTS) return -1
  const idx = items.findIndex((it) => Number(it?.epoch) >= nv29Epoch)
  if (idx < 0) return -1
  if (!(Number(items[0]?.epoch) < nv29Epoch)) return -1
  return idx
}
