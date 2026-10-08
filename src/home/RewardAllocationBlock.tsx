/** @format */

import { Translation } from '@/components/hooks/Translation'
import classNames from 'classnames'
import styles from './RewardAllocation.module.scss'
import {
  RewardLedgerSection,
  RewardStreamLedger,
} from '@/src/nv29/RewardLedgerSection'

interface Props {
  data?: Record<string, any>
  /** 后端新方法 RewardStreamLedger（契约 E）的响应；缺失时表内字段显示 `--`。 */
  ledger?: RewardStreamLedger | null
  className?: string
}

// 首页「区块奖励分配」块（NV29/FIP-0118）。
// 用户 2026-10-08 拍板：累计三股组 / 近24h 堆叠条与三股行 / 两个合计 / 说明文案全部删除
// （与统计页「区块奖励流向」卡重复），只保留**服务受益方排行表**（仿合约排行，前 10 名）。
// 两网分支由 nv29_epoch 与 latest_height 比较判定：
//   未激活 ⇒ 只给一句「本网尚未升级 NV29」；
//   激活   ⇒ 渲染 RewardLedgerSection（ns=home）。
export default function RewardAllocationBlock({
  data = {},
  ledger,
  className,
}: Props) {
  const { tr } = Translation({ ns: 'home' })
  const nv29 = Number(data?.nv29_epoch || 0)
  const height = Number(data?.latest_height || 0)
  const nv29Active = nv29 > 0 && height >= nv29

  if (!nv29Active) {
    return (
      <div className={classNames(styles.wrap, styles.inactive, className)}>
        {tr('reward_stream_nv29_inactive')}
      </div>
    )
  }

  return (
    <RewardLedgerSection
      ledger={ledger}
      ns="home"
      active={true}
      className={className}
    />
  )
}
