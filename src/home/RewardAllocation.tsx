/** @format */

import { apiUrl } from '@/contents/apiUrl'
import { Translation } from '@/components/hooks/Translation'
import useAxiosData from '@/store/useAxiosData'
import useInterval from '@/components/hooks/useInterval'
import { useState } from 'react'
import classNames from 'classnames'
import RewardAllocationBlock from './RewardAllocationBlock'
import {
  USE_FAKE_HOME_ALLOCATION,
  fakeHomeAllocationData,
} from './homeAllocationFake'

// 首页「区块奖励分配」容器：取数（复用首页 TotalIndicators，不新增接口）+ 标题，
// 块体（三股 / 合计 / 近24h 占比 / 解释）在 RewardAllocationBlock。
// 取数失败不抛错：保持空数据，块内按「未激活」分支兜底，绝不让首页因该块崩掉。
export default function RewardAllocation({
  className,
}: {
  className?: string
}) {
  const { tr } = Translation({ ns: 'home' })
  const { axiosData } = useAxiosData()
  const [data, setData] = useState<Record<string, any>>({})

  useInterval(
    () => {
      load()
    },
    5 * 60 * 1000,
  )

  const load = async () => {
    if (USE_FAKE_HOME_ALLOCATION) {
      setData(fakeHomeAllocationData().total_indicators)
      return
    }
    try {
      const result: any = await axiosData(apiUrl.home_meta)
      setData(result?.total_indicators || {})
    } catch (e) {
      // 取数失败（网络/后端异常）→ 交给块内未激活分支兜底，绝不 500
      setData({})
    }
  }

  return (
    <div
      className={classNames(
        'card_shadow border_color rounded-xl border px-6 py-5',
        className,
      )}
    >
      <div className="mb-3 font-HarmonyOS text-lg font-semibold">
        {tr('reward_stream_alloc_title')}
      </div>
      <RewardAllocationBlock data={data} />
    </div>
  )
}
