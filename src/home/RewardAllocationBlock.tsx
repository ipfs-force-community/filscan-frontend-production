/** @format */

import { Translation } from '@/components/hooks/Translation'
import { formatFil, formatNumber } from '@/utils'
import classNames from 'classnames'
import styles from './RewardAllocation.module.scss'
import {
  RewardLedgerSection,
  RewardStreamLedger,
} from '@/src/nv29/RewardLedgerSection'

interface Props {
  data?: Record<string, any>
  /** 后端新方法 RewardStreamLedger（契约 E/F1）的响应；缺失时三项显示 `--`。 */
  ledger?: RewardStreamLedger | null
  className?: string
}

const COLORS: Record<string, string> = {
  miner: '#1C6AFD',
  service: '#4ACAB4',
  burn: '#F8CD4D',
}

// 首页「区块奖励分配」块（NV29/FIP-0118 三股）。
// 数据源复用首页 TotalIndicators（不新增接口）；两网分支由 nv29_epoch/latest_height 判定：
//   未激活 ⇒ 只给一句「本网尚未升级 NV29」，不列服务流/销毁两行、也不显示 F1 三项；
//   激活   ⇒ 两组**各自同源**的展示：
//            ① 累计（自 NV29 激活）：三股累计金额 + 各自占「累计铸造量」的百分比 + 合计（累计铸造量）；
//            ② 近24h：堆叠占比条 + 三股 24h 金额 + 各自占「24h 铸造量」的百分比 + 合计（24h 铸造量）；
//            以及契约 F1 新增三项（待提取 / 当前分账比例（链上日程）/ 受益方明细），
//            后三者数据源为后端新方法 RewardStreamLedger，字段缺失一律显示 `--`。
//
// ⚠️ 硬规矩：**金额与它旁边的百分比必须取自同一口径**。
// 早期实现把「累计金额」配上「近24h 占比」（pct(r.h24)），于是 110,963,404 FIL 旁边写着 50.0%，
// 数字与占比互相矛盾（用户 2026-10-08 指出）。两套口径宁可分两组摆，也不能混在一行。
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

  // 注意：后端新字段（reward_stream_*_total）与本前端不是同时上线时，
  // 老后端不返回这些字段 ⇒ 必须显示 '--' 而不是 0.00 FIL（0 会被读成"服务流一分钱没有"，是错的）。
  const fil = (v: any) =>
    v === undefined || v === null ? '--' : formatNumber(formatFil(v, 'FIL'), 2)
  const accTotal = Number(data?.reward_stream_minted_total || 0)
  const total24 = Number(data?.reward_stream_total_24h || 0)
  // 占比：分别以本组自己的合计为分母（累计组用累计铸造量，24h 组用 24h 铸造量）
  const pctOf = (v: any, base: number) =>
    base > 0 && v !== undefined && v !== null
      ? ((Number(v) / base) * 100).toFixed(2) + '%'
      : '--'
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
      {/* ① 累计（自 NV29 激活）：金额与占比同取自累计口径 */}
      <div className={styles.groupTitle}>{tr('reward_stream_alloc_acc')}</div>
      <ul className={styles.rows}>
        {rows.map((r) => (
          <li key={r.key} className={styles.row}>
            <span className={styles.label}>
              <i className={styles.dot} style={{ background: COLORS[r.key] }} />
              {tr(r.title)}
            </span>
            <span className={styles.value}>
              {fil(r.total)} FIL
              <span className={styles.pct}>{pctOf(r.total, accTotal)}</span>
            </span>
          </li>
        ))}
        <li className={classNames(styles.row, styles.total)}>
          <span className={styles.label}>{tr('reward_stream_alloc_total')}</span>
          <span className={styles.value}>
            {fil(data?.reward_stream_minted_total)} FIL
          </span>
        </li>
      </ul>

      {/* ② 近24h：占比条 + 三股 24h 金额，与上面的累计组是两套口径，分开摆 */}
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
      <div className={styles.groupTitle}>{tr('reward_stream_alloc_24h')}</div>
      <ul className={styles.rows}>
        {rows.map((r) => (
          <li key={r.key} className={styles.row}>
            <span className={styles.label}>
              <i className={styles.dot} style={{ background: COLORS[r.key] }} />
              {tr(r.title)}
            </span>
            <span className={styles.value}>
              {fil(r.h24)} FIL
              <span className={styles.pct}>{pctOf(r.h24, total24)}</span>
            </span>
          </li>
        ))}
        <li className={classNames(styles.row, styles.total)}>
          <span className={styles.label}>
            {tr('reward_stream_alloc_24h_total')}
          </span>
          <span className={styles.value}>
            {fil(data?.reward_stream_total_24h)} FIL
          </span>
        </li>
      </ul>

      <div className={styles.h24note}>{tr('reward_stream_alloc_desc')}</div>
      {/* F1 新增三项：待提取 / 当前分账比例（链上日程）/ 受益方明细。
          active=高度判定（与上方三股同源）；ledger 缺失时三项显示 `--`。 */}
      <RewardLedgerSection ledger={ledger} ns="home" active={nv29Active} />
    </div>
  )
}
