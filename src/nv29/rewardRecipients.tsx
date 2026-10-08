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

export interface LedgerRecipient {
  address?: string
  share_pct?: string
  /** 待提取（应收），attoFIL 字符串。 */
  pending_claim?: string
  /** 本期已提取（已收），attoFIL 字符串；后端零值给 `"0"`。 */
  claimed_period?: string
  /**
   * 后端标记的「已移除流遗留欠款收款人」（契约：true 表示该地址只出现在已移除流的遗留欠款里）。
   * 份额列会显示 0%，但仍可提取结转余额 —— 份额单元格附「已移除流」小标记 + 悬停说明。
   */
  removed_stream?: boolean
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
 * 服务受益方排行表列定义：排名 / 受益地址 / 份额 / 已收 / 应收。
 * @param tr       宿主 ns 的翻译函数
 * @param rankBase 排名基数：名次 = `rankBase + index + 1`（默认 0）。
 *                 全量排行页每页传 `(page-1)*pageLimit`，保证名次全局连续（第 2 页第 1 行 = pageLimit+1）。
 */
export function recipientColumns(tr: any, rankBase = 0) {
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
      title: tr('reward_stream_rec_share'),
      dataIndex: 'share_pct',
      render: (text: any, record: any) => {
        const pct =
          text === undefined || text === null || text === '' ? DASH : `${text}%`
        // 已移除流的遗留欠款收款人：份额为 0%，仍可提取结转余额 —— 在百分比文本后紧跟一个
        // 弱化的小标记（虚线下划线暗示可悬停），悬停弹出说明；其余行保持只显示百分比。
        if (record?.removed_stream === true) {
          return (
            <span className="inline-flex items-center gap-x-1">
              <span>{pct}</span>
              <Tooltip
                context={tr('reward_stream_rec_removed_tip')}
                icon={false}
              >
                <span className="cursor-help text-[10px] underline decoration-dotted opacity-60">
                  {tr('reward_stream_rec_removed')}
                </span>
              </Tooltip>
            </span>
          )
        }
        return pct
      },
    },
    {
      title: tr('reward_stream_rec_claimed'),
      dataIndex: 'claimed_period',
      render: (text: any) => filWithUnit(text),
    },
    {
      title: tr('reward_stream_rec_receivable'),
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
