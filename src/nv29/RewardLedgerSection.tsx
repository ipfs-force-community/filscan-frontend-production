/** @format */

import { Translation } from '@/components/hooks/Translation'
import { formatFil, formatNumber, isIndent } from '@/utils'
import classNames from 'classnames'
import Link from 'next/link'
import Copy from '@/components/copy'
import { BrowserView, MobileView } from '@/components/device-detect'
import CopySvgMobile from '@/assets/images/icon-copy.svg'
import Table from '@/packages/Table'
import styles from './RewardLedgerSection.module.scss'

/** 字段缺失的统一占位（契约 F：缺失一律显示 `--`，不得把 undefined 渲染成 0）。 */
export const DASH = '--'

/** 金额（attoFIL 字符串）→ FIL 展示；缺失 ⇒ `--`。 */
export function ledgerFil(v: any): string {
  if (v === undefined || v === null || v === '') return DASH
  return String(formatNumber(formatFil(v, 'FIL'), 2))
}

/** 金额 + 单位 FIL；缺失 ⇒ `--`（不带单位）。 */
function filWithUnit(v: any): string {
  if (v === undefined || v === null || v === '') return DASH
  return `${ledgerFil(v)} FIL`
}

export interface LedgerRecipient {
  address?: string
  share_pct?: string
  /** 待提取（应收），attoFIL 字符串。 */
  pending_claim?: string
  /** 本期已提取（已付），attoFIL 字符串；后端零值给 `"0"`。 */
  claimed_period?: string
}

/**
 * 后端方法 `RewardStreamLedger`（契约 E）响应形状。
 * 金额字段一律 attoFIL 十进制字符串。
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

/** 排行表只展示前 10 名（用户 2026-10-08 拍板）。 */
const RANK_LIMIT = 10

/**
 * 「区块奖励分配」卡体：仿「合约排行」的服务受益方排行表（只显示前 10 名）。
 *   副标题：共 N 个受益方 · 待提取（奖励池欠服务方）总额 X FIL；
 *   表格：排名 / 受益地址 / 份额 / 已付 / 应收（列头复用既有 i18n key）；
 *   表下一行：弱化色口径说明。
 *
 * 2026-10-08 拍板：三股占比 / 合计 / 当前分账比例与统计页「区块奖励流向」卡重复，已全部删除。
 * 未激活 NV29（active 为 false / ledger 为空）⇒ 不渲染表体（返回 null，由宿主显示未激活文案）。
 * 字段缺失一律显示 `--`。
 */
export function RewardLedgerSection({
  ledger,
  ns = 'home',
  active,
  className,
}: Props) {
  const { tr } = Translation({ ns })

  // active 为 false（或未传且 ledger.nv29 不为 true）**或 ledger 为空** ⇒ 不渲染表体，
  // 由宿主显示未激活文案（统计页未激活/取数失败分支；首页由高度判定，ledger 缺失时不渲染）。
  const isActive = active === undefined ? ledger?.nv29 === true : active
  if (!isActive || !ledger) return null

  const recipients = Array.isArray(ledger.recipients) ? ledger.recipients : []
  const rows = recipients.slice(0, RANK_LIMIT)

  // 受益地址列：照抄 contents/contract.tsx 的 contract_address 渲染（link_text + Copy）。
  const addressCell = (text: any) => {
    if (!text) return DASH
    return (
      <span className="flex items-center gap-x-2">
        <BrowserView>
          <Link className="link_text" href={`/address/${text}`}>
            {isIndent(text, 5, 4)}
          </Link>
          <Copy text={text} />
        </BrowserView>
        <MobileView>
          <span className="copy-row">
            <Link className="link_text" href={`/address/${text}`}>
              {isIndent(text, 5, 4)}
            </Link>
            <Copy text={text} icon={<CopySvgMobile />} className="copy" />
          </span>
        </MobileView>
      </span>
    )
  }

  const columns = [
    {
      title: tr('reward_stream_rec_rank'),
      dataIndex: 'rank',
      width: '10%',
      render: (_: any, __: any, index: number) => (
        <span className="rank_icon">{index + 1}</span>
      ),
    },
    {
      title: tr('reward_stream_rec_address'),
      dataIndex: 'address',
      render: (text: any) => addressCell(text),
    },
    {
      title: tr('reward_stream_rec_share'),
      dataIndex: 'share_pct',
      render: (text: any) =>
        text === undefined || text === null || text === '' ? DASH : `${text}%`,
    },
    {
      title: tr('reward_stream_rec_claimed'),
      dataIndex: 'claimed_period',
      render: (text: any) => filWithUnit(text),
    },
    {
      title: tr('reward_stream_rec_receivable'),
      dataIndex: 'pending_claim',
      render: (text: any) => filWithUnit(text),
    },
  ]

  return (
    <div className={classNames(styles.wrap, className)}>
      {/* 副标题（仿 contract_list_total 的位置）：共 N 个受益方 · 待提取（奖励池欠服务方）总额 X FIL */}
      <div className={styles.sub}>
        {tr('reward_stream_rec_count', { value: recipients.length })}
        {' · '}
        {tr('reward_stream_pending_claim')} {filWithUnit(ledger?.pending_claim)}
      </div>
      <div className={styles.tableWrap}>
        <Table
          key="reward_recipient_rank"
          className="-mt-2.5"
          total={0}
          data={rows}
          columns={columns}
          loading={false}
        />
      </div>
      <div className={styles.note}>{tr('reward_stream_rec_note')}</div>
    </div>
  )
}

export default RewardLedgerSection
