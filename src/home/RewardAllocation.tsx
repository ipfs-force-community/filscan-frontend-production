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
import { useRewardLedger } from '@/src/nv29/rewardRecipients'

// 首页「服务奖励排行」容器：取数（home_meta，判定 NV29 是否激活）+ 标题 + 右上角箭头（→ /reward/rank 全量页），
// 块体（服务受益方排行表，前 10 名）在 RewardAllocationBlock。
// 表数据来自后端新方法 RewardStreamLedger（契约 E），取数走公共层 useRewardLedger（唯一一份实现）。
// 取数失败不抛错：保持空数据，块内按「未激活」/「字段缺失」分支兜底，绝不让首页因该块崩掉。
export default function RewardAllocation({
  className,
}: {
  className?: string
}) {
  const { tr } = Translation({ ns: 'home' })
  const { axiosData } = useAxiosData()
  const [data, setData] = useState<Record<string, any>>({})
  // auto: false —— 本卡由 useInterval 立即触发并每 5 分钟刷新，
  // 避免挂载时与 hook 自身的 effect 各请求一次同一接口（会互相取消）。
  const { ledger, reload: reloadLedger } = useRewardLedger({ auto: false })

  useInterval(
    () => {
      load()
      reloadLedger()
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
          {tr('reward_stream_rank_title')}
        </div>
        {/* 右上角箭头 → 全量服务奖励排行页（第一名到最后一名），与首页合约排行同款 */}
        <Link href="/reward/rank">
          <GoIcon className="cursor-pointer" width={18} height={18} />
        </Link>
      </div>
      <RewardAllocationBlock data={data} ledger={ledger} />
    </div>
  )
}
