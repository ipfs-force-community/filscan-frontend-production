/** @format */

import { Translation } from '@/components/hooks/Translation'
import { formatFil, formatNumber } from '@/utils'
import classNames from 'classnames'
import styles from './RewardAllocation.module.scss'

interface Props {
  data?: Record<string, any>
  className?: string
}

const COLORS: Record<string, string> = {
  miner: '#1C6AFD',
  service: '#4ACAB4',
  burn: '#F8CD4D',
}

// 首页「区块奖励分配」块（NV29/FIP-0118 三股）。
// 数据源复用首页 TotalIndicators（不新增接口）；两网分支由 nv29_epoch/latest_height 判定：
//   未激活 ⇒ 只给一句「本网尚未升级 NV29」，不列服务流/销毁两行；
//   激活   ⇒ 列出三股累计数字 + 累计铸造量合计 + 近24h 占比（atoFIL ÷1e18 后展示）。
export default function RewardAllocationBlock({ data = {}, className }: Props) {
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

  // 注意：后端新字段（reward_stream_*_total）与本前端不是同时上线时，
  // 老后端不返回这些字段 ⇒ 必须显示 '--' 而不是 0.00 FIL（0 会被读成"服务流一分钱没有"，是错的）。
  const fil = (v: any) =>
    v === undefined || v === null ? '--' : formatNumber(formatFil(v, 'FIL'), 2)
  const total24 = Number(data?.reward_stream_total_24h || 0)
  const pct = (v: any) =>
    total24 > 0 ? ((Number(v || 0) / total24) * 100).toFixed(1) + '%' : '--'
  const rows = [
    {
      key: 'miner',
      title: 'reward_stream_miner',
      total: data?.reward_stream_miner_total,
      h24: data?.reward_stream_miner_24h,
    },
    {
      key: 'service',
      title: 'reward_stream_service',
      total: data?.reward_stream_service_total,
      h24: data?.reward_stream_service_24h,
    },
    {
      key: 'burn',
      title: 'reward_stream_burn',
      total: data?.reward_stream_burn_minted_total,
      h24: data?.reward_stream_burn_24h,
    },
  ]

  return (
    <div className={classNames(styles.wrap, className)}>
      <div className={styles.bar}>
        {rows.map((r) => (
          <span
            key={r.key}
            className={styles.seg}
            style={{
              width: `${total24 > 0 ? (Number(r.h24 || 0) / total24) * 100 : 0}%`,
              background: COLORS[r.key],
            }}
          />
        ))}
      </div>
      <div className={styles.h24note}>{tr('reward_stream_alloc_24h')}</div>
      <ul className={styles.rows}>
        {rows.map((r) => (
          <li key={r.key} className={styles.row}>
            <span className={styles.label}>
              <i className={styles.dot} style={{ background: COLORS[r.key] }} />
              {tr(r.title)}
            </span>
            <span className={styles.value}>
              {fil(r.total)} FIL
              <span className={styles.pct}>{pct(r.h24)}</span>
            </span>
          </li>
        ))}
        <li className={classNames(styles.row, styles.total)}>
          <span className={styles.label}>
            {tr('reward_stream_alloc_total')}
          </span>
          <span className={styles.value}>
            {fil(data?.reward_stream_minted_total)} FIL
          </span>
        </li>
      </ul>
      <div className={styles.note}>{tr('reward_stream_alloc_desc')}</div>
    </div>
  )
}
