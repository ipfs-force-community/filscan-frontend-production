/** @format */

import { Translation } from '@/components/hooks/Translation'
import Table from '@/packages/Table'
import { observer } from 'mobx-react'
import { useMemo, useState } from 'react'
import classNames from 'classnames'
import { pageLimit } from '@/utils'
import { recipientColumns, useRewardLedger } from '@/src/nv29/rewardRecipients'
import styles from './index.module.scss'

// 服务奖励排行（全量）：从第一名到最后一名。
// 数据源与卡一致（后端 jsonrpc RewardStreamLedger，recipients 已按应收降序、不截断），
// 取数走公共层 useRewardLedger（唯一一份实现）；翻页**只在本地切片**，不重新请求接口。
// 名次全局连续：排名 = (当前页 - 1) * pageLimit + 行下标 + 1（第 2 页第 1 行 = pageLimit + 1）。
// 未激活 NV29（ledger.nv29 不为 true）或取数失败 ⇒ 标题 + 一句未激活文案，不渲染表。
export default observer(() => {
  const { tr } = Translation({ ns: 'static' })
  const { ledger, loading } = useRewardLedger()
  const [current, setCurrent] = useState(1)

  const active = ledger?.nv29 === true
  const recipients =
    ledger?.recipients && Array.isArray(ledger.recipients)
      ? ledger.recipients
      : []
  // 名次基数：第 2 页从 pageLimit + 1 开始（全局连续，不受分页切断）
  const rankBase = (current - 1) * pageLimit
  const pageData = recipients.slice(rankBase, rankBase + pageLimit)
  const columns = useMemo(() => recipientColumns(tr, rankBase), [tr, rankBase])

  // 客户端分页：只更新当前页，数据切片在本地完成，不重新取数。
  const handleChange = (pagination: any) => {
    setCurrent(pagination?.current || 1)
  }

  return (
    <>
      <div className="flex h-[30px] items-center justify-between">
        <div className="pl-2.5 font-HarmonyOS text-lg font-semibold">
          {tr('block_reward_split')}
        </div>
      </div>
      {!active ? (
        <div
          className={classNames(
            'card_shadow border_color mt-4 rounded-xl border p-5',
          )}
        >
          <div className={styles.inactive}>
            {tr('reward_stream_nv29_inactive')}
          </div>
        </div>
      ) : (
        <>
          <div
            className={classNames(
              'card_shadow border_color mt-4 rounded-xl border p-5',
            )}
          >
            <Table
              key="reward_rank"
              className="-mt-2.5"
              total={recipients.length}
              data={pageData}
              columns={columns}
              loading={loading}
              limit={pageLimit}
              current={current}
              onChange={handleChange}
            />
            <div className={styles.note}>{tr('reward_stream_rec_note')}</div>
          </div>
        </>
      )}
    </>
  )
})
