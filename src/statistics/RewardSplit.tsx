/** @format */
import { apiUrl } from '@/contents/apiUrl'
import { Translation } from '@/components/hooks/Translation'
import { reward_streams, reward_streams_intervals } from '@/contents/statistic'
import { formatFil, formatNumber } from '@/utils'
import { useEffect, useState } from 'react'
import styles from './RewardSplit.module.scss'
import classNames from 'classnames'
import useAxiosData from '@/store/useAxiosData'
import Segmented from '@/packages/segmented'
import { observer } from 'mobx-react'
import {
  USE_FAKE_REWARD_STREAMS,
  fakeRewardStreamsResponse,
} from './rewardStreamsFake'
import {
  RewardLedgerSection,
  RewardStreamLedger,
} from '@/src/nv29/RewardLedgerSection'
import {
  USE_FAKE_REWARD_LEDGER,
  fakeRewardStreamLedgerResponse,
} from '@/src/nv29/rewardStreamLedgerFake'

interface Props {
  origin?: string
  className?: string
}

const EMPTY_SUM: Record<string, number> = {}

// 区块奖励分配（NV29/FIP-0118）：把「区块奖励流向」窗口内的三流求和，给出三股占比 +
// 三个累计数字 + 合计。数据源**复用已上线的 RewardStreams 接口**（apiUrl.static_reward_streams，
// 契约定：不新增接口），与 RewardStreams.tsx 同款三档时间（24h/7d/30d）。

// 窗口内三流求和（attoFIL 直接相加，仅用于展示：量级下 Number 相对误差 ~1e-16，2 位小数不可见）。
// 导出以便本地渲染校验/单测断言「miner+service+burn == total」。
export function sumRewardStreams(items: any[]): Record<string, number> {
  const totals: Record<string, number> = {}
  reward_streams.list.forEach((item: any) => {
    totals[item.dataIndex] = 0
  })
  totals.total = 0
  ;(items || []).forEach((value: any) => {
    reward_streams.list.forEach((item: any) => {
      totals[item.dataIndex] += Number(value[item.dataIndex] || 0)
    })
    totals.total += Number(
      value.total ||
        Number(value.miner || 0) +
          Number(value.service || 0) +
          Number(value.burn || 0),
    )
  })
  return totals
}

// 纯展示层：给定窗口求和，画堆叠占比条 + 三股数字（含占比）+ 合计 + 口径说明。
// F1 新增三项（待提取 / 当前分账比例（链上日程）/ 受益方明细）由 RewardLedgerSection 承担，
// 数据源是后端新方法 RewardStreamLedger（非窗口数据，不随三档时间变化）。
// 取数在下方 observer 组件完成；两层拆开便于本地用 fixture 直接 SSR 渲染校验。
export function RewardSplitView({
  sum = EMPTY_SUM,
  ledger,
  interval = '24h',
  className,
  onIntervalChange,
}: {
  sum?: Record<string, number>
  ledger?: RewardStreamLedger | null
  interval?: string
  className?: string
  onIntervalChange?: (value: string) => void
}) {
  const { tr } = Translation({ ns: 'static' })
  const total = Number(sum.total || 0)
  const filShow = (v: number) => formatNumber(formatFil(v || 0, 'FIL'), 2)
  const pct = (v: number) =>
    total > 0 ? ((v / total) * 100).toFixed(1) + '%' : '--'

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
        <Segmented
          defaultValue={interval}
          data={reward_streams_intervals}
          ns="static"
          isHash={false}
          onChange={(value) => onIntervalChange && onIntervalChange(value)}
        />
      </div>
      <div
        className={classNames(
          'card_shadow border_color w-full rounded-xl border',
          styles.content,
        )}
      >
        <div className={styles.bar}>
          {reward_streams.list.map((item: any) => (
            <span
              key={item.dataIndex}
              className={styles.seg}
              style={{
                width: `${
                  total > 0 ? ((sum[item.dataIndex] || 0) / total) * 100 : 0
                }%`,
                background: item.color,
              }}
            />
          ))}
        </div>
        <ul className={styles.legend}>
          {reward_streams.list.map((item: any) => (
            <li key={item.dataIndex} className={styles.row}>
              <span className={styles.label}>
                <i className={styles.dot} style={{ background: item.color }} />
                {tr(item.title)}
              </span>
              <span className={styles.value}>
                {filShow(sum[item.dataIndex] || 0)} FIL
                <span className={styles.pct}>
                  {pct(sum[item.dataIndex] || 0)}
                </span>
              </span>
            </li>
          ))}
          <li className={classNames(styles.row, styles.total)}>
            <span className={styles.label}>
              {tr('reward_stream_split_total')}（{tr(interval)}）
            </span>
            <span className={styles.value}>{filShow(total)} FIL</span>
          </li>
        </ul>
        <div className={styles.note}>{tr('reward_stream_split_desc')}</div>
        {/* F1 新增三项：数据源 RewardStreamLedger；未激活 NV29（ledger.nv29 !== true）时不渲染 */}
        <RewardLedgerSection ledger={ledger} ns="static" />
      </div>
    </div>
  )
}

// 取数层：复用 RewardStreams 接口（不新增接口），三档时间复用现有 Segmented 机制；
// F1 三项另取一次后端新方法 RewardStreamLedger（非窗口数据，不随档位变化）。
export default observer((props: Props) => {
  const { className } = props
  const { axiosData } = useAxiosData()
  const [interval, setInterval] = useState('24h')
  const [sum, setSum] = useState<Record<string, number>>({})
  const [ledger, setLedger] = useState<RewardStreamLedger | null>(null)

  useEffect(() => {
    load()
    loadLedger()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const load = async (time?: string) => {
    const inter = time || interval
    // 后端 RewardStreams 接口部署前，本地渲染验证走 Fake（见 rewardStreamsFake.ts，默认关闭）
    const result: any = USE_FAKE_REWARD_STREAMS
      ? fakeRewardStreamsResponse(inter)
      : await axiosData(apiUrl.static_reward_streams, { interval: inter })

    // 兼容网关外壳 {code,msg,data:{…}} 与直出 {…} 两种形状
    const payload = result?.data ?? result ?? {}
    setSum(sumRewardStreams(payload?.items || []))
  }

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
      // 取数失败 ⇒ 三项不渲染（nv29 未知）；不显示成 0，也不整卡崩
      setLedger(null)
    }
  }

  return (
    <RewardSplitView
      sum={sum}
      ledger={ledger}
      interval={interval}
      className={className}
      onIntervalChange={(value) => {
        setInterval(value)
        load(value)
      }}
    />
  )
})
