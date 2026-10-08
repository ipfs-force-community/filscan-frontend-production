/** @format */

import { Translation } from '@/components/hooks/Translation'
import classNames from 'classnames'
import Table from '@/packages/Table'
import { recipientColumns, RewardStreamLedger } from './rewardRecipients'
import styles from './RewardLedgerSection.module.scss'

// 公共层（列定义 / 地址单元 / 金额格式化 / 取数）落在 ./rewardRecipients，这里只保留卡体结构。
export {
  DASH,
  ledgerFil,
  filWithUnit,
  recipientColumns,
  useRewardLedger,
} from './rewardRecipients'
export type { LedgerRecipient, RewardStreamLedger } from './rewardRecipients'

interface Props {
  ledger?: RewardStreamLedger | null
  ns?: 'home' | 'static'
  /** 是否已激活 NV29。默认取 ledger.nv29 === true；首页可显式传入（由高度判定）。 */
  active?: boolean
  className?: string
}

/** 排行表只展示前 10 名（用户 2026-10-08 拍板）；全量排行页展示全部。 */
const RANK_LIMIT = 10

/**
 * 服务受益方排行卡体：仿「合约排行」的排行表（只显示前 10 名）。
 *   表格：排名 / 受益地址 / 份额 / 已收 / 应收（列定义与金额格式化取自 ./rewardRecipients，唯一一份）；
 *   口径说明不再摆在卡内小字里，已移到「已收」「应收」两个列头的问号（悬停弹出）。
 *
 * 标题由宿主渲染（首页/统计页各一），本组件不含任何跳转链接。
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
  const columns = recipientColumns(tr, 0, ledger.claimed_since_epoch)

  return (
    <div className={classNames(styles.wrap, className)}>
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
    </div>
  )
}

export default RewardLedgerSection
