/** @format */
/**
 * utils/powerTrend.ts 的最小单测（纯函数级）。
 *
 * 运行方式（仓库没有 jest/vitest，用 Node 自带 test runner + tsc 编译）：
 *   npm run test:unit
 * 等价手工命令：
 *   npx tsc utils/powerTrend.ts utils/__tests__/powerTrend.test.ts \
 *     --outDir .test-build --module commonjs --target es2020 --esModuleInterop --skipLibCheck
 *   node --test .test-build/utils/__tests__/powerTrend.test.js
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'

import {
  DEFAULT_TREND_INTERVAL,
  POWER_UNIT_BYTES,
  formatPowerAxisTick,
  formatPowerWithUnit,
  hasEnoughPoints,
  maxAbsBytes,
  pickAxisUnits,
  pickPowerUnit,
  pickTrendFallbackInterval,
  powerUnitDigits,
  scaleToPowerUnit,
  scaleToPowerUnitForDisplay,
  shouldDrawNv29Line,
  unavailableTrendIntervals,
} from '../powerTrend'

const EiB = POWER_UNIT_BYTES.EiB
const PiB = POWER_UNIT_BYTES.PiB
const TiB = POWER_UNIT_BYTES.TiB

// —— 单位选择：三条验收口径 ——
test('pickPowerUnit: 12 EiB（主网有效算力量级）-> EiB', () => {
  assert.equal(pickPowerUnit(12.335739 * EiB), 'EiB')
})

test('pickPowerUnit: 1.04 PiB（calibration 有效算力量级）-> PiB', () => {
  assert.equal(pickPowerUnit(1.04 * PiB), 'PiB')
})

test('pickPowerUnit: < 1 PiB -> TiB', () => {
  assert.equal(pickPowerUnit(0.99 * PiB), 'TiB')
  assert.equal(pickPowerUnit(112 * TiB), 'TiB')
  assert.equal(pickPowerUnit(1), 'TiB')
  assert.equal(pickPowerUnit(0), 'TiB')
})

test('pickPowerUnit: 边界 1 EiB / 1 PiB 各自进档', () => {
  assert.equal(pickPowerUnit(EiB), 'EiB')
  assert.equal(pickPowerUnit(EiB / 2), 'PiB')
  assert.equal(pickPowerUnit(PiB), 'PiB')
  assert.equal(pickPowerUnit(PiB / 2), 'TiB')
})

test('pickPowerUnit: 负数取绝对值，不因符号退档', () => {
  assert.equal(pickPowerUnit(-12 * EiB), 'EiB')
  assert.equal(pickPowerUnit(-2 * PiB), 'PiB')
})

// —— 换算与文案 ——
test('scaleToPowerUnit / formatPowerWithUnit: 1.04 PiB 用 PiB 轴展示为 1.04', () => {
  assert.equal(scaleToPowerUnit(1.0352 * PiB, 'PiB', 2), 1.04)
  assert.equal(formatPowerWithUnit(1.0352 * PiB, 'PiB', 2), '1.04 PiB')
})

test('formatPowerWithUnit: 同一个字节值换不同单位结果不同（不插值，只是单位换算）', () => {
  const bytes = 1.0352 * PiB
  assert.equal(formatPowerWithUnit(bytes, 'TiB', 2), '1060.04 TiB')
  assert.equal(formatPowerWithUnit(bytes, 'PiB', 2), '1.04 PiB')
  assert.equal(formatPowerWithUnit(bytes, 'EiB', 3), '0.001 EiB')
})

test('formatPowerWithUnit: 小数值自动提升小数位，不会把非 0 显示成 0', () => {
  // 主网 1m 右轴按 EiB 定档时，某点净增 3.664e14 B
  assert.equal(formatPowerWithUnit(3.664e14, 'EiB', 2), '0.00032 EiB')
  // 真 0 仍然显示 0
  assert.equal(formatPowerWithUnit(0, 'EiB', 2), '0 EiB')
  assert.equal(formatPowerWithUnit('0', 'TiB', 2), '0 TiB')
  // 正常量级不受影响
  assert.equal(formatPowerWithUnit(2.391e14, 'TiB', 2), '217.46 TiB')
})

test('powerUnitDigits / scaleToPowerUnitForDisplay: 小数值补足小数位（tooltip 与轴同口径）', () => {
  assert.equal(powerUnitDigits(3.664e14, 'EiB', 2), 5)
  assert.equal(scaleToPowerUnitForDisplay(3.664e14, 'EiB', 2), 0.00032)
  assert.equal(powerUnitDigits(1.0352 * PiB, 'PiB', 2), 2)
  assert.equal(scaleToPowerUnitForDisplay(1.0352 * PiB, 'PiB', 2), 1.04)
  assert.equal(powerUnitDigits(2.391e14, 'TiB', 2), 2)
  assert.equal(scaleToPowerUnitForDisplay(2.391e14, 'TiB', 2), 217.46)
})

test('formatPowerAxisTick: 裁剪小数但不改量级', () => {
  assert.equal(formatPowerAxisTick(12.335739, 'EiB'), '12.34 EiB')
  assert.equal(formatPowerAxisTick(12, 'EiB'), '12 EiB')
  assert.equal(formatPowerAxisTick(1064.19, 'TiB'), '1064.19 TiB')
  assert.equal(formatPowerAxisTick(0.2074, 'TiB'), '0.2074 TiB')
  assert.equal(formatPowerAxisTick(0, 'PiB'), '0 PiB')
})

test('formatPowerAxisTick: 非法输入不崩溃', () => {
  assert.equal(formatPowerAxisTick('abc', 'EiB'), 'abc EiB')
})

// —— 序列取值（真实 API 量级） ——
test('maxAbsBytes / pickAxisUnits: 主网 1m 数据左轴 EiB、右轴按净增量级', () => {
  const list = [
    {
      total_quality_adj_power: 1.422e19, // ~12.34 EiB
      total_raw_byte_power: 1.595e18, // ~1.38 EiB
      power_increase: 2.773e18, // ~2.4 EiB
      power_decrease: 1.268e18,
    },
    {
      total_quality_adj_power: 1.393e19,
      total_raw_byte_power: 1.543e18,
      power_increase: 3.664e14,
      power_decrease: 8.724e14,
    },
  ]
  assert.equal(maxAbsBytes(list, ['total_quality_adj_power']), 1.422e19)
  // 右轴有单位上限 PiB（= 改动前的写死值）：即便样本到 EiB 量级也不上探，
  // 以保证主网显示与改动前逐字一致（上限回归见 powerTrendAxisCap.test.ts）
  assert.deepEqual(pickAxisUnits(list), ['EiB', 'PiB'])
})

test('pickAxisUnits: calibration 24h 数据左轴 PiB、右轴 TiB（两轴各自定档）', () => {
  const list = [
    {
      total_quality_adj_power: 1.17e15, // 1.04 PiB
      total_raw_byte_power: 1.231e14, // 111 TiB
      power_increase: 2.391e14, // 217 TiB
      power_decrease: 2.391e14,
    },
    {
      total_quality_adj_power: 1.164e15,
      total_raw_byte_power: 1.23e14,
      power_increase: 0,
      power_decrease: 0,
    },
  ]
  assert.deepEqual(pickAxisUnits(list), ['PiB', 'TiB'])
})

test('pickAxisUnits: calibration 1m（1 个点）仍按 PiB，不因点少改变单位口径', () => {
  const list = [
    {
      total_quality_adj_power: 1.165e15,
      total_raw_byte_power: 1.23e14,
      power_increase: 1.374e11,
      power_decrease: 0,
    },
  ]
  assert.deepEqual(pickAxisUnits(list), ['PiB', 'TiB'])
})

test('maxAbsBytes: 空数据 / 缺字段 -> 0，不抛错', () => {
  assert.equal(maxAbsBytes([], ['total_quality_adj_power']), 0)
  assert.equal(maxAbsBytes([{}], ['total_quality_adj_power']), 0)
  assert.equal(
    maxAbsBytes([{ total_quality_adj_power: null }] as any, [
      'total_quality_adj_power',
    ]),
    0,
  )
})

// —— 时间区间回退 & 置灰 ——
test('hasEnoughPoints: 1 个点画不出折线', () => {
  assert.equal(hasEnoughPoints([{}]), false)
  assert.equal(hasEnoughPoints([]), false)
  assert.equal(hasEnoughPoints(null), false)
  assert.equal(hasEnoughPoints([{}, {}]), true)
})

test('pickTrendFallbackInterval: calibration 实测计数（1m=1, 24h=46, 7d=34, 30d=34, 1y=1）-> 24h', () => {
  const counts = { '1m': 1, '24h': 46, '7d': 34, '30d': 34, '1y': 1 }
  assert.equal(pickTrendFallbackInterval(counts), '24h')
})

test('pickTrendFallbackInterval: 24h 无数据时退到 7d，再看 30d', () => {
  assert.equal(pickTrendFallbackInterval({ '24h': 1, '7d': 34 }), '7d')
  assert.equal(pickTrendFallbackInterval({ '30d': 34 }), '30d')
  assert.equal(pickTrendFallbackInterval({ '1y': 12 }), '1y')
})

test('pickTrendFallbackInterval: 全档位都没数据 -> null（不拿假数据充数）', () => {
  assert.equal(
    pickTrendFallbackInterval({ '24h': 1, '7d': 0, '30d': 1, '1y': 1 }),
    null,
  )
  assert.equal(pickTrendFallbackInterval({}), null)
})

test('unavailableTrendIntervals: 主网全档位有数据 -> 无置灰项', () => {
  const mainnet = { '24h': 46, '7d': 23, '30d': 290, '1y': 12 }
  assert.deepEqual(unavailableTrendIntervals(mainnet), [])
})

test('unavailableTrendIntervals: 测试网 1y=1 -> 仅 1y 置灰', () => {
  const cali = { '24h': 46, '7d': 34, '30d': 34, '1y': 1 }
  assert.deepEqual(unavailableTrendIntervals(cali), ['1y'])
})

test('默认档位保持 1m（改动前行为）', () => {
  assert.equal(DEFAULT_TREND_INTERVAL, '1m')
})

test('常量自检：三档单位是 1024 的 4/5/6 次方', () => {
  assert.equal(TiB, Math.pow(1024, 4))
  assert.equal(PiB, Math.pow(1024, 5))
  assert.equal(EiB, Math.pow(1024, 6))
})

test('超过 Number 安全整数范围的字节能正常定档（只比量级，不受浮点精度影响）', () => {
  assert.ok(1.422e19 > Number.MAX_SAFE_INTEGER)
  assert.equal(pickPowerUnit(1.422e19), 'EiB') // 主网有效算力 12.34 EiB
  assert.equal(pickPowerUnit('1.422e19'), 'EiB') // 后端字段是字符串形式的数值
  assert.equal(pickPowerUnit(1.2e16), 'PiB') // 10.65 PiB
})

// —— NV29 解释层竖线：shouldDrawNv29Line ——
// 口径：仅当「窗口跨越激活高度」（首点 epoch < nv29Epoch 且窗口内存在 >= nv29Epoch 的点）
// 才返回该点下标；其余一律 -1。
test('shouldDrawNv29Line: 窗口跨越激活高度 -> 返回首个 >= nv29 的点下标', () => {
  // 测试网 30d 窗口跨越激活高度 4,109,133（激活点落在窗口中部）
  const items = [
    { epoch: 4106000 },
    { epoch: 4109000 },
    { epoch: 4109133 }, // = nv29Epoch，命中
    { epoch: 4110000 },
  ]
  assert.equal(shouldDrawNv29Line(items, 4109133), 2)
})

test('shouldDrawNv29Line: 窗口内恰有等于激活高度的点（>= 而非 >）', () => {
  assert.equal(shouldDrawNv29Line([{ epoch: 100 }, { epoch: 200 }], 200), 1)
})

test('shouldDrawNv29Line: 全窗都在激活之前 -> -1（窗口没到激活高度）', () => {
  assert.equal(shouldDrawNv29Line([{ epoch: 100 }, { epoch: 200 }], 300), -1)
})

test('shouldDrawNv29Line: 全窗都在激活之后 -> -1（否则会误画在左边缘）', () => {
  assert.equal(shouldDrawNv29Line([{ epoch: 300 }, { epoch: 400 }], 200), -1)
  // 首点恰等于激活高度也算「整窗在激活之后」，不画
  assert.equal(shouldDrawNv29Line([{ epoch: 200 }, { epoch: 300 }], 200), -1)
})

test('shouldDrawNv29Line: nv29Epoch <= 0（未排期/字段缺失）-> -1', () => {
  assert.equal(shouldDrawNv29Line([{ epoch: 1 }, { epoch: 2 }], 0), -1)
  assert.equal(shouldDrawNv29Line([{ epoch: 1 }, { epoch: 2 }], -1), -1)
  // 主网当前 nv29_epoch 为 0 / 字段缺失 => Number(undefined || 0) = 0
  assert.equal(shouldDrawNv29Line([{ epoch: 1 }, { epoch: 2 }], 0), -1)
  assert.equal(shouldDrawNv29Line([{ epoch: 1 }, { epoch: 2 }], NaN), -1)
})

test('shouldDrawNv29Line: 点数 < 2 -> -1（画不出面）', () => {
  assert.equal(shouldDrawNv29Line([], 200), -1)
  assert.equal(shouldDrawNv29Line([{ epoch: 100 }], 200), -1)
  assert.equal(shouldDrawNv29Line(null as any, 200), -1)
})

test('shouldDrawNv29Line: 条目缺 epoch（后端尚未发该字段）-> -1，不抛错', () => {
  const items = [{ timestamp: 1 }, { timestamp: 2 }, { timestamp: 3 }]
  assert.equal(shouldDrawNv29Line(items, 4109133), -1)
})
