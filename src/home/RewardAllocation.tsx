/** @format */

import { apiUrl } from '@/contents/apiUrl'
import { Translation } from '@/components/hooks/Translation'
import useAxiosData from '@/store/useAxiosData'
import useInterval from '@/components/hooks/useInterval'
import { useState } from 'react'
import classNames from 'classnames'
import Link from 'next/link'
import GoIcon from '@/assets/images/black_go.svg'
import RewardAllocationBlock from './RewardAllocationBlock'
import {
  USE_FAKE_HOME_ALLOCATION,
  fakeHomeAllocationData,
} from './homeAllocationFake'
import {
  USE_FAKE_REWARD_LEDGER,
  fakeRewardStreamLedgerResponse,
} from '@/src/nv29/rewardStreamLedgerFake'
import { RewardStreamLedger } from '@/src/nv29/RewardLedgerSection'

// 首页「区块奖励分配」容器：取数（home_meta，判定 NV29 是否激活）+ 标题（含「查看奖励流向」链接），
// 块体（服务受益方排行表，前 10 名）在 RewardAllocationBlock。
// 表数据来自后端新方法 RewardStreamLedger（契约 E），单独取一次，与 home_meta 互不影响。
// 取数失败不抛错：保持空数据，块内按「未激活」/「字段缺失」分支兜底，绝不让首页因该块崩掉。
export default function RewardAllocation({
  className,
}: {
  className?: string
}) {
  const { tr } = Translation({ ns: 'home' })
  const { axiosData } = useAxiosData()
  const [data, setData] = useState<Record<string, any>>({})
  const [ledger, setLedger] = useState<RewardStreamLedger | null>(null)

  useInterval(
    () => {
      load()
    },
    5 * 60 * 1000,
  )

  const load = async () => {
    if (USE_FAKE_HOME_ALLOCATION) {
      setData(fakeHomeAllocationData().total_indicators)
    } else {
      try {
        // 必须带 flag：本卡的取数与同页 src/home/meta.tsx 的 Meta 卡是**同一个接口**，
        // 而 useAxiosData 的取消键是 `method:url`（不含 payload）——不带 flag 会把
        // 先发起的那条（Meta）取消掉，导致「全网有效算力/扇区新增成本/质押量/产出效率」
        // 四项拿不到值，unitConversion(undefined) 直接渲染成 `0 Byte` / `0 FIL/TiB`。
        const result: any = await axiosData(
          apiUrl.home_meta,
          {},
          { flag: 'reward_alloc' },
        )
        setData(result?.total_indicators || {})
      } catch (e) {
        // 取数失败（网络/后端异常）→ 交给块内未激活分支兜底，绝不 500
        setData({})
      }
    }

    // 表数据：后端 RewardStreamLedger 部署前本地渲染验证走 Fake（默认关闭）。
    if (USE_FAKE_REWARD_LEDGER) {
      setLedger(fakeRewardStreamLedgerResponse().data)
      return
    }
    try {
      const result: any = await axiosData(apiUrl.reward_stream_ledger)
      // 兼容网关外壳 {code,msg,data:{…}} 与直出 ledger 两种形状
      setLedger(result?.data ?? result?.result ?? result ?? null)
    } catch (e) {
      // 取数失败 ⇒ ledger 为空：表按契约 F 显示 `--`（不显示成 0，也不整块崩）
      setLedger(null)
    }
  }

  return (
    <div
      className={classNames(
        'card_shadow border_color rounded-xl border px-6 py-5',
        className,
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="font-HarmonyOS text-lg font-semibold">
          {tr('reward_stream_alloc_title')}
        </div>
        <Link
          className="flex items-center gap-x-1"
          href="/statistics/charts#block_reward_streams"
        >
          <span className="link_text text-xs">{tr('reward_stream_view')}</span>
          <GoIcon className="cursor-pointer" width={16} height={16} />
        </Link>
      </div>
      <RewardAllocationBlock data={data} ledger={ledger} />
    </div>
  )
}
