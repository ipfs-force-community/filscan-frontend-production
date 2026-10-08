/** @format */
import { Translation } from '@/components/hooks/Translation'
import Link from 'next/link'
import GoIcon from '@/assets/images/black_go.svg'
import styles from './RewardSplit.module.scss'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import { RewardLedgerSection } from '@/src/nv29/RewardLedgerSection'
import { useRewardLedger } from '@/src/nv29/rewardRecipients'

interface Props {
  className?: string
}

// 服务奖励排行（NV29/FIP-0118）：标题「服务奖励排行」（i18n 键 block_reward_split）+ 服务受益方排行表（前 10 名），
// 仿「合约排行」；右上角箭头 → 全量排行页 /reward/rank（第一名到最后一名）。
// 数据源只有后端方法 RewardStreamLedger（apiUrl.reward_stream_ledger），取数走公共层 useRewardLedger（唯一一份实现）。
// 旧版的 24h/7d/30d 时间档、堆叠条、图例与占比、合计行、口径说明与同页「区块奖励流向」卡重复，
// 已按用户 2026-10-08 拍板删除；因此不再调用 apiUrl.static_reward_streams
// （「区块奖励流向」卡 RewardStreams.tsx 仍取该接口，保持原样）。
// 未激活 NV29（ledger 的 nv29 不为 true）或取数失败 ⇒ 只显示标题 + 一句未激活文案。
export default observer((props: Props) => {
  const { className } = props
  const { tr } = Translation({ ns: 'static' })
  const { ledger } = useRewardLedger()

  const active = ledger?.nv29 === true

  return (
    <div className={classNames(styles.wrap, `h-full w-full ${className}`)}>
      <div
        className={classNames(
          'mx-2.5 mb-4 flex flex-1 flex-row flex-wrap items-center justify-between',
          styles['title-wrap'],
        )}
      >
        <div className="w-fit min-w-[120px] font-HarmonyOS text-lg font-semibold">
          {tr('block_reward_split')}
        </div>
        {/* 右上角箭头 → 全量服务奖励排行页（与首页合约排行同款） */}
        <Link href="/reward/rank">
          <GoIcon className="cursor-pointer" width={18} height={18} />
        </Link>
      </div>
      <div
        className={classNames(
          'card_shadow border_color w-full rounded-xl border',
          styles.content,
        )}
      >
        <RewardLedgerSection ledger={ledger} ns="static" />
        {!active && (
          <div className={styles.inactive}>
            {tr('reward_stream_nv29_inactive')}
          </div>
        )}
      </div>
    </div>
  )
})
