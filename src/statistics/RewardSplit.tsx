/** @format */
import { apiUrl } from '@/contents/apiUrl'
import { Translation } from '@/components/hooks/Translation'
import { useEffect, useState } from 'react'
import styles from './RewardSplit.module.scss'
import classNames from 'classnames'
import useAxiosData from '@/store/useAxiosData'
import { observer } from 'mobx-react'
import {
  RewardLedgerSection,
  RewardStreamLedger,
} from '@/src/nv29/RewardLedgerSection'
import {
  USE_FAKE_REWARD_LEDGER,
  fakeRewardStreamLedgerResponse,
} from '@/src/nv29/rewardStreamLedgerFake'

interface Props {
  className?: string
}

// 区块奖励分配（NV29/FIP-0118）：标题「区块奖励分配」+ 服务受益方排行表（前 10 名），仿「合约排行」。
// 数据源只有后端方法 RewardStreamLedger（apiUrl.reward_stream_ledger）。
// 旧版的 24h/7d/30d 时间档、堆叠条、图例与占比、合计行、口径说明与同页「区块奖励流向」卡重复，
// 已按用户 2026-10-08 拍板删除；因此不再调用 apiUrl.static_reward_streams
// （「区块奖励流向」卡 RewardStreams.tsx 仍取该接口，保持原样）。
// 未激活 NV29（ledger 的 nv29 不为 true）或取数失败 ⇒ 只显示标题 + 一句未激活文案。
export default observer((props: Props) => {
  const { className } = props
  const { tr } = Translation({ ns: 'static' })
  const { axiosData } = useAxiosData()
  const [ledger, setLedger] = useState<RewardStreamLedger | null>(null)

  useEffect(() => {
    loadLedger()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadLedger = async () => {
    // 后端 RewardStreamLedger 部署前，本地渲染验证走 Fake（默认关闭）
    if (USE_FAKE_REWARD_LEDGER) {
      setLedger(fakeRewardStreamLedgerResponse().data)
      return
    }
    try {
      const result: any = await axiosData(apiUrl.reward_stream_ledger)
      // 兼容网关外壳 {code,msg,data:{…}} 与直出 ledger 两种形状
      setLedger(result?.data ?? result?.result ?? result ?? null)
    } catch (e) {
      // 取数失败 ⇒ ledger 为空：只显示标题 + 未激活文案，不显示成 0，也不整卡崩
      setLedger(null)
    }
  }

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
