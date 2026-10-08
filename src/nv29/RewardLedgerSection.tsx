/** @format */

import { Translation } from '@/components/hooks/Translation'
import { formatFil, formatNumber } from '@/utils'
import { useState } from 'react'
import classNames from 'classnames'
import styles from './RewardLedgerSection.module.scss'

/** 三股配色（与首页/统计页既有三流色一致）。 */
export const MINER_COLOR = '#1C6AFD'
export const SERVICE_COLOR = '#4ACAB4'
export const BURN_COLOR = '#F8CD4D'

/** 字段缺失的统一占位（契约 F：缺失一律显示 `--`，不得把 undefined 渲染成 0）。 */
export const DASH = '--'

/** 金额（attoFIL 字符串）→ FIL 展示；缺失 ⇒ `--`。 */
export function ledgerFil(v: any): string {
  if (v === undefined || v === null || v === '') return DASH
  return String(formatNumber(formatFil(v, 'FIL'), 2))
}

/** 百分比（后端已给 "50.0" 形态）→ "50.0%"；缺失 ⇒ `--`。 */
export function ledgerPct(v: any): string {
  if (v === undefined || v === null || v === '') return DASH
  return `${v}%`
}

export interface LedgerRecipient {
  address?: string
  share_pct?: string
  pending_claim?: string
}

/**
 * 后端方法 `RewardStreamLedger`（契约 E）响应形状。
 * 金额字段一律 attoFIL 十进制字符串；`current_split` 为当前评估权重百分比（一位小数）。
 */
export interface RewardStreamLedger {
  epoch?: number
  nv29?: boolean
  pending_claim?: string
  claimed_period?: string
  current_split?: { miner?: string; service?: string; burn?: string }
  recipients?: LedgerRecipient[]
}

interface Props {
  ledger?: RewardStreamLedger | null
  ns?: 'home' | 'static'
  /** 是否已激活 NV29。默认取 ledger.nv29 === true；首页可显式传入（由高度判定）。 */
  active?: boolean
  className?: string
}

/**
 * 区块奖励分配「新增三项」（契约 F1），首页块与统计页卡共用：
 *   1) 待提取（奖励池欠服务方）= ledger.pending_claim；
 *   2) 当前分账比例（链上日程）= ledger.current_split —— **与「近24h实测占比」是两个口径**，
 *      文案分开写（本行标题自带「链上日程」，24h 实测占比另由宿主块标注）；
 *   3) 受益方明细（地址 / 份额 / 待付）= ledger.recipients，默认展开、可折叠。
 *
 * 未激活 NV29 ⇒ 不渲染任何一项（返回 null，宿主保持既有单一文案）。
 * 字段缺失 ⇒ 逐项显示 `--`。
 */
export function RewardLedgerSection({
  ledger,
  ns = 'home',
  active,
  className,
}: Props) {
  const { tr } = Translation({ ns })
  const [open, setOpen] = useState(true)

  const isActive = active === undefined ? ledger?.nv29 === true : active
  if (!isActive) return null

  const split = ledger?.current_split
  const recipients = ledger?.recipients
  const rows: Array<LedgerRecipient | null> = Array.isArray(recipients)
    ? recipients.length > 0
      ? recipients
      : [null]
    : [null]

  return (
    <div className={classNames(styles.wrap, className)}>
      <div className={styles.pendingRow}>
        <span className={styles.pendingLabel}>
          {tr('reward_stream_pending_claim')}
        </span>
        <span className={styles.pendingValue}>
          {ledgerFil(ledger?.pending_claim)}
          <span className={styles.unit}> FIL</span>
        </span>
      </div>

      <div className={styles.splitBlock}>
        <div className={styles.splitTitle}>
          {tr('reward_stream_split_schedule')}
        </div>
        <div className={styles.splitRow}>
          <span className={styles.splitItem}>
            <i className={styles.dot} style={{ background: MINER_COLOR }} />
            {tr('reward_stream_miner')}
            <b className={styles.splitPct}>{ledgerPct(split?.miner)}</b>
          </span>
          <span className={styles.splitItem}>
            <i className={styles.dot} style={{ background: SERVICE_COLOR }} />
            {tr('reward_stream_service')}
            <b className={styles.splitPct}>{ledgerPct(split?.service)}</b>
          </span>
          <span className={styles.splitItem}>
            <i className={styles.dot} style={{ background: BURN_COLOR }} />
            {tr('reward_stream_burn')}
            <b className={styles.splitPct}>{ledgerPct(split?.burn)}</b>
          </span>
        </div>
      </div>

      <div className={styles.recBlock}>
        <button
          type="button"
          className={styles.recToggle}
          onClick={() => setOpen((v) => !v)}
        >
          {tr('reward_stream_recipients')}
          <span className={styles.caret}>{open ? '▾' : '▸'}</span>
        </button>
        {open && (
          <table className={styles.recTable}>
            <thead>
              <tr>
                <th className={styles.recThLeft}>
                  {tr('reward_stream_rec_address')}
                </th>
                <th className={styles.recThRight}>
                  {tr('reward_stream_rec_share')}
                </th>
                <th className={styles.recThRight}>
                  {tr('reward_stream_rec_pending')}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r?.address || i}>
                  <td className={styles.recTdLeft}>{r?.address || DASH}</td>
                  <td className={styles.recTdRight}>
                    {ledgerPct(r?.share_pct)}
                  </td>
                  <td className={styles.recTdRight}>
                    {ledgerFil(r?.pending_claim)} FIL
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default RewardLedgerSection
