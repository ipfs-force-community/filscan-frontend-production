/** @format */
/**
 * 「算力走势」图（src/statistics/Trend.tsx）的单位自适应 / 时间区间回退工具。
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

/** 左轴 = 有效算力/原值算力；右轴 = 算力净增/损失。两个轴各自定档。 */
export const POWER_TREND_AXIS_FIELDS: string[][] = [
  ['total_quality_adj_power', 'total_raw_byte_power'],
  ['power_increase', 'power_decrease'],
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

/** 每个轴按各自数据的最大绝对值定档 */
export function pickAxisUnits(
  list: any[],
  axisFields: string[][] = POWER_TREND_AXIS_FIELDS,
): PowerUnit[] {
  return axisFields.map((fields) => pickPowerUnit(maxAbsBytes(list, fields)))
}

/** Trend 的默认档位（改动前的写死值：后端 1m = 1 个月聚合） */
export const DEFAULT_TREND_INTERVAL = '1m'

/** 能画出折线的最少点数（< 2 点画不出线） */
export const MIN_TREND_POINTS = 2

/** 回退顺序：先试最短窗口（测试网状态只保留约 36h），不足再依次放大 */
export const TREND_INTERVAL_FALLBACKS: string[] = ['24h', '7d', '30d', '1y']

/** 该档位返回的点数是否够画线 */
export function hasEnoughPoints(list: any[] | null | undefined): boolean {
  return !!list && list.length >= MIN_TREND_POINTS
}

/** 按回退顺序取第一个点数足够的档位；都没有数据返回 null */
export function pickTrendFallbackInterval(
  counts: Record<string, number>,
  order: string[] = TREND_INTERVAL_FALLBACKS,
): string | null {
  for (const interval of order) {
    if ((counts?.[interval] ?? 0) >= MIN_TREND_POINTS) return interval
  }
  return null
}

/** 点数不足（测试网无历史数据）的档位，用于按钮置灰 */
export function unavailableTrendIntervals(
  counts: Record<string, number>,
  order: string[] = TREND_INTERVAL_FALLBACKS,
): string[] {
  return order.filter(
    (interval) => (counts?.[interval] ?? 0) < MIN_TREND_POINTS,
  )
}
