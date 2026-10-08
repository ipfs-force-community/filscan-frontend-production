/** @format */

import {
  formatDateTime,
  formatFil,
  formatFilNum,
  formatNumber,
  isIndent,
  unitConversion,
} from '@/utils'
import { Item } from './type'
import Link from 'next/link'
import Copy from '@/components/copy'
import { getSvgIcon } from '@/svgsIcon'
import { BrowserView, MobileView } from '@/components/device-detect'
import CopySvgMobile from '@/assets/images/icon-copy.svg'
import Image from '@/packages/image'
import DropDown from '@/packages/customDrop'
import ShowText from '@/packages/showText'
import AccountLink from '@/components/accountLink'
import { humanizeMethodName } from '@/utils/methodName'

//储存池概览 账户余额 & 有效算力
export const account_balance = {
  title: 'balance',
  list: [
    {
      title: 'available_balance',
      dataIndex: 'available_balance',
      title_tip: 'available_balance_tip',
      color: '#4ACAB4',
    },
    {
      title: 'init_pledge',
      dataIndex: 'init_pledge',
      title_tip: 'init_pledge_tip',
      color: '#256DF3',
    },
    {
      title: 'pre_deposits',
      dataIndex: 'pre_deposits',
      title_tip: 'pre_deposits_tip',
      color: '#F8CD4D',
    },
    {
      title: 'locked_balance',
      dataIndex: 'locked_balance',
      title_tip: 'locked_balance_tip',
      color: '#7F79EB',
    },
  ],
}

export const power_list = {
  header: [
    {
      title: 'quality_adjust_power',
      dataIndex: 'quality_adjust_power',
      render: (text: number) => (text ? unitConversion(text, 2) : '--'),
    },
    {
      title: 'quality_power_rank',
      dataIndex: 'quality_power_rank',
      render: (text: number) => text || '--',
    },
  ],
  list: [
    {
      title: 'raw_power_percentage',
      dataIndex: 'quality_power_percentage',
      render: (text: number) =>
        text ? Number(text * 100).toFixed(4) + '%' : '--',
    },
    {
      title: 'total_win_count',
      dataIndex: 'total_win_count',
    },
    {
      title: 'total_block_count',
      dataIndex: 'total_block_count',
    },

    {
      title: 'raw_power',
      dataIndex: 'raw_power',
      render: (text: number) => (text ? unitConversion(text, 2) : '--'),
    },

    {
      title: 'total_reward',
      dataIndex: 'total_reward',
      render: (text: string | number) =>
        text ? formatFilNum(text, false, false) : '--',
    },
    {
      title: 'sector_size',
      dataIndex: 'sector_size',
      render: (text: number) => {
        if (Number(text) === 0) return text
        return text ? unitConversion(text) : '--'
      },
    },
  ],
  sector_status: {
    title: 'sector_status',
    dataIndex: 'sector_stauts',
    width: '100%',
    renderList: [
      { title: 'sector_count', dataIndex: 'live_sector_count' },
      {
        title: 'live_sector_count',
        dataIndex: 'active_sector_count',
        color: '#1C6AFD',
      },
      {
        title: 'fault_sector_count',
        dataIndex: 'fault_sector_count',
        color: '#ff000f',
      },
      {
        title: 'recover_sector_count',
        dataIndex: 'recover_sector_count',
        color: '#ffc631',
      },
    ],
  },
}

//miner_统计指标
export const miner_overview = {
  title: 'indicators',
  tabList: [
    { title: '24h', dataIndex: '24h' },
    { title: '7d', dataIndex: '7d' },
    { title: '30d', dataIndex: '1m' },
    { title: 'year', dataIndex: '1y' },
  ],
  list: [
    {
      title: 'power_ratio',
      dataIndex: 'power_ratio',
      width: '25%',
      style: { alignSelf: 'flex-start' },
      render: (text: string | number) =>
        text ? unitConversion(text, 2) + '/D' : '--',
    },
    {
      title: 'precommit_deposits',
      dataIndex: 'sector_deposits',
      style: { width: '25%', justifyContent: 'flex-start' },

      render: (text: string | number) =>
        text ? formatFilNum(text, false, false) : '--',
    }, //扇区质押
    {
      title: 'gas_fee',
      dataIndex: 'gas_fee',
      width: '25%',
      style: { alignSelf: 'flex-start' },

      render: (text: string | number) =>
        text ? formatFilNum(text, false, false) : '--',
    },
    {
      title: 'win_count',
      width: '25%',
      dataIndex: 'win_count',
      title_tip: 'win_count_tip',
      render: (text: any) =>
        String(text) === '0' || text ? String(text) : '--',
    },
    {
      title: 'block_count',
      width: '25%',
      dataIndex: 'block_count_increase',
      // title_tip: 'block_count_tip',
      render: (text: any) =>
        String(text) === '0' || text ? String(text) : '--',
    },
    {
      title: 'block_rewards',
      width: '25%',
      dataIndex: 'block_reward_increase',
      render: (text: string | number) =>
        text ? formatFilNum(text, false, false) : '--',
    },
    {
      title: 'mining_efficiency',
      dataIndex: 'rewards_per_tb',
      width: '25%',
      title_tip: 'mining_efficiency_tip',
      render: (text: string | number) =>
        text ? formatFilNum(text, false, false) + '/TiB' : '--',
    },
    {
      title: 'lucky',
      width: '25%',
      dataIndex: 'lucky',
      title_tip: 'lucky_tip',
      render: (text: string | number) => {
        if (!text && Number(text) !== 0) {
          return '--'
        }
        return text !== '-1'
          ? Number(100 * Number(text)).toFixed(4) + ' %'
          : '--'
      },
    },
    {
      title: 'net_profit_per_tb',
      width: '25%',
      dataIndex: 'gas_fee_per_tb',
      title_tip: 'net_profit_per_tb_tip',
      render: (text: string | number) =>
        text ? formatFilNum(text, false, false, 3) : '--',
    },
    {
      title: 'power_increase_indicators',
      style: { width: '20%', justifyContent: 'flex-end' },
      dataIndex: 'power_increase',
      render: (text: string | number) =>
        text ? unitConversion(text, 2) : '--',
    },
    {
      title: 'windowPost_gas',
      style: { width: '20%', justifyContent: 'flex-end' },
      dataIndex: 'windowpost_gas',
      render: (text: string | number) =>
        text ? formatFilNum(text, false, false, 3) + '/TiB' : '--',
    },
  ],
}

export const peerList = [
  {
    title: 'ID',
    dataIndex: 'peer_id',
    render: (text: any, record: any, tr: any) => {
      return text ? tr(text) : '--'
    },
  },
  {
    title: 'miner_owner',
    dataIndex: 'account_id',
    type: ['account_basic'],
    render: (text: any, record: any, tr: any) => {
      if (!text) return '--'
      return (
        <Link href={`/miner/${text}`} className="link_text">
          {text}
        </Link>
      )
    },
  },
  {
    title: 'area',
    dataIndex: 'ip_address',
    type: ['account_basic'],
    render: (text: any, record: any, tr: any) => (text ? text : tr('no_area')),
  },
  {
    title: 'MultiAddresses',
    dataIndex: 'multi_addrs',
    type: ['account_basic'],
    render: (text: any, record: any, tr: any) => {
      if (Array.isArray(text) && text.length > 0) {
        return <ShowText content={text} unit={10} />
      }
      return '--'
    },
  },
]

export const account_detail = {
  list: (tr: any) => [
    {
      title: 'account_type',
      dataIndex: 'account_type',
      type: ['account_basic'],
      render: (text: any, record: any, tr: any) => (text ? tr(text) : '--'),
    },
    {
      title: 'peer_id',
      dataIndex: 'peer_id',
      render: (text: string, record: any) => {
        if (!text) return '--'
        const accountId = record?.account_basic?.account_id
        return (
          <span className="flex items-baseline gap-x-2">
            {accountId ? (
              <Link href={`/peer/${accountId}`} className="link_text">
                {isIndent(text, 10)}
              </Link>
            ) : (
              <span>{isIndent(text, 10)}</span>
            )}
            <Copy text={text} />
          </span>
        )
      },
    },
    {
      title: 'robust_address',
      dataIndex: 'robust_address',
      type: ['account_basic'],
      elasticity: true,
      render: (text: string) => {
        return text ? (
          <>
            <BrowserView>
              <span className="flex items-center gap-x-2">
                {text?.length > 30 ? isIndent(text, 10, 10) : text}
                <Copy text={text} />
              </span>
            </BrowserView>
            <MobileView>
              <span className="copy-row">
                <span className="normal-text">{text}</span>
                <Copy text={text} icon={<CopySvgMobile />} className="copy" />
              </span>
            </MobileView>
          </>
        ) : (
          text
        )
      },
    },
    {
      title: 'worker_address',
      dataIndex: 'worker_address',
      render: (text: string) => {
        if (!text) return '--'
        return (
          <span className="flex items-baseline gap-x-2">
            <Link href={`/address/${text}`} className="link_text">
              {isIndent(text, 10)}
            </Link>
            <Copy text={text} />
          </span>
        )
      },
    },
    {
      title: 'owner_address',
      dataIndex: 'owner_address',
      render: (text: string) => {
        if (!text) return '--'
        return (
          <span className="flex items-baseline gap-x-2">
            <Link href={`/address/${text}`} className="link">
              {isIndent(text, 10)}
            </Link>
            <Copy text={text} />
          </span>
        )
      },
    },
    {
      title: 'controllers_address',
      dataIndex: 'controllers_address',
      render: (text: any, record: any) => {
        if (Array.isArray(text) && text.length > 0) {
          return <ShowText content={text} unit={10} />
        }
        return '--'
        // return <div className='flex flex-wrap items-baseline justify-end gap-x-2'>
        //   {text&& Array.isArray(text)?text?.map((linkItem:string,index:number) => {
        //     return <span className="flex items-baseline gap-x-2" key={linkItem}>
        //       <Link href={`/address/${linkItem}`} className='link' >{isIndent(linkItem,10)}</Link>
        //       <Copy text={linkItem} />
        //     </span>
        //   }):'--'}
        // </div>
      },
    },
    {
      title: 'beneficiary_address',
      dataIndex: 'beneficiary_address',
      render: (text: any, record: any) => {
        if (!text) return '--'
        return (
          <div className="flex flex-wrap items-baseline justify-end gap-x-2">
            {text && Array.isArray(text) ? (
              text?.map((linkItem: string, index: number) => {
                return (
                  <span className="flex items-baseline gap-x-2" key={linkItem}>
                    <Link href={`/address/${linkItem}`} className="link_text">
                      {isIndent(linkItem, 10)}
                    </Link>
                    <Copy text={linkItem} />
                  </span>
                )
              })
            ) : (
              <span className="flex items-baseline gap-x-2">
                <Link href={`/address/${text}`} className="link_text">
                  {isIndent(text, 10)}
                </Link>
                <Copy text={text} />
              </span>
            )}
          </div>
        )
      },
    },
  ],
}

export const owner_detail_overview = {
  title: 'owner_title',
  list: [
    {
      title: 'account_name',
      dataIndex: 'account_id',
    },
    {
      title: 'owner_address',
      dataIndex: 'account_address',
      render: (text: string) => {
        return (
          <Link className="link" href={`/address/${text}`}>
            {text}
          </Link>
        )
      },
    },
    {
      title: 'owned_miners',
      dataIndex: 'owned_miners',
      render: (text: Array<any>, record: any) => {
        return (
          <span className="flex flex-wrap items-baseline gap-x-2">
            {text &&
              Array.isArray(text) &&
              text?.map((item: any, index: number) => {
                return (
                  <Link className="link" key={index} href={`/miner/${item}`}>
                    {item}
                  </Link>
                )
              })}
          </span>
        )
      },
    },
  ],
}

export const owner_detail = {
  list: [
    {
      title: 'owner_address',
      dataIndex: 'account_address',
      render: (text: string) => {
        return (
          <div className="owner flex items-center gap-x-2">
            <Link className="link" href={`/address/${text}`}>
              {text}
            </Link>
            <Copy text={text} />
          </div>
        )
      },
    },
    {
      title: 'owned_miners',
      dataIndex: 'owned_miners',
      render: (text: Array<any>, record: any) => {
        return (
          <span className="flex flex-wrap items-baseline gap-2.5">
            {text &&
              Array.isArray(text) &&
              text?.map((item: any, index: number) => {
                return (
                  <Link className="link" key={index} href={`/miner/${item}`}>
                    {item}
                  </Link>
                )
              })}
          </span>
        )
      },
    },
    {
      title: 'owned_active_miners',
      dataIndex: 'active_miners',
      render: (text: Array<any>, record: any) => {
        return (
          <span className="flex flex-wrap items-baseline gap-2.5">
            {text &&
              Array.isArray(text) &&
              text?.map((item: any, index: number) => {
                return (
                  <Link className="link" key={index} href={`/miner/${item}`}>
                    {item}
                  </Link>
                )
              })}
          </span>
        )
      },
    },
  ],
}

//message detail
export const message_detail = {
  title: 'message_overview_detail',
  tabs: [
    { title: 'message_detail', dataIndex: 'detail' },
    { title: 'trade', dataIndex: 'trade' },
    { title: 'event_log', dataIndex: 'event_log' },
  ],
  eventLog: [
    { title: 'account_address', dataIndex: 'address' },
    { title: 'Name', dataIndex: 'name' },
    {
      title: 'topic',
      dataIndex: 'topics',
      render: (text: any, record: any) => {
        if (Array.isArray(text)) {
          return (
            <ul className="flex flex-col gap-y-2">
              {text.map((item: string, index: number) => {
                return (
                  <li key={item} className="flex items-center gap-x-2">
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-[5px] bg-bg_hover ">
                      {index}
                    </span>
                    {item}
                  </li>
                )
              })}
            </ul>
          )
        }
        return text || '--'
      },
    },
    {
      title: 'params',
      dataIndex: 'data',
      render: (text: string) => {
        return <div className="break-words">{text}</div>
      },
    },
    { title: 'Log Index', dataIndex: 'log_index' },
    {
      title: 'Removed',
      dataIndex: 'removed',
      render: (text: boolean) => String(text),
    },
  ],
  trade: [
    {
      dataIndex: 'from',
      title: 'from_ath',
      width: '30%',
      render: (text: string, record: any) => (
        <span className="flex items-center gap-x-2">
          <AccountLink value={text} />
        </span>
      ),
    },
    {
      dataIndex: 'to',
      title: 'to_ath',
      width: '30%',
      render: (text: string, record: any) => (
        <span className="flex items-center gap-x-2">
          <AccountLink value={text} />
        </span>
      ),
    },
    {
      dataIndex: 'value',
      title: 'amount',
      width: '20%',
      render: (text: string) => {
        return formatFilNum(text, false, false, 4)
      },
    },
    {
      dataIndex: 'method',
      width: '20%',
      title: 'method',
      // 内部转账的方法名同样做人话映射（NV29 奖励流方法），未命中原样显示。
      render: (text: string, _data: any, tr: any) =>
        humanizeMethodName(text, tr),
    },
  ],
  trans: [
    {
      dataIndex: 'cid',
      title: 'cid',
      type: ['message_basic'],
      render: (text: string) => {
        if (!text) return '--'
        return (
          <>
            <BrowserView>
              <span className="flex items-center gap-x-2">
                <span className="text">{text}</span>
                <Copy text={text} />
              </span>
            </BrowserView>
            <MobileView>
              <span className="copy-row">
                <span className="normal-text">{text}</span>
                <Copy text={text} icon={<CopySvgMobile />} className="copy" />
              </span>
            </MobileView>
          </>
        )
      },
    },
    {
      dataIndex: 'eth_message',
      title: 'eth_message',
      elasticity: true,
      render: (text: string) => {
        if (!text) return null
        return (
          <>
            <BrowserView>
              <span className="flex items-center gap-x-2">
                <span className="text">{text}</span>
                <Copy text={text} />
              </span>
            </BrowserView>
            <MobileView>
              <span className="copy-row">
                <span className="normal-text">{text}</span>
                <Copy text={text} icon={<CopySvgMobile />} className="copy" />
              </span>
            </MobileView>
          </>
        )
      },
    },
    {
      dataIndex: 'exit_code',
      title: 'exit_code',
      type: ['message_basic'],
      render: (text: any) => {
        if (text?.startsWith('Ok')) {
          return (
            <span className="flex items-center gap-x-2  rounded-sm py-1">
              {getSvgIcon('successIcon')}
              <span className="text-cm text-success">Success</span>
            </span>
          )
        }
        if (text?.startsWith('Pend')) {
          return (
            <span className="flex items-center gap-x-2  rounded-sm py-1">
              {getSvgIcon('pendingIcon')}
              <span className="text-cm">Pending</span>
            </span>
          )
        }

        return (
          <span className="flex items-center gap-x-2 rounded-sm py-1">
            {getSvgIcon('errorIcon')}
            <span className="text_red text-cm">{text}</span>
          </span>
        )
      },
    },
    {
      dataIndex: 'value',
      title: 'value',
      type: ['message_basic'],
      render: (text: number) => {
        return formatFilNum(text, false, false, 4)
      },
    },
    {
      dataIndex: 'height',
      title: 'height',
      type: ['message_basic'],
      render: (text: string) => {
        return (
          <Link className="link" href={`/height/${text}`}>
            {text}
          </Link>
        )
      },
    },
    {
      dataIndex: 'block_time',
      title: 'time',
      type: ['message_basic'],
      render: (text: string) => formatDateTime(text, 'YYYY-MM-DD HH:mm:ss'),
    },
    {
      dataIndex: 'method_name',
      title: 'method_name',
      type: ['message_basic'],
      // 显示层人话映射：NV29 奖励流的 9 个方法名 → 中文/英文/韩文标签；未命中原样显示。
      render: (text: string, _data: any, tr: any) =>
        humanizeMethodName(text, tr),
    },
    // //Transaction
    {
      dataIndex: 'swap_info',
      elasticity: true,
      borderTop: true,
      title: (tr: any) => (
        <span>
          {getSvgIcon('transaction')}
          {tr('Transaction')}
        </span>
      ),
      render: (text: any) => {
        if (text) {
          return (
            <span className="flex gap-x-2">
              <span className="flex gap-x-2">
                <span>Swap</span>
                <span>{text?.amount_out?.toLocaleString()}</span>
                <span>{text?.amount_out_token_name.toLocaleUpperCase()}</span>
              </span>
              <span className="text_des">For</span>
              <span className="flex gap-x-2">
                <span>{text?.amount_in}</span>
                <span>{text?.amount_in_token_name}</span>
              </span>
              <span className="text_des">On</span>
              <span
                className={`flex gap-x-2 ${
                  text.dex_url ? 'cursor-pointer' : ''
                }`}
                onClick={() => {
                  if (text.dex_url) {
                    window.open(text.dex_url)
                  }
                }}
              >
                {/* //todo 后端返回url */}
                <Image src={text.icon_url} alt="" width={20} height={20} />
                {text?.dex}
              </span>
            </span>
          )
        }
        return null
      },
    },
    //nfts 转移
    {
      title: 'message_NftTrans',
      elasticity: true,
      dataIndex: 'nftTrans',
      borderTop: true,
      render: (text: any, record: any, tr: any) => {
        if (Array.isArray(text)) {
          if (text.length === 0) return null
          return (
            <div className="flex flex-col gap-y-4 align-baseline">
              {text.map((item: any, index) => {
                return (
                  <div key={index} className="flex gap-x-2.5">
                    <span className="flex items-center gap-x-2">
                      <span className="text_des">{tr('from_ath')}</span>
                      <span className="flex items-center gap-x-2">
                        <AccountLink
                          value={item.from}
                          tagText={item.from_tag}
                        />
                      </span>
                    </span>
                    <span className="flex items-center gap-x-2 ">
                      <span className="text_des">{tr('to_ath')}</span>{' '}
                      <span className="flex items-center gap-x-2">
                        <AccountLink value={item.to} tagText={item.to_tag} />
                      </span>
                    </span>
                    <span className="flex items-center gap-x-2 font-HarmonyOS_Medium ">
                      <span className="font_weight">For</span>
                      <span>{Number(item?.amount).toFixed(4) || '--'}</span>
                      <span>{item?.token_name}</span>
                    </span>
                  </div>
                )
              })}
            </div>
          )
        }
        return null
      },
    },
    {
      dataIndex: 'from',
      title: 'from',
      borderTop: true,
      type: ['message_basic'],
      render: (text: string, record: any) => (
        <span className="link-row flex items-center gap-x-2">
          <AccountLink
            value={text}
            unit={0}
            tagText={record?.message_basic?.from_tag}
          />
        </span>
      ),
    },
    {
      dataIndex: 'to',
      title: 'to',
      type: ['message_basic'],
      render: (text: string, record: any) => {
        return (
          <span className="link-row flex items-center gap-x-2">
            <AccountLink
              value={text}
              unit={0}
              tagText={record?.message_basic?.to_tag}
            />
          </span>
        )
      },
    },
    //通证转移
    {
      title: 'message_ERC20Trans',
      elasticity: true,
      dataIndex: 'message_ERC20Trans',
      borderTop: true,
      render: (text: any, record: any, tr: any) => {
        if (Array.isArray(text)) {
          if (text.length === 0) return null
          return (
            <>
              <BrowserView>
                <div className="flex flex-col gap-y-4 align-baseline">
                  {text.map((item: any, index) => {
                    return (
                      <div key={index} className="flex gap-x-2.5">
                        <span className="flex items-center gap-x-2">
                          <span className="text_des">{tr('from_ath')}</span>
                          <span className="flex items-center gap-x-2">
                            <AccountLink
                              value={item.from}
                              tagText={item.from_tag}
                            />
                          </span>
                        </span>
                        <span className="flex items-center gap-x-2 ">
                          <span className="text_des">{tr('to_ath')}</span>{' '}
                          <span className="flex items-center gap-x-2">
                            <AccountLink
                              value={item.to}
                              tagText={item.to_tag}
                            />
                          </span>
                        </span>
                        <span className="flex items-center gap-x-2 font-HarmonyOS_Medium ">
                          <span className="font_weight">For</span>
                          <span>{Number(item?.amount).toFixed(4) || '--'}</span>
                          <span>{item?.token_name}</span>
                        </span>
                      </div>
                    )
                  })}
                </div>
              </BrowserView>
              <MobileView>
                <div className="flex flex-col gap-y-4 align-baseline">
                  {text.map((item: any, index) => {
                    return (
                      <div key={index} className="grid grid-cols-1 gap-y-1">
                        <span className="flex items-center gap-x-2">
                          <span className="text_des">{tr('from_ath')}</span>
                          <span className="flex items-center gap-x-2">
                            <AccountLink
                              value={item.from}
                              tagText={item.from_tag}
                            />
                          </span>
                        </span>
                        <span className="flex items-center gap-x-2 ">
                          <span className="text_des">{tr('to_ath')}</span>{' '}
                          <span className="flex items-center gap-x-2">
                            <AccountLink
                              value={item.to}
                              tagText={item.to_tag}
                            />
                          </span>
                        </span>
                        <span className="flex items-center gap-x-2 font-HarmonyOS_Medium ">
                          <span className="font_weight">For</span>
                          <span>{Number(item?.amount).toFixed(4) || '--'}</span>
                          <span>{item?.token_name}</span>
                        </span>
                      </div>
                    )
                  })}
                </div>
              </MobileView>
            </>
          )
        }
        return null
      },
    },
    //转账信息
    {
      title: 'message_tranf',
      dataIndex: 'consume_list',
      elasticity: true,
      borderTop: true,
      mobileHide: true,
      render: (text: any, record: any, tr: any) => {
        if (Array.isArray(text)) {
          if (text.length === 0) return null
          return (
            <div className="flex flex-col gap-y-4 align-baseline">
              {text.map((item: any, index) => {
                return (
                  <>
                    <BrowserView>
                      <div key={index} className="flex gap-x-2.5">
                        <span className="flex items-center gap-x-2">
                          <span className="text_des">{tr('from_ath')}</span>
                          <span className="flex items-center gap-x-2">
                            <AccountLink
                              value={item.from}
                              tagText={item.from_tag}
                            />
                          </span>
                        </span>
                        <span className="flex items-center gap-x-2 ">
                          <span className="text_des">{tr('to_ath')}</span>{' '}
                          <span className="flex items-center gap-x-2">
                            <AccountLink
                              value={item.to}
                              tagText={item.to_tag}
                            />
                          </span>
                        </span>
                        <span className="flex items-center gap-x-2 font-HarmonyOS_Medium ">
                          <span className="font_weight">For</span>
                          <span>
                            {formatFilNum(item.value, false, false, 4) || '--'}
                          </span>
                          <span className="text_des font-HarmonyOS">
                            ({tr(item.consume_type)})
                          </span>
                        </span>
                      </div>
                    </BrowserView>
                    <MobileView>
                      <div key={index} className="grid grid-cols-1">
                        <span className="flex items-center gap-x-2">
                          <span className="text_des">{tr('from_ath')}</span>
                          <span className="flex items-center gap-x-2">
                            <AccountLink
                              value={item.from}
                              tagText={item.from_tag}
                            />
                          </span>
                        </span>
                        <span className="flex items-center gap-x-2 ">
                          <span className="text_des">{tr('to_ath')}</span>{' '}
                          <span className="flex items-center gap-x-2">
                            <AccountLink
                              value={item.from}
                              tagText={item.to_tag}
                            />
                          </span>
                        </span>
                        <span className="flex items-center gap-x-2 font-HarmonyOS_Medium ">
                          <span className="font_weight">For</span>
                          <span>
                            {formatFilNum(item.value, false, false, 4) || '--'}
                          </span>
                          <span className="text_des font-HarmonyOS">
                            ({tr(item.consume_type)})
                          </span>
                        </span>
                      </div>
                    </MobileView>
                  </>
                )
              })}
            </div>
          )
        }
        return null
      },
    },
  ],
  detail: [
    {
      dataIndex: 'nonce',
      title: 'nonce',

      render: (text: any) => text,
    },
    {
      dataIndex: 'replaced',
      title: 'replaced',
      render: (text: any) => (String(text) === 'true' ? 'True' : 'False'),
    },
    // {
    //   dataIndex: 'base_cid',
    //   title: 'base_cid',
    //   elasticity: true,
    //   render: (text: any,record:any) => {
    //     console.log('---333',text,record)
    //     if (String(text)) {
    //       return text;
    //     }
    //     return null
    //   }
    // },
    {
      borderTop: true,
      dataIndex: 'all_gas_fee',
      title: 'all_gas_fee',
      render: (text: string) => formatFilNum(text, false, false, 4),
    },
    {
      dataIndex: 'base_fee',
      title: 'base_fee',
      render: (text: string) => {
        return formatFilNum(text, false, false, 4)
      },
    },
    {
      dataIndex: 'gas_fee_cap',
      title: 'gas_fee_cap',
      render: (text: string) => formatFilNum(text, false, false, 4),
    },
    {
      dataIndex: 'gas_premium',
      title: 'gas_premium',
      render: (text: string) => formatFilNum(text, false, false, 4),
    },
    {
      dataIndex: 'gas_limit',
      title: 'gas_limit',
      render: (text: string) => formatNumber(text),
    },
    {
      dataIndex: 'gas_used',
      title: 'gas_used',
      render: (text: string) => formatNumber(text),
    },
    {
      dataIndex: 'blk_cids',
      title: 'blk_cids',
      borderTop: true,
      render: (text: Array<string>) => {
        if (!Array.isArray(text) || !text) return '--'
        return (
          <div className="flex flex-col">
            {text.map((item: string, index: number) => {
              if (!text) return '--'
              return (
                <>
                  <BrowserView>
                    <span
                      className="mb-2 flex items-center  gap-x-2 last:mb-0"
                      key={index}
                    >
                      <Link
                        key={index}
                        className="link link-html"
                        href={`/cid/${item}`}
                      >
                        {item}
                      </Link>
                      <Copy text={item} />
                    </span>
                  </BrowserView>
                  <MobileView>
                    <span className="copy-row mt-1">
                      <span className="text">
                        <Link
                          key={index}
                          className="link link-html"
                          href={`/cid/${item}`}
                        >
                          {item}
                        </Link>
                      </span>
                      <Copy
                        text={item}
                        icon={<CopySvgMobile />}
                        className="copy"
                      />
                    </span>
                  </MobileView>
                </>
              )
            })}
          </div>
        )
      },
    },
    {
      dataIndex: 'version',
      title: 'version',
      borderTop: true,
      render: (text: any) => text,
    },

    {
      dataIndex: 'params_detail',
      title: 'params',
      render: (text: string, record?: any) => {
        const showValue = text || record?.params
        if (!showValue) return null
        if (typeof showValue === 'string') {
          return (
            <span className="break-words">
              {JSON.stringify(showValue, undefined, 2)}
            </span>
          )
        }
        return (
          <div className="code">
            <pre
              className="pre"
              style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}
            >
              {JSON.stringify(showValue, undefined, 1)}
            </pre>
            {/* <JSONPretty id="json-pretty" data={showValue}></JSONPretty> */}
          </div>
        )
      },
    },
    {
      dataIndex: 'err',
      title: 'err_message',
      elasticity: true,
      render: (text: string, record?: any) => {
        const showValue = text || record?.params
        if (!showValue) return null
        if (typeof showValue === 'string') {
          return (
            <span className="break-words">
              {JSON.stringify(showValue, undefined, 2)}
            </span>
          )
        }
        return (
          <div className="code">
            <pre
              className="pre"
              style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}
            >
              {JSON.stringify(showValue, undefined, 1)}
            </pre>
            {/* <JSONPretty id="json-pretty" data={showValue}></JSONPretty> */}
          </div>
        )
      },
    },
    {
      dataIndex: 'returns_detail',
      title: 'returns',
      render: (text: string, record?: any) => {
        const showValue = text || record?.returns
        if (!showValue) return null
        if (typeof showValue === 'string') {
          return (
            <span className="break-words">
              {JSON.stringify(showValue, undefined, 2)}
            </span>
          )
        }
        return (
          <pre className="pre" style={{ whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(showValue, undefined, 1)}
          </pre>
        )
      },
    },
  ],
  content: [
    // [
    //   //erc20 transfer
    //   {
    //     title: 'message_ERC20Trans',
    //     elasticity: true,
    //     dataIndex: 'message_ERC20Trans',
    //     borderTop: true,
    //     render: (text: any, record: any, tr: any) => {
    //       if (Array.isArray(text)) {
    //         if (text.length === 0) return null;
    //         return (
    //           <div className='array_item_column'>
    //             {text.map((item: any, index) => {
    //               return (
    //                 <li key={index} className='array_item_column_li'>
    //                   <div className='flex_align_center '>
    //                     <span className='font_weight'>{tr('from_ath')}</span>
    //                     <span>{get_account_type(item.from)}</span>
    //                   </div>
    //                   <div className='flex_align_center'>
    //                     <span className='font_weight'>{tr('to_ath')}</span>{' '}
    //                     <span>{get_account_type(item.to)}</span>
    //                   </div>
    //                   <div className='flex_align_center'>
    //                     <span className='font_weight'>For</span>
    //                     <span>{Number(item?.amount).toFixed(4) || '--'}</span>
    //                     <span>{item?.token_name}</span>
    //                   </div>
    //                 </li>
    //               );
    //             })}
    //           </div>
    //         );
    //       }
    //       return null;
    //     },
    //   },
    // ],
  ],
}

const default_content = [
  {
    title: 'account_address',
    dataIndex: 'account_address',
    type: ['account_basic'],
    render: (text: string, record: any, tr: any) => {
      const owned_miners = record?.account_basic?.owned_miners || []
      if (!text) return '--'
      return (
        <>
          <BrowserView>
            <span className="flex items-center gap-x-2">
              {text?.length > 30 ? isIndent(text, 10, 10) : text}
              {text && <Copy text={text} />}
            </span>
            {owned_miners.length > 0 && (
              <Link
                href={`/owner/${record?.account_basic?.account_id}`}
                className="primary_btn primary_default ml-2 !h-7"
              >
                {tr('account_detail')}
              </Link>
            )}
          </BrowserView>
          <MobileView>
            <span className="copy-row">
              <span className="normal-text">{text}</span>
              <Copy text={text} icon={<CopySvgMobile />} className="copy" />
              {owned_miners.length > 0 && (
                <Link
                  href={`/owner/${record?.account_basic?.account_id}`}
                  className="primary_btn mt-2"
                >
                  {tr('account_detail')}
                </Link>
              )}
            </span>
          </MobileView>
        </>
      )
    },
  },
  {
    title: 'contract_name',
    dataIndex: 'contract_name',
    elasticity: true,
    type: ['account_basic', 'evm_contract'],
    render: (text: any, record: any, tr: any) => {
      if (record?.account_basic?.account_type === 'evm') {
        if (text) {
          return (
            <span className="flex items-center gap-x-2">
              <span className="success_color">{getSvgIcon('successIcon')}</span>
              {text}
            </span>
          )
        }
        return (
          <Link className="primary_btn !h-8" href={`/contract/verify`}>
            {tr('go_verify')}
          </Link>
        )
      }
      return text
    },
  },
  {
    title: 'base_account_id',
    dataIndex: 'account_id',
    type: ['account_basic'],
    elasticity: true,
    render: (text: string, record: any) => {
      if (!text) return text
      return (
        <>
          <BrowserView>
            <span className="flex items-center gap-x-2">
              {text} <Copy text={text} />
            </span>
          </BrowserView>
          <MobileView>
            <span className="copy-row">
              <span className="normal-text">{text}</span>
              <Copy text={text} icon={<CopySvgMobile />} className="copy" />
            </span>
          </MobileView>
        </>
      )
    },
  },
  {
    title: 'account_type',
    dataIndex: 'account_type',
    type: ['account_basic'],
    render: (text: string, record: any, tr: any) => (text ? tr(text) : '--'),
  },
  {
    title: 'eth_address',
    dataIndex: 'eth_address',
    elasticity: true,
    type: ['account_basic'],
    render: (text: string, record: any) => {
      return (
        <>
          <BrowserView>
            {text ? (
              <>
                <span className="flex items-center gap-x-2">
                  {text} <Copy text={text} />
                </span>
              </>
            ) : (
              text
            )}
          </BrowserView>
          <MobileView>
            <span className="copy-row">
              <span className="normal-text">{text}</span>
              <Copy text={text} icon={<CopySvgMobile />} className="copy" />
            </span>
          </MobileView>
        </>
      )
    },
  },

  {
    title: 'balance',
    dataIndex: 'account_balance',
    type: ['account_basic'],
    render: (text: string) => (text ? formatFilNum(text) : '--'),
  },
  {
    title: 'stable_address',
    dataIndex: 'stable_address',
    elasticity: true,
    type: ['account_basic'],
    render: (text: string) => {
      return text ? (
        <>
          <BrowserView>
            <span className="flex items-center gap-x-2">
              {text?.length > 30 ? isIndent(text, 10, 10) : text}
              <Copy text={text} />
            </span>
          </BrowserView>
          <MobileView>
            <span className="copy-row">
              <span className="normal-text">
                {text?.length > 30 ? isIndent(text, 10, 10) : text}
              </span>
              <Copy text={text} icon={<CopySvgMobile />} className="copy" />
            </span>
          </MobileView>
        </>
      ) : (
        text
      )
    },
  },
  {
    title: 'Initial Balance',
    dataIndex: 'initial_balance',
    elasticity: true,
    render: (text: string) => (text ? formatFilNum(text) : text),
  },
  {
    title: 'Locking Balance',
    dataIndex: 'locked_balance',
    elasticity: true,
    render: (text: string) => (text ? formatFilNum(text) : text),
  },
  {
    title: 'Locking Period ',
    dataIndex: 'unlock_start_time',
    elasticity: true,
    render: (text: string, record: any) => {
      if (!text) {
        return text
      }
      const lastTime = record?.unlock_end_time
      return (
        <span>
          {' '}
          {formatDateTime(text, 'YYYY-MM-DD HH:mm')} to{' '}
          {formatDateTime(lastTime, 'YYYY-MM-DD HH:mm')}
        </span>
      )
    },
  },
  {
    title: 'Approvals Threshold',
    elasticity: true,
    dataIndex: 'approvals_threshold',
  },
  {
    title: 'tokenList',
    elasticity: true,
    dataIndex: 'tokenList',
    render: (text: any) => {
      if (!text) return null
      if (Array.isArray(text)) {
        if (text.length === 0) return null
        const value = text[0]
        return <DropDown value={value} content={text.slice(1)} />
      }
    },
  },

  {
    title: 'Available Balance',
    dataIndex: 'available_balance',
    elasticity: true,
    render: (text: string) => (text ? formatFilNum(text) : text),
  },
  {
    title: 'Robust Address',
    dataIndex: 'robust_address',
    elasticity: true,
    type: ['account_basic'],
    render: (text: string, record: any) => {
      return text ? (
        <>
          <BrowserView>
            <span className="flex items-center gap-x-2">
              {text?.length > 30 ? isIndent(text, 10, 10) : text}
              <Copy text={text} />
            </span>
          </BrowserView>
          <MobileView>
            <span className="copy-row">
              <span className="normal-text">{text}</span>
              <Copy text={text} icon={<CopySvgMobile />} className="copy" />
            </span>
          </MobileView>
        </>
      ) : (
        text
      )
    },
  },
  {
    title: 'user_count',
    dataIndex: 'user_count',
    type: ['account_basic', 'evm_contract'],
    elasticity: true,
    render: (text: string) => (text ? formatNumber(text) : text),
  },
  {
    title: 'nonce',
    dataIndex: 'nonce',
    type: ['account_basic'],
    render: (text: any) => text,
  },
  {
    title: 'transfer_count',
    dataIndex: 'transfer_count',
    type: ['account_basic', 'evm_contract'],
    elasticity: true,
    render: (text: string) => (text ? formatNumber(text) : text),
  },

  {
    title: 'create_time',
    dataIndex: 'create_time',
    type: ['account_basic'],
    render: (text: number | string) => formatDateTime(text),
  },
  // {
  //   title: 'message_count',
  //   dataIndex: 'message_count',
  //   type: ['account_basic'],
  //   render: (text: any) => text,
  // },
  {
    title: 'latest_transfer_time',
    dataIndex: 'latest_transfer_time',
    type: ['account_basic'],
    render: (text: number | string) => formatDateTime(text),
  },

  {
    title: 'owned_miners',
    dataIndex: 'owned_miners',
    elasticity: true,
    isSplit: 5,
    width: '100%',
    type: ['account_basic'],
    render: (text: string) => {
      return Array.isArray(text) ? (
        <span className="flex flex-wrap items-center gap-2">
          {Array.isArray(text) &&
            text?.map((item: any) => {
              return (
                <Link className="link" key={item} href={`/miner/${item}`}>
                  {item}
                </Link>
              )
            })}
        </span>
      ) : (
        text
      )
    },
  },
  {
    title: 'owned_active_miners',
    dataIndex: 'active_miners',
    width: '100%',
    isSplit: 5,
    elasticity: true,
    type: ['account_basic'],
    render: (text: string) => {
      return Array.isArray(text) ? (
        <span className="flex flex-wrap items-center gap-2">
          {Array.isArray(text) &&
            text?.map((item: any) => {
              return (
                <Link className="link" key={item} href={`/miner/${item}`}>
                  {item}
                </Link>
              )
            })}
        </span>
      ) : (
        text
      )
    },
  },
  {
    title: 'Signers',
    dataIndex: 'signers',
    elasticity: true,
    render: (text: string) => {
      if (Array.isArray(text) && text.length > 0) {
        return <ShowText content={text} />
      }
      return null
      // console.log('signers',text)
      // return Array.isArray(text) ? <div className="flex items-baseline flex-col  flex-wrap justify-end gap-2">
      //   {text?.map((item:any,index:number) => {
      //     return <div className='flex w-full items-center gap-x-1 justify-end' key={ index}>{get_account_type(item,0)}</div>
      //   })}
      //   {text.length > 2 && <span>All</span> }
      // </div>:text
    },
  },
]

export const address_detail = {
  title: 'general_overview_title',
  content: (type: string) => {
    switch (type) {
      case 'account':
        return [...default_content]
      default:
        return [...default_content]
    }
  },
  account_change: {
    tabsList: [
      { title: '24h', dataIndex: '24h' },
      { title: '7d', dataIndex: '7d' },
      { title: '30d', dataIndex: '1m' },
      { title: 'year', dataIndex: '1y' },
    ],
    list: [
      {
        title: 'balance',
        type: 'line',
        dataIndex: 'balance',
        color: '#1C6AFD',
        seriesArea: true,
      },
    ],
  },
}

export const account_change = {
  title: 'account_change',
  list: [
    {
      title: 'balance',
      dataIndex: 'balance',
      color: '#FFC53D',
      type: 'line',
    },

    {
      title: 'available_balance',
      dataIndex: 'available_balance',
      color: '#4ACAB4',
      type: 'line',
    },
    {
      title: 'init_pledge',
      dataIndex: 'initial_pledge',
      type: 'line',
      color: '#1C6AFD',
    },
    {
      title: 'locked_balance',
      dataIndex: 'locked_funds',
      type: 'line',
      color: '#6E69CF',
    },
  ],
}

export const power_change = {
  title: 'power_change',
  tabList: [
    // { title: '7d', dataIndex: '7d' },
    { title: '30d', dataIndex: '1m' },
  ],
  list: [
    {
      title: 'quality_adjust_power',
      dataIndex: 'power',
      type: 'line',
      color: '#FFC53D',
      yIndex: 0,
    },
    {
      title: 'power_increase',
      dataIndex: 'power_increase',
      type: 'bar',
      color: '#1C6AFD',
      yIndex: 0,
    },
  ],
}

export const address_tabs = [
  {
    title: 'traces_list',
    dataIndex: 'traces_list',
    optionsUrl: 'TransferMethodByAccountID',
    // headerOptions: [
    //   { title: 'all', value: 'all' },
    //   { title: 'Blockreward', value: 'blockreward' },
    //   { title: 'Burn', value: 'burn' },
    //   { title: 'Transfer', value: 'transfer' },
    //   { title: 'Send', value: 'send', isIndent: true },
    //   { title: 'Receive', value: 'receive', isIndent: true },
    // ],
  },
  {
    title: 'message_list',
    dataIndex: 'message_list',
    optionsUrl: 'AllMethodByAccountID',
  },

  {
    title: 'erc20_transfer',
    dataIndex: 'ercList',
    value: 'ERC20AddrTransfers',
    optionsUrl: 'ERC20AddrTransfersTokenTypes',
  },
]
export const minerTabs = [
  {
    title: 'message_list',
    dataIndex: 'message_list',
    optionsUrl: 'AllMethodByAccountID',
  },
  {
    title: 'block_list',
    dataIndex: 'block_list',
  },
  {
    title: 'traces_list',
    dataIndex: 'traces_list',
    headerOptions: [
      { title: 'all', value: 'all' },
      { title: 'Blockreward', value: 'blockreward' },
      { title: 'Burn', value: 'burn' },
      { title: 'Transfer', value: 'transfer' },
      { title: 'Send', value: 'send', isIndent: true },
      { title: 'Receive', value: 'receive', isIndent: true },
    ],
  },
]

export const message_list = (fromList: any, toList: any) => [
  {
    dataIndex: 'cid',
    title: 'cid',
    width: '10%',
    render: (text: string) =>
      text ? (
        <Link href={`/message/${text}`} className="link_text">
          {text ? isIndent(text, 6) : ''}
        </Link>
      ) : (
        '--'
      ),
  },
  {
    dataIndex: 'height',
    title: 'height',
    width: '10%',
    render: (text: string) => (
      <Link href={`/height/${text}`} className="link_text">
        {text}
      </Link>
    ),
  },
  {
    dataIndex: 'block_time',
    title: 'time',
    width: '13%',
    render: (text: string | number) => formatDateTime(text, 'YYYY-MM-DD HH:mm'),
  },
  {
    dataIndex: 'from',
    title: 'from',
    width: '15%',
    render: (text: string, record: any) => {
      if (!text) return '--'
      return (
        <span className="flex items-center gap-x-2">
          <AccountLink value={text} tagText={record.from_tag} />
          {fromList?.domains && fromList?.domains[text] && (
            <Link
              href={`/domain/${fromList.domains[text]}?provider=${fromList.provider}`}
            >
              ({fromList.domains[text]})
            </Link>
          )}
        </span>
      )
    },
  },
  {
    dataIndex: 'to',
    title: 'to',
    width: '12%',
    render: (text: string, record: any) => {
      if (!text) return '--'
      return (
        <div className="flex items-center gap-x-2">
          <AccountLink value={text} tagText={record.to_tag} />
          {toList?.domains && toList?.domains[text] && (
            <Link
              href={`/domain/${toList.domains[text]}?provider=${toList.provider}`}
            >
              ({toList.domains[text]})
            </Link>
          )}
        </div>
      )
    },
  },
  {
    dataIndex: 'value',
    title: 'value',
    width: '15%',
    render: (text: number) =>
      text ? formatFilNum(text, false, false) : text || '--',
  },
  { dataIndex: 'exit_code', width: '10%', title: 'status' },
  { dataIndex: 'method_name', width: '15%', title: 'method_name' },
]

export const block_list = (fromList: any, toList: any) => [
  {
    dataIndex: 'cid',
    title: 'block_cid',
    width: '20%',
    render: (text: string) =>
      text ? (
        <Link href={`/cid/${text}`} className="link_text">
          {text ? isIndent(text, 6) : ''}
        </Link>
      ) : (
        '--'
      ),
  },
  {
    dataIndex: 'height',
    title: 'block_height',
    width: '20%',
    render: (text: string) => (
      <Link href={`/height/${text}`} className="link_text">
        {text}
      </Link>
    ),
  },
  {
    dataIndex: 'block_time',
    title: 'block_time',
    width: '20%',
    render: (text: string | number) => formatDateTime(text, 'YYYY-MM-DD HH:mm'),
  },
  {
    dataIndex: 'messages_count',
    width: '20%',
    title: 'block_messages_count',
  },
  // {
  //   dataIndex: 'miner_id',
  //   width: '15%',
  //   title: 'block_miner_id',
  //   render: (text: string) => (
  //     <Link href={`/miner/${text}`} className='link'>
  //       {text}
  //     </Link>
  //   ),
  // },
  {
    dataIndex: 'reward',
    title: 'block_mined_reward',
    width: '20%',
    render: (text: number) =>
      text ? formatFilNum(text, false, false) : text || '--',
  },
]
export const trance_list = (fromList: any, toList: any) => [
  {
    dataIndex: 'block_time',
    title: 'time',
    width: '20%',
    render: (text: string | number) => formatDateTime(text, 'YYYY-MM-DD HH:mm'),
  },
  {
    dataIndex: 'cid',
    title: 'cid',
    width: '15%',
    render: (text: string) =>
      text ? (
        <Link href={`/message/${text}`} className="link">
          {isIndent(text, 6)}
        </Link>
      ) : (
        '--'
      ),
  },
  {
    dataIndex: 'from',
    title: 'from',
    width: '15%',
    render: (text: string, record: any) => {
      if (!text) return '--'
      return (
        <span className="flex items-center gap-x-2">
          <AccountLink value={text} tagText={record.from_tag} />
          {fromList?.domains && fromList?.domains[text] && (
            <Link
              href={`/domain/${fromList.domains[text]}?provider=${fromList.provider}`}
            >
              ({fromList.domains[text]})
            </Link>
          )}
        </span>
      )
    },
  },
  {
    dataIndex: 'to',
    title: 'to',
    width: '15%',
    render: (text: string, record: any) => {
      if (!text) return '--'
      return (
        <div className="flex items-center gap-x-2">
          <AccountLink value={text} tagText={record.to_tag} />
          {toList?.domains && toList?.domains[text] && (
            <Link
              href={`/domain/${toList.domains[text]}?provider=${toList.provider}`}
            >
              ({toList.domains[text]})
            </Link>
          )}
        </div>
      )
    },
  },
  {
    dataIndex: 'value',
    width: '20%',
    title: 'value',
    render: (text: number, record: any) => {
      if (!text) return '--'
      //const method_name = record?.method_name?.toLocaleLowerCase();
      let className = Number(text) < 0 ? 'text_red' : 'text_green'
      let flag = Number(text) < 0 ? '-' : '+'
      // if (method_name) {
      //   if (method_name === 'burn' || method_name === 'send') {
      //     className = 'text_red'
      //     flag='-'
      //   } else if (method_name === 'blockreward' || method_name === 'receive') {
      //     className = 'text_green'
      //     flag='+'

      //   }
      // }
      return (
        <span className={className}>
          {flag}
          {formatFilNum(Math.abs(text))}
        </span>
      )
    },
  },
  { dataIndex: 'method_name', width: '15%', title: 'method_name' },
]

export const ercToken_list = (fromList: any, toList: any) => {
  return [
    {
      dataIndex: 'time',
      title: 'time',
      width: '20%',
      render: (text: string | number) =>
        formatDateTime(text, 'YYYY-MM-DD HH:mm'),
    },
    {
      dataIndex: 'cid',
      title: 'cid',
      width: '13%',
      render: (text: string) =>
        text ? (
          <Link href={`/message/${text}`} className="link">
            {isIndent(text, 6)}
          </Link>
        ) : (
          '--'
        ),
    },
    {
      dataIndex: 'from',
      title: 'from',
      width: '13%',
      render: (text: string, record: any) => {
        if (!text) return '--'
        return (
          <span className="flex items-center gap-x-2">
            <AccountLink value={text} tagText={record.from_tag} />
            {fromList?.domains && fromList?.domains[text] && (
              <Link
                href={`/domain/${fromList.domains[text]}?provider=${fromList.provider}`}
              >
                ({fromList.domains[text]})
              </Link>
            )}
          </span>
        )
      },
    },
    {
      dataIndex: 'to',
      title: 'to',
      width: '14%',
      render: (text: string, record: any) => {
        if (!text) return '--'
        return (
          <div className="flex items-center gap-x-2">
            <AccountLink value={text} tagText={record.to_tag} />
            {toList?.domains && toList?.domains[text] && (
              <Link
                href={`/domain/${toList.domains[text]}?provider=${toList.provider}`}
              >
                ({toList.domains[text]})
              </Link>
            )}
          </div>
        )
      },
    },
    {
      dataIndex: 'method',
      title: 'method',
      width: '20%',
      render: (text: string) => text,
    },
    {
      dataIndex: 'amount',
      title: 'amount',
      width: '10%',
      render: (text: number, record: any) => {
        return (
          <div className="flex items-center gap-x-2">
            {formatNumber(text)}
            <span>{record.token_name}</span>
          </div>
        )
      },
    },
    {
      dataIndex: 'icon_url',
      width: '10%',
      title: 'Token',
      render: (text: string, record: any) => {
        if (!text) {
          return <Image src={text} width={25} height={25} />
        }
        return (
          <Link href={`/token/${record?.contract_id}`}>
            <Image src={text} width={25} height={25} />
          </Link>
        )
      },
    },
  ]
}

//height
export const height_list = {
  headerList: [
    {
      dataIndex: 'blcok_time',
      title: 'blcok_time',
      render: (text: string) => formatDateTime(text),
    },
    {
      dataIndex: 'message_count_deduplicate',
      title: 'message_count_deduplicate',
      render: (text: string | number) => formatNumber(text),
    },
  ],
  columns: [
    {
      dataIndex: 'cid',
      title: 'block_cid',
      render: (text: string | number) => {
        return <Link href={`/cid/${text}`}>{text}</Link>
      },
    },
    {
      dataIndex: 'miner_id',
      title: 'miner_id',
      render: (text: string | number) => (
        <Link href={`/miner/${text}`}>{text}</Link>
      ),
    },
    {
      dataIndex: 'messages_count',
      title: 'messages_count',
      render: (text: string | number) => formatNumber(text),
    },
    {
      dataIndex: 'reward',
      title: 'reward',
      render: (text: any, data: any) =>
        text ? formatFilNum(text, false, false) : text || '--',
    },
  ],
}

//cid detail
export const cid_list = {
  headerList: [
    {
      title: 'blocks_cid',
      dataIndex: 'cid',
      type: ['block_basic'],
      render: (text: any) => {
        return (
          <>
            <BrowserView>{text}</BrowserView>
            <MobileView>
              <span className="copy-row">
                <span className="text">{text}</span>
                <Copy text={text} icon={<CopySvgMobile />} className="copy" />
              </span>
            </MobileView>
          </>
        )
      },
    },
    {
      title: 'cid_height',
      dataIndex: 'height',
      type: ['block_basic'],
      render: (text: any) => {
        if (!text) return '--'
        return (
          <Link href={`/height/${text}`} className="link">
            {formatNumber(text)}
          </Link>
        )
      },
    },
    {
      title: 'block_time',
      dataIndex: 'block_time',
      type: ['block_basic'],
      render: (text: any, data: any) => formatDateTime(text, 'YYYY-MM-DD'),
    },
    {
      title: 'blocks_messages',
      dataIndex: 'messages_count',
      type: ['block_basic'],
      render: (text: number | string) => String(text) || '--',
    },
    {
      title: 'blocks_miner',
      dataIndex: 'miner_id',
      type: ['block_basic'],
      render: (text: any) => {
        return (
          <Link href={`/miner/${text}`} className="link">
            {text}
          </Link>
        )
      },
    },
    {
      title: 'win_count',
      dataIndex: 'win_count',
      render: (text: number | string) => String(text) || '--',
    },
    {
      title: 'blocks_reward',
      dataIndex: 'mined_reward',
      type: ['block_basic'],
      render: (text: any, data: any) =>
        text ? formatFilNum(text, false, false) : text || '--',
    },
    {
      title: 'parents_cid',
      dataIndex: 'parents',
      type: ['block_basic'],
      render: (text: any, data: any) => {
        return (
          <div className="flex flex-col gap-y-2">
            {data?.parents?.map((item: string) => {
              return (
                <Link href={`/cid/${item}`} key={item} className="link">
                  {item}
                </Link>
              )
            })}
          </div>
        )
      },
    },
    {
      title: 'parent_weight',
      dataIndex: 'parent_weight',
    },
    {
      title: 'parent_base_fee',
      dataIndex: 'parent_base_fee',
    },
    {
      title: 'ticket_value',
      dataIndex: 'ticket_value',
    },
    {
      title: 'state_root',
      dataIndex: 'state_root',
    },
  ],
  columns: (fromList: any, toList: any) => [
    {
      dataIndex: 'cid',
      title: 'cid',
      render: (text: string) => (
        <Link href={`/message/${text}`} className="link">
          {text ? isIndent(text, 6) : ''}
        </Link>
      ),
    },
    {
      dataIndex: 'height',
      title: 'height',
      render: (text: string) => (
        <Link href={`/height/${text}`} className="link">
          {text}
        </Link>
      ),
    },
    {
      dataIndex: 'block_time',
      title: 'block_time',
      render: (text: string | number) =>
        formatDateTime(text, 'YYYY-MM-DD HH:mm'),
    },
    {
      dataIndex: 'from',
      title: 'from',
      render: (text: string, record: any) => {
        if (!text) return '--'
        return (
          <span className="flex items-center gap-x-2">
            <AccountLink value={text} />
            {fromList?.domains && fromList?.domains[text] && (
              <Link
                href={`/domain/${fromList.domains[text]}?provider=${fromList.provider}`}
              >
                ({fromList.domains[text]})
              </Link>
            )}
          </span>
        )
      },
    },
    {
      dataIndex: 'to',
      title: 'to',
      render: (text: string, record: any) => {
        if (!text) return '--'
        return (
          <div className="flex items-center gap-x-2">
            <AccountLink value={text} unit={0} />

            {toList?.domains && toList?.domains[text] && (
              <Link
                href={`/domain/${toList.domains[text]}?provider=${toList.provider}`}
              >
                ({toList.domains[text]})
              </Link>
            )}
          </div>
        )
      },
    },
    {
      dataIndex: 'value',
      title: 'value',
      render: (text: number) =>
        text ? formatFilNum(text, false, false) : text || '--',
    },
    { dataIndex: 'exit_code', title: 'status' },
    { dataIndex: 'method_name', title: 'method_name' },
  ],
}

//deal
export const deal_list = {
  list: [
    { dataIndex: 'deal_id', title: 'deal_id' },
    {
      dataIndex: 'service_start_time',
      title: 'service_start_time',
      render: (text: string) => formatDateTime(text),
    },
    {
      dataIndex: 'epoch',
      title: 'epoch',
      render: (text: number | string) => (
        <Link className="link" href={`/height/${text}`}>
          {text}
        </Link>
      ),
    },
    {
      dataIndex: 'message_cid',
      title: 'message_cid',
      render: (text: number | string) => (
        <Link className="link" href={`/message/${text}`}>
          {text}
        </Link>
      ),
    },
    { dataIndex: 'piece_cid', title: 'piece_cid' },
    {
      dataIndex: 'verified_deal',
      title: 'verified_deal',
      render: (text: boolean) => {
        const icon =
          typeof text === 'boolean' ? (text ? 'successIcon' : 'errorIcon') : ''
        return (
          <span className="flex items-center gap-x-2">
            {icon && getSvgIcon(icon)}
            {String(text)}
          </span>
        )
      },
    },
  ],
  content: {
    left_title: 'deal_left_title',
    right_title: 'deal_right_title',
    value: 'deal_value',
    cash: 'deal_cash',
    time: 'deal_time',
  },
}
