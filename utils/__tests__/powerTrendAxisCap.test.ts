/** @format */
/**
 * 「算力走势」轴单位上限的回归测试（Node 自带 test runner，与 powerTrend.test.ts 同风格）。
 *
 * 目的：轴单位自适应不得改变主网现有显示 —— 左轴上限 EiB、右轴上限 PiB
 * （两者都是改动前的写死值），只允许为测试网量级向下取小单位。
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'

import {
  POWER_TREND_AXIS_UNIT_CAPS,
  POWER_UNIT_BYTES,
  capPowerUnit,
  pickAxisUnits,
  pickPowerUnit,
} from '../powerTrend'

const EiB = POWER_UNIT_BYTES.EiB
const PiB = POWER_UNIT_BYTES.PiB
const TiB = POWER_UNIT_BYTES.TiB

test('capPowerUnit：不超过上限原样返回', () => {
  assert.equal(capPowerUnit('PiB', 'EiB'), 'PiB')
  assert.equal(capPowerUnit('EiB', 'EiB'), 'EiB')
  assert.equal(capPowerUnit('TiB', 'PiB'), 'TiB')
})

test('capPowerUnit：超过上限压到上限', () => {
  assert.equal(capPowerUnit('EiB', 'PiB'), 'PiB')
  assert.equal(capPowerUnit('EiB', 'TiB'), 'TiB')
})

test('capPowerUnit：不传上限时不收敛', () => {
  assert.equal(capPowerUnit('EiB'), 'EiB')
})

test('上限常量本身：左轴 EiB、右轴 PiB', () => {
  assert.deepEqual(POWER_TREND_AXIS_UNIT_CAPS, ['EiB', 'PiB'])
})

test('主网量级：左轴 EiB 不变，右轴（原值两档）即便到 EiB 量级也仍为 PiB（不上探）', () => {
  const list = [
    {
      total_quality_adj_power: 12.31 * EiB,
      total_raw_byte_power: 1.38 * EiB,
      full_multiplier_power: 1.21 * EiB,
      pending_upgrade_power: 0.17 * EiB,
    },
  ]
  assert.deepEqual(pickAxisUnits(list), ['EiB', 'PiB'])
})

test('测试网量级（cali：QA 1.03 PiB / 原值两档 105 TiB & 6.8 TiB）：左 PiB、右 TiB', () => {
  const list = [
    {
      total_quality_adj_power: 1.03 * PiB,
      total_raw_byte_power: 0.107 * PiB,
      full_multiplier_power: 105 * TiB,
      pending_upgrade_power: 6.8 * TiB,
    },
  ]
  assert.deepEqual(pickAxisUnits(list), ['PiB', 'TiB'])
})

test('去掉上限时右轴才会取 EiB（证明上限确实在起作用）', () => {
  const list = [
    {
      total_quality_adj_power: 12.31 * EiB,
      full_multiplier_power: 1.21 * EiB,
      pending_upgrade_power: 0.17 * EiB,
    },
  ]
  assert.deepEqual(pickAxisUnits(list, undefined, []), ['EiB', 'EiB'])
  assert.equal(pickPowerUnit(1.21 * EiB), 'EiB')
})

test('空数据不报错', () => {
  assert.deepEqual(pickAxisUnits([]), ['TiB', 'TiB'])
})
