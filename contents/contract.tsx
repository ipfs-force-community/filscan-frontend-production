/** @format */

import Copy from '@/components/copy'
import TpWallet from '@/components/TPWallet'
import Tooltip from '@/packages/tooltip'
import CopySvgMobile from '@/assets/images/icon-copy.svg'
import {
  formatDateTime,
  formatFilNum,
  formatNumber,
  get$Number,
  isIndent,
  titleCase,
} from '@/utils'
import Image from '@/packages/image'
import { resolveStaticUrl } from '@/contents/apiUrl'
import Link from 'next/link'
import { BrowserView, MobileView } from '@/components/device-detect'
import AccountLink from '@/components/accountLink'

//合约验证
export const verify_first = {
  list: [
    {
      type: 'Input',
      dataIndex: 'contract_address',
      title: 'address',
      placeholder: 'address_placeholder',
      rules: [
        { required: true, message: '' },
        {
          validator: (_: any, value: string) => {
            if (
              !value ||
              value.length == 0 ||
              value.startsWith('0x') ||
              value.startsWith('f') ||
              value.startsWith('t')
            ) {
              return Promise.resolve()
            }
            return Promise.reject('')
          },
        },
      ],
    },
    {
      type: 'Select',
      title: 'verify_address',
      dataIndex: 'compile_version',
      placeholder: 'verify_select_placeholder',
      //rules: [{ required: true, message: '${compile_version} is required' }],
    },
    {
      type: 'Select',
      title: 'verify_model',
      dataIndex: 'verify_model',
      placeholder: 'verify_model_placeholder',
      // rules: [{ required: true, message: '${verify_model} is required' }],
      options: [
        {
          label: 'Solidity File',
          value: 'single',
        },
        {
          label: 'Solidity File with Metadata',
          title: 'Solidity File with Metadata',
          value: 'multi',
        },
        {
          label: 'Hardhat Support (Quickly)',
          value: 'standard',
        },
      ],
    },
    {
      type: 'Select',
      title: 'license_type',
      dataIndex: 'license',
      placeholder: 'verify_select_placeholder',
      // options: [
      //   {
      //     title: 'No License(None)',
      //     value: 'No license(None)'
      //   },
      //   {
      //     title: 'MIT License(MIT)',
      //     value: 'MIT license(MIT)'
      //   }
      // ]
    },
  ],
}
export const verify = {
  tabList: [
    { dataIndex: 'source_code', title: 'source_code' },
    { dataIndex: 'compile_output', title: 'compile_output' },
  ],
  meta_list_des: [
    { title: 'config_file_des1' },
    { title: 'config_file_des1_1' },
    { title: 'config_file_des1_2' },
    { title: 'config_file_des2' },
    { title: 'config_file_des2_1' },
    { title: 'config_file_des2_2' },
  ],
}

export const verify_source = {
  desList: [
    { title: 'content_des1' },
    { title: 'content_des2' },
    { title: 'content_des3' },
  ],
  headerList: [
    { title: 'contract_address', dataIndex: 'contract_address' },
    { title: 'compile_version', dataIndex: 'compile_version' },
    {
      title: 'optimize',
      dataIndex: 'optimize',
      type: 'Select',
      options: [
        {
          title: 'Yes',
          label: 'Yes',
          value: true,
        },
        {
          title: 'No',
          label: 'No',
          value: false,
        },
      ],
    },
    { title: 'run_optimizer', dataIndex: 'optimize_runs', type: 'Input' },
  ],
}

export const verify_output = {
  headerList: [
    { title: 'compile_version', dataIndex: 'compiler' },
    { title: 'optimize', dataIndex: 'optimize' },
    { title: 'RUNS', dataIndex: 'optimize_runs' },
  ],
}

export const contract_rank = {
  title: 'contract_rank',
  title_des: 'contract_rank_des',
  options: [
    { title: 'transaction_count', value: 'transfer_count' },
    { title: 'actor_balance', value: 'actor_balance' },
    { title: 'gas_cost', value: 'gas_cost' },
    { title: 'user_count', value: 'user_count' },
  ],
  total_msg: 'contract_rank_total',
  columns: [
    {
      title: 'rank',
      dataIndex: 'rank',
      width: '10%',
      render: (text: string) => <span className="rank_icon">{text}</span>,
    },
    {
      title: 'contract_address',
      dataIndex: 'contract_address',
      width: '10%',
      render: (text: any, record: any) => {
        if (!text) return '--'
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
      },
    },
    {
      title: 'contract_name',
      dataIndex: 'contract_name',
      width: '20%',
    },
    {
      title: 'transaction_count',
      dataIndex: 'transfer_count',
      width: '15%',
      sorter: true,
      align: 'left',
      defaultSortOrder: 'descend',
      render: (text: number) => formatNumber(text),
    },
    {
      title: 'user_count',
      dataIndex: 'user_count',
      width: '15%',
      sorter: true,
      render: (text: number) => formatNumber(text),
    },
    {
      title: 'actor_balance',
      dataIndex: 'actor_balance',
      width: '15%',
      render: (text: number) => formatFilNum(text),
      sorter: true,
    },
    {
      title: 'gas_cost',
      dataIndex: 'gas_cost',
      width: '15%',
      render: (text: number) => formatFilNum(text),
      sorter: true,
    },
  ],
  mobileColumns: [
    {
      title: 'rank',
      dataIndex: 'rank',
      width: '10%',
      render: (text: string) => <span className="rank_icon">{text}</span>,
    },
    {
      title: 'contract_address',
      dataIndex: 'contract_address',
      width: '30%',
      render: (text: any, record: any) => {
        if (!text) return '--'
        return (
          <span className="copy-row flex items-center gap-x-2">
            <Link className="link_text" href={`/address/${text}`}>
              {isIndent(text, 5, 4)}
            </Link>
          </span>
        )
      },
    },
    {
      title: 'contract_name',
      dataIndex: 'contract_name',
      width: '20%',
    },
    {
      title: 'transaction_count',
      dataIndex: 'transfer_count',
      width: '15%',
      align: 'right',
      render: (text: number) => formatNumber(text),
    },
  ],
}

export const homeContractRank: any = {
  rank: 60,
  contract_address: 100,
  contract_name: 115,
  transfer_count: 100,
  user_count: 50,
}

export const mobileHomeContractRank: string[] = [
  'rank',
  'contract_address',
  'contract_name',
  'transfer_count',
]

export const contract_list = {
  columns: [
    // {
    //   dataIndex: 'rank',
    //   title: 'rank',
    //   width:'10%',
    //   render: (text: any, record: any) => {
    //     return <span className='rank_icon'>{ text}</span>
    //   } },
    {
      dataIndex: 'contract_address',
      title: 'contract_address',
      width: '20%',
      render: (text: any, record: any) => {
        if (!text) return '--'
        return (
          <Link className="link" href={`/address/${text}`}>
            {text}
          </Link>
        )
      },
    },
    {
      dataIndex: 'contract_name',
      width: '10%',
      title: 'contract_name',
      render: (text: any, record: any) => {
        if (!text) return '--'
        return <Link href={`/address/${record.contract_address}`}>{text}</Link>
      },
    },
    { dataIndex: 'language', title: 'language', width: '10%' },
    { dataIndex: 'compiler', title: 'compile_version', width: '15%' },
    { dataIndex: 'optimize_runs', title: 'Optimizations', width: '15%' },
    {
      dataIndex: 'license',
      title: 'license',
      render: (text: any) => text || 'No License(None)',
      width: '20%',
    },
  ],
}

export const contract_token = {
  columns: (tr: any) => {
    return [
      {
        dataIndex: 'rank',
        title: 'rank',
        width: '10%',
        render: (text: any, record: any, index: any) => {
          return <span className="rank_icon">{index + 1}</span>
        },
      },
      {
        dataIndex: 'token_name',
        title: 'token_name',
        render: (text: string, record: any) => {
          return (
            <>
              <Link
                href={`/token/${record.contract_id}`}
                className="flex items-center gap-x-1"
              >
                <Image src={record?.icon_url} alt="" height={32} width={32} />
                <span className="margin-6 text_color">{text}</span>
              </Link>
              {}
            </>
          )
        },
      },
      {
        dataIndex: 'total_supply',
        title: () => {
          return (
            <>
              <BrowserView>
                <span className="flex items-center gap-x-2">
                  <span> {tr('total_supply')}</span>
                  <Tooltip context={tr('total_supply_tip')} />
                </span>
              </BrowserView>
              <MobileView>
                <span className="flex items-center gap-x-2">
                  <span style={{ width: 'min-content', wordBreak: 'initial' }}>
                    {' '}
                    {tr('total_supply')}
                  </span>
                  <Tooltip context={tr('total_supply_tip')} />
                </span>
              </MobileView>
            </>
          )
        },
        render: (text: string | number) => {
          return text ? formatNumber(text, 4) : text
        },
      },
      {
        dataIndex: 'vol_24',
        title: 'vol_24',
        render: (text: string) => get$Number(text),
      },
      {
        dataIndex: 'latest_price',
        title: 'latest_price',
        render: (text: string) => (text ? get$Number(text) : text),
      },
      {
        dataIndex: 'market_cap',
        title: 'market_value',
        render: (text: string) => (text ? get$Number(text) : '--'),
      },
      { dataIndex: 'owners', title: 'owners' },
    ]
  },
}

export const token_details = {
  headerList: [
    {
      title: 'overview',
      list: [
        {
          title: 'total_supply',
          dataIndex: 'total_supply',
          render: (text: string) => {
            return text ? formatNumber(text, 4) : text || '--'
          },
        },
        {
          title: 'owners',
          dataIndex: 'owners',
        },
        {
          title: 'transfers',
          dataIndex: 'transfers',
        },
      ],
    },
    {
      title: 'market',
      list: [
        {
          title: 'latest_price',
          dataIndex: 'latest_price',
          render: (text: string) => (text ? get$Number(text) : text || '--'),
        },
        {
          title: 'market_value',
          dataIndex: 'market_cap',
          render: (text: string) => (text ? get$Number(text) : text || '--'),
        },
        {
          title: 'token_contract',
          dataIndex: 'contract_id',
          render: (text: string, record: any) => {
            if (!text) {
              return '--'
            }
            return (
              <span className="flex items-center gap-x-2">
                <Link href={`/address/${text}`} className="link">
                  {text}
                </Link>
                <Copy text={text} />
                <TpWallet data={record} />
              </span>
            )
          },
        },
      ],
    },
  ],
  tabList: [
    {
      title: 'transfer',
      dataIndex: 'transfer',
      total: 'transfer_total',
    },
    {
      title: 'owner',
      dataIndex: 'owner',
      total: 'owner_total',
    },
    {
      title: 'dex',
      dataIndex: 'dex',
      total: 'dex_total',
    },
  ],
}

export const token_transfer_columns = (fromList: any, toList: any) => {
  return [
    {
      dataIndex: 'cid',
      title: 'message_cid',
      width: '10%',
      render: (text: string) =>
        text ? (
          <Link href={`/message/${text}`} className="link">
            {text ? isIndent(text, 6) : ''}
          </Link>
        ) : (
          '--'
        ),
    },
    {
      dataIndex: 'method',
      title: 'method',
      width: '25%',
      render: (text: string) => <span>{titleCase(text)}</span>,
    },
    {
      dataIndex: 'time',
      title: 'time',
      width: '20%',
      render: (text: string | number) =>
        formatDateTime(text, 'YYYY-MM-DD HH:mm'),
    },
    {
      dataIndex: 'from',
      title: 'from',
      width: '15%',
      render: (text: string, record: any) => {
        if (!text) return '--'
        return (
          <span className="flex items-center gap-x-1">
            {/* {get_account_type(text)} */}
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
      width: '15%',
      render: (text: string, record: any) => {
        if (!text) return '--'
        return (
          <span className="flex items-center gap-x-1">
            <AccountLink value={text} />
            {toList?.domains && toList?.domains[text] && (
              <Link
                href={`/domain/${toList.domains[text]}?provider=${toList.provider}`}
              >
                ({toList.domains[text]})
              </Link>
            )}
          </span>
        )
      },
    },
    {
      dataIndex: 'amount',
      title: 'amount',
      width: '10%',
      render: (text: string, record: any) =>
        text ? formatNumber(text, 4) : text || '--',
    },
  ]
}

export const token_owner_columns = (ownerList: any) => {
  return [
    {
      dataIndex: 'rank',
      title: 'rank',
      width: '10%',
      render: (text: string) => <span className="rank_icon">{text}</span>,
    },
    {
      dataIndex: 'owner',
      title: 'owner',
      width: '40%',
      render: (text: string, record: any) => {
        if (!text) return '--'
        return (
          <span className="link_text flex items-center gap-x-1">
            <Link href={`/address/${text}`}> {text} </Link>
            {text && <Copy text={text} />}
            {ownerList?.domains && ownerList?.domains[text] && (
              <Link
                href={`/domain/${ownerList.domains[text]}?provider=${ownerList.provider}`}
              >
                ({ownerList.domains[text]})
              </Link>
            )}
          </span>
        )
      },
    },
    {
      dataIndex: 'amount',
      title: 'amount',
      width: '20%',
      render: (text: string, record: any) =>
        text ? formatNumber(text, 4) : text || '--',
    },
    {
      dataIndex: 'rate',
      title: 'percentage',
      width: '15%',
      render: (text: string, record: any) =>
        text ? Number(text).toFixed(4) + '%' : text || '--',
    },
    {
      dataIndex: 'value',
      title: 'Value',
      width: '15%',
      render: (text: any) => (text ? get$Number(text) : ''),
    },
  ]
}

export const token_Dex_columns = [
  {
    dataIndex: 'cid',
    title: 'message_cid',
    render: (text: string) => {
      if (!text) return '--'
      return (
        <Link href={`/message/${text}`} className="link_text">
          {isIndent(text)}
        </Link>
      )
    },
  },
  {
    dataIndex: 'time',
    title: 'time',
    render: (text: string) => formatDateTime(text, 'YYYY-MM-DD HH:mm'),
  },
  {
    dataIndex: 'action',
    title: 'Action',
    render: (text: string) => {
      const color = text === 'buy' ? 'green' : text === 'sell' ? 'red' : ''
      return (
        <span style={{ color }}>
          {text ? text[0].toUpperCase() + text.substr(1) : text}
        </span>
      )
    },
  },

  {
    dataIndex: 'amount_out',
    title: 'Token_Amount_out',
    render: (text: number, record: any) => {
      return formatNumber(text, 4) + ' ' + record?.amount_out_token_name
    },
  },
  {
    dataIndex: 'amount_in',
    title: 'Token_Amount_in',
    render: (text: number, record: any) => {
      return formatNumber(text, 4) + ' ' + record?.amount_in_token_name
    },
  },
  {
    dataIndex: 'swap_rate',
    title: 'swapped_Rate',
    render: (text: string, record: any) =>
      text ? text + ' ' + record.swap_token_name : '',
  },
  {
    dataIndex: 'value',
    title: 'Txn_Value',
    render: (text: string) => get$Number(text),
  },
  {
    dataIndex: 'dex',
    title: 'platform',
    render: (text: string, record: any) => {
      return (
        <span
          className="link"
          onClick={() => {
            if (record.dex_url) {
              window.open(record.dex_url)
            }
          }}
        >
          <Image
            className="fvm_img_url"
            src={record.icon_url}
            alt=""
            width={25}
            height={25}
          />
        </span>
      )
    },
  },
]

export const contract_nfts = {
  columns: [
    {
      dataIndex: 'rank',
      title: 'rank',
      render: (text: any, record: any, index: any) => {
        return <span className="rank_icon">{index + 1}</span>
      },
    },
    {
      dataIndex: 'collection',
      title: 'Collection',
      render: (text: string, record: any) => {
        if (!text) return '--'
        return (
          <Link
            href={`/nft/${record.provider}`}
            className="flex items-center gap-x-2"
          >
            <Image
              className="fvm_img_url"
              src={resolveStaticUrl(record.icon)}
              alt=""
              height={36}
              width={36}
            />
            <span className="text_color"> {text}</span>
          </Link>
        )
      },
    },
    // { dataIndex: 'trading_volume', title: 'Volume' },
    { dataIndex: 'holders', title: 'owner' },
    {
      dataIndex: 'transfers',
      title: 'transfer',
      render: (text: string) => (text ? formatNumber(text, 4) : '--'),
    },
  ],
}

export const nft_details = {
  headerList: [
    {
      title: 'overview',
      list: [
        {
          title: 'total_supply',
          dataIndex: 'total_supply',
          render: (text: string) => {
            return text ? formatNumber(text, 4) : text || '--'
          },
        },
        {
          title: 'owners',
          dataIndex: 'owners',
        },
        {
          title: 'transfers',
          dataIndex: 'transfers',
        },
      ],
    },
    {
      title: 'market',
      list: [
        {
          title: 'token_contract',
          dataIndex: 'contract',
          render: (text: string) => {
            if (text) {
              return (
                <>
                  <BrowserView>
                    <span className="flex gap-x-1 ">
                      <Link href={`/address/${text}`} className="link">
                        {text}
                      </Link>
                      <Copy text={text} />
                    </span>
                  </BrowserView>
                  <MobileView>
                    <span className="copy-row">
                      <Link href={`/address/${text}`} className="link">
                        {text}
                      </Link>
                      <Copy
                        text={text}
                        icon={<CopySvgMobile />}
                        className="copy"
                      />
                    </span>
                  </MobileView>
                </>
              )
            }
            return '--'
          },
        },
      ],
    },
  ],
  tabList: [
    {
      title: 'transfer',
      dataIndex: 'transfer',
      total: 'transfer_total',
    },
    {
      title: 'owner',
      dataIndex: 'owner',
      total: 'owner_total',
    },
  ],
}

export const nft_transfer_columns = (fromList: any, toList: any) => {
  return [
    {
      dataIndex: 'cid',
      title: 'message_cid',
      render: (text: string) =>
        text ? (
          <Link href={`/message/${text}`} className="link">
            {text ? isIndent(text, 6) : ''}
          </Link>
        ) : (
          '--'
        ),
    },

    {
      dataIndex: 'time',
      title: 'time',
      render: (text: string | number) =>
        formatDateTime(text, 'YYYY-MM-DD HH:mm'),
    },
    {
      dataIndex: 'from',
      title: 'from',
      render: (text: string, record: any) => {
        if (!text) return '--'
        return (
          <span className="flex items-center gap-x-1">
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
          <div className="flex items-center gap-x-1">
            <AccountLink value={text} />
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
      dataIndex: 'item',
      title: 'item',
      render: (text: string, record: any) => {
        if (record.url) {
          return (
            <Image
              className="fvm_img_url"
              alt=""
              width={25}
              height={25}
              src={record.url}
            />
          )
        }
        return text || '--'
      },
    },
  ]
}

export const nft_owner_columns = (ownerList: any) => {
  return [
    {
      dataIndex: 'rank',
      title: 'rank',
      width: '10%',
      render: (text: string) => <span className="rank_icon">{text}</span>,
    },
    {
      dataIndex: 'owner',
      title: 'owner',
      width: '50%',
      render: (text: string, record: any) => {
        if (!text) return '--'
        return (
          <span className="flex items-center gap-x-1">
            {text}
            {ownerList?.domains && ownerList?.domains[text] && (
              <Link
                href={`/domain/${ownerList.domains[text]}?provider=${ownerList.provider}`}
              >
                ({ownerList.domains[text]})
              </Link>
            )}
          </span>
        )
      },
    },
    {
      dataIndex: 'amount',
      title: 'amount',
      width: '20%',
      render: (text: string, record: any) =>
        text ? formatNumber(text, 4) : text || '--',
    },
    {
      dataIndex: 'percentage',
      width: '20%',
      title: 'percentage',
      render: (text: string, record: any) =>
        text ? Number(Number(text) * 100).toFixed(4) + '%' : text || '--',
    },
  ]
}

//合约详情
//已验证合约 读写合约

export const verify_tabs = [
  {
    title: 'Verify_code',
    dataIndex: 'Verify_code',
  },
  {
    title: 'Verify_read',
    dataIndex: 'Verify_read',
  },
  {
    title: 'Verify_write',
    dataIndex: 'Verify_write',
  },
]
export const contract_detail = {
  list: [
    {
      dataIndex: 'contract_name',
      title: 'contract_name',
    },
    {
      dataIndex: 'optimize',
      title: 'optimize',
      render: (text: boolean, record: any) => {
        return text
          ? titleCase(text) + ` with (${record.optimize_runs}) runs`
          : titleCase(text)
      },
    },
    {
      dataIndex: 'compiler',
      title: 'compiler',
    },
    {
      dataIndex: 'license',
      title: 'license',
    },
  ],
  abiOptions: {
    placeholder: 'source_abi_default',
    list: [
      { label: 'Json_Format', value: 'json' },
      { label: 'Text_Format', value: 'text' },
    ],
  },
}
export const contract_log = [
  {
    dataIndex: 'epoch',
    title: 'epoch',
  },
  {
    dataIndex: 'cid',
    title: 'cid',
    render: (text: string) => (
      <Link href={`/message/${text}`} className="link">
        {text}
      </Link>
    ),
  },
  {
    dataIndex: 'event_name',
    title: 'event_name',
  },
  {
    dataIndex: 'topics',
    title: 'topics',
    render: (text: any, record: any) => {
      if (Array.isArray(text)) {
        return text.map((item: string, index: number) => {
          return (
            <li key={item} className="mb-1 flex items-center gap-x-1">
              <span className="item-center flex h-5 w-5 flex-shrink-0 justify-center rounded-[5px] border bg-bg_hover">
                {index}
              </span>
              <span> {item}</span>
            </li>
          )
        })
      }
      return text || '--'
    },
  },
  {
    dataIndex: 'data',
    title: 'coompoent_data',
    render: (text: string) => {
      return (
        <div className="rounded-md bg-bg_hover px-2.5 py-2">
          <div className="code">
            <pre
              className="pre"
              style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}
            >
              {JSON.stringify(text, undefined, 6)}
            </pre>
            {/* <JSONPretty id="json-pretty" data={showValue}></JSONPretty> */}
          </div>
        </div>
      )
    },
  },
  {
    dataIndex: 'log_index',
    title: 'log_index',
    render: (text: number) => text,
  },
  {
    dataIndex: 'removed',
    title: 'removed',
    render: (text: boolean) => String(text),
  },
]
