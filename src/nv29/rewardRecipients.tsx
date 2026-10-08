/** @format */

import { apiUrl } from '@/contents/apiUrl'
import { formatFil, formatNumber, isIndent } from '@/utils'
import Copy from '@/components/copy'
import { BrowserView, MobileView } from '@/components/device-detect'
import CopySvgMobile from '@/assets/images/icon-copy.svg'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import useAxiosData from '@/store/useAxiosData'
import Tooltip from '@/packages/tooltip'
import {
  USE_FAKE_REWARD_LEDGER,
  fakeRewardStreamLedgerResponse,
} from './rewardStreamLedgerFake'

/**
 * 服务受益方排行表公共层（NV29/FIP-0118）——**唯一一份实现**：
 *   列定义（recipientColumns）、地址单元、金额格式化、取数（useRewardLedger）都在这里，
 *   首页卡（前 10 名，RewardLedgerSection）、统计页卡、全量排行页（/reward/rank）都消费它。
 * 目的：列 / 取数只能有一处定义，避免三处各写一份导致口径漂移。
 */

/** 字段缺失的统一占位（契约 F：缺失一律显示 `--`，不得把 undefined 渲染成 0）。 */
export const DASH = '--'

/** 动态拼接用的缺失占位：缺字段一律 `--`（绝不让 undefined 进到 Tooltip 文案里）。 */
function dash(v: any): string {
  return v === undefined || v === null || v === '' ? DASH : String(v)
}

/** 金额（attoFIL 字符串）→ FIL 展示；缺失 ⇒ `--`。 */
export function ledgerFil(v: any): string {
  if (v === undefined || v === null || v === '') return DASH
  // 零值统一成两位小数：formatFil 对 0 会走 4 位（'0.0000'），而 formatNumber 对 0 直接原样返回，
  // 与同列其它金额（最多两位小数）看起来不一致 —— 这里显式归一。
  if (Number(v) === 0) return '0.00'
  return String(formatNumber(formatFil(v, 'FIL'), 2))
}

/** 金额 + 单位 FIL；缺失 ⇒ `--`（不带单位）。 */
export function filWithUnit(v: any): string {
  if (v === undefined || v === null || v === '') return DASH
  return `${ledgerFil(v)} FIL`
}

/**
 * 「累计已收」列头说明：口径固定；`claimed_since_epoch > 0` 时在末尾追加「自高度 X 起有效」。
 * 归集从采集件上线才开始（主网激活前上线则等于完整）；`0`/缺失 = 无数据/未知 ⇒ 不附该句。
 * 高度占位值缺失一律 `--`（dash 兜底）。
 */
function claimedTotalTip(tr: any, claimedSinceEpoch?: number) {
  const base = tr('reward_stream_rec_claimed_total_tip')
  const since = Number(claimedSinceEpoch)
  if (!Number.isFinite(since) || since <= 0) return base
  return `${base} ${tr('reward_stream_rec_claimed_total_since', {
    since: dash(claimedSinceEpoch),
  })}`
}

export interface LedgerRecipient {
  address?: string
  share_pct?: string
  /** 待提取总额（应收 = 当期 + 跨周期），attoFIL 字符串。 */
  pending_claim?: string
  /** 当期应收＝本期应计 − 本期已提（链上 Accrued 口径），attoFIL 字符串。 */
  pending_claim_current?: string
  /** 跨周期应收＝此前各期已结算未提取的结转（链上 Payable，含已移除流遗留），attoFIL 字符串。 */
  pending_claim_carried?: string
  /** 本期已提取（已收），attoFIL 字符串；后端零值给 `"0"`。 */
  claimed_period?: string
  /**
   * 累计已收：该受益方**至今**从奖励池提取的全部金额（按周期归集，不是只算当期），attoFIL 字符串。
   * 后端可能回 `null` = 未知 ⇒ 列内渲染 `--`（**绝不**渲染成 0.00 FIL：未知与零必须区分）。
   */
  claimed_total?: string | null
  /**
   * 后端标记的「已移除流遗留欠款收款人」（契约：true 表示该地址只出现在已移除流的遗留欠款里）。
   * 份额列会显示 0%，但仍可提取结转余额 —— 份额单元格附「已移除流」小标记 + 悬停说明。
   */
  removed_stream?: boolean
  /**
   * 后端标记的「仍在活跃份额表里、但份额为 0」的收款人（与 removed_stream 互斥）。
   * 链上确实存在这种行（2026-10-09 cali：流还在、份额被置 0，应得转成 payable）——
   * 同样要在份额列给一句说明，否则同为 0.00% 的两行会出现「一个带说明、一个不带」。
   */
  zero_share?: boolean
  /**
   * 后端标记的「本期已离场」收款人（与 removed_stream / zero_share 互斥，且在份额列**优先级最高**）。
   * 语义：本周期内曾持有份额，现已不在链上份额表里（被移出或换址）。份额显示 0.00%，
   * 金额保留其离开时未提取的结转；悬停小标记时附「离开高度 / 离开前份额」动态说明。
   */
  departed?: boolean
  /** 离场高度（本期已离场的离开高度）；缺失 ⇒ 悬停说明里以 `--` 兜底。 */
  left_epoch?: number
  /** 离开前份额（本期已离场的离开前份额，百分比数字字符串）；缺失 ⇒ 悬停说明里以 `--` 兜底。 */
  last_share_pct?: string
}

/**
 * 后端方法 `RewardStreamLedger`（契约 E）响应形状。
 * 金额字段一律 attoFIL 十进制字符串。
 */
export interface RewardStreamLedger {
  epoch?: number
  nv29?: boolean
  pending_claim?: string
  claimed_period?: string
  /**
   * 累计已收的归集起始高度：归集从采集件上线才开始（主网激活前上线则等于完整）。
   * `0` = 无数据/未知 ⇒ 列头说明**不附**「自高度 X 起有效」；仅 `> 0` 时附。
   */
  claimed_since_epoch?: number
  current_split?: { miner?: string; service?: string; burn?: string }
  recipients?: LedgerRecipient[]
}

/** 受益地址单元：照抄 contents/contract.tsx 的 contract_address 渲染（link_text + Copy）。 */
function addressCell(text: any) {
  if (!text) return DASH
  return (
    <span className="flex items-center gap-x-2">
      <BrowserView>
        <Link className="link_text" href={`/address/${text}`}>
          {isIndent(text, 5, 4)}
        </Link>
        <Copy text={text} />
      </BrowserView>
      <MobileView>
        <span className="copy-row">
          <Link className="link_text" href={`/address/${text}`}>
            {isIndent(text, 5, 4)}
          </Link>
          <Copy text={text} icon={<CopySvgMobile />} className="copy" />
        </span>
      </MobileView>
    </span>
  )
}

/**
 * 服务受益方排行表列定义：排名 / 受益地址 / 份额（当期） / 当期已收 / 当期应收 / 跨周期应收。
 * 金额分「当期」「跨周期」两套（2026-10-09 用户裁定）：链上只有当期份额（Shares）与当期已提（ClaimedPeriod），
 * 跨周期能拿到的只有「此前各期已结算未提取」的结转（Payable）；跨周期**已收**需要另建 Claim 历史索引，暂缺。
 * @param tr       宿主 ns 的翻译函数
 * @param rankBase 排名基数：名次 = `rankBase + index + 1`（默认 0）。
 *                 全量排行页每页传 `(page-1)*pageLimit`，保证名次全局连续（第 2 页第 1 行 = pageLimit+1）。
 * @param claimedSinceEpoch 响应级 `claimed_since_epoch`（归集起始高度）。`> 0` 时「累计已收」列头
 *                 说明末尾附「自高度 X 起有效」；`0`/缺失 = 无数据/未知，不附该句。
 */
export function recipientColumns(
  tr: any,
  rankBase = 0,
  claimedSinceEpoch?: number,
) {
  return [
    {
      title: tr('reward_stream_rec_rank'),
      dataIndex: 'rank',
      width: '10%',
      render: (_: any, __: any, index: number) => (
        <span className="rank_icon">{rankBase + index + 1}</span>
      ),
    },
    {
      title: tr('reward_stream_rec_address'),
      dataIndex: 'address',
      render: (text: any) => addressCell(text),
    },
    {
      // 份额只有当期口径（链上 Shares = "the current period's complete recipient allocation"）
      title: (
        <span className="inline-flex items-center gap-x-1">
          {tr('reward_stream_rec_share')}
          <Tooltip context={tr('reward_stream_rec_share_tip')} />
        </span>
      ),
      dataIndex: 'share_pct',
      render: (text: any, record: any) => {
        const pct =
          text === undefined || text === null || text === '' ? DASH : `${text}%`
        // 份额为 0% 却有说明的三种成因，各跟一个弱化小标记（虚线下划线暗示可悬停、悬停弹说明）：
        //   ① departed（优先级最高，且与后两者互斥）：本期已离场 —— 本周期内曾持有份额，现已不在链上份额表里；
        //   ② removed_stream：只在「已移除流」的遗留欠款里（流被移除或地址被替换）；
        //   ③ zero_share：流还在份额表里，但这一轮没给它分配权重（份额就是 0）。
        // 三种都必须在页面上被解释 —— 否则同为 0.00% 的行会出现「一个带说明、一个不带」。
        // 三者互斥、命中即止，不叠加。departed 的说明含动态值（离开高度 / 离开前份额）。
        const marker: {
          label: string
          tip: string
          values?: Record<string, string>
        } | null = record?.departed
          ? {
              label: 'reward_stream_rec_departed',
              tip: 'reward_stream_rec_departed_tip',
              values: {
                left_epoch: dash(record?.left_epoch),
                last_share_pct: dash(record?.last_share_pct),
              },
            }
          : record?.removed_stream
            ? {
                label: 'reward_stream_rec_removed',
                tip: 'reward_stream_rec_removed_tip',
              }
            : record?.zero_share
              ? {
                  label: 'reward_stream_rec_zero_share',
                  tip: 'reward_stream_rec_zero_share_tip',
                }
              : null
        if (!marker) return pct
        return (
          <span className="inline-flex items-center gap-x-1">
            <span>{pct}</span>
            <Tooltip context={tr(marker.tip, marker.values)} icon={false}>
              <span className="cursor-help text-[10px] underline decoration-dotted opacity-60">
                {tr(marker.label)}
              </span>
            </Tooltip>
          </span>
        )
      },
    },
    {
      // 口径说明从卡片底部小字搬到列头问号里（用户 2026-10-08 拍板）：悬停「已收」「应收」列头的
      // 问号弹出解释（站点既有 Tooltip 样式，icon 用包内默认的 tip 图标）。
      title: (
        <span className="inline-flex items-center gap-x-1">
          {tr('reward_stream_rec_claimed')}
          <Tooltip context={tr('reward_stream_rec_claimed_tip')} />
        </span>
      ),
      dataIndex: 'claimed_period',
      render: (text: any) => filWithUnit(text),
    },
    {
      title: (
        <span className="inline-flex items-center gap-x-1">
          {tr('reward_stream_rec_pending_current')}
          <Tooltip context={tr('reward_stream_rec_pending_current_tip')} />
        </span>
      ),
      dataIndex: 'pending_claim_current',
      render: (text: any) => filWithUnit(text),
    },
    {
      // 累计已收（至今全部已提取，按周期归集）；`null` = 未知 ⇒ `--`，绝不渲染成 0.00 FIL。
      // 列头说明按响应级 claimed_since_epoch 决定是否附「自高度 X 起有效」。
      title: (
        <span className="inline-flex items-center gap-x-1">
          {tr('reward_stream_rec_claimed_total')}
          <Tooltip context={claimedTotalTip(tr, claimedSinceEpoch)} />
        </span>
      ),
      dataIndex: 'claimed_total',
      render: (text: any) => filWithUnit(text),
    },
    {
      title: (
        <span className="inline-flex items-center gap-x-1">
          {tr('reward_stream_rec_receivable')}
          <Tooltip context={tr('reward_stream_rec_receivable_tip')} />
        </span>
      ),
      // 累计应收＝至今未提取的全部欠款（＝当期应收 + 此前各期结转）＝接口的 pending_claim 总额。
      // 注意：不是 pending_claim_carried（那只是历史结转那一段）。
      dataIndex: 'pending_claim',
      render: (text: any) => filWithUnit(text),
    },
  ]
}

/**
 * 取数：后端 jsonrpc `RewardStreamLedger`（apiUrl.reward_stream_ledger）。
 * 唯一一份取数实现；保留 `USE_FAKE_REWARD_LEDGER` 分支（默认关闭）供本地渲染验证。
 * 取数失败 ⇒ `ledger` 为 null（不抛错，由调用方按「未激活」兜底，绝不让页面崩）。
 * @param options.auto 是否挂载即取（默认 true）。首页卡由 useInterval 立即触发并每 5 分钟刷新，
 *                     故传 `{ auto: false }` 避免挂载时同一接口被请求两次（本仓取消键是 `method:url`，会互相取消）。
 */
export function useRewardLedger(options?: { auto?: boolean }) {
  const { axiosData } = useAxiosData()
  const [ledger, setLedger] = useState<RewardStreamLedger | null>(null)
  const [loading, setLoading] = useState(false)
  const auto = options?.auto !== false

  useEffect(() => {
    if (auto) load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const load = async () => {
    // 后端 RewardStreamLedger 部署前，本地渲染验证走 Fake（默认关闭）
    if (USE_FAKE_REWARD_LEDGER) {
      setLedger(fakeRewardStreamLedgerResponse().data)
      return
    }
    setLoading(true)
    try {
      const result: any = await axiosData(apiUrl.reward_stream_ledger)
      // 兼容网关外壳 {code,msg,data:{…}} 与直出 ledger 两种形状
      setLedger(result?.data ?? result?.result ?? result ?? null)
    } catch (e) {
      // 取数失败 ⇒ ledger 为空：调用方按未激活兜底，不显示成 0，也不整块崩
      setLedger(null)
    } finally {
      setLoading(false)
    }
  }

  return { ledger, loading, reload: load }
}
