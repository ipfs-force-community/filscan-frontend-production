/** @format */
import { formatFil, formatFilNum, formatNumber, unitConversion } from '@/utils'

export const home_meta = [
  {
    title: 'quality_power/increase_24h',
    dataIndex: 'total_quality_power', //近24h增长算力
    tip: 'total_quality_power_tip',
    tipContent: [
      {
        title: 'quality_power_Cc',
        dataIndex: 'Cc',
        render: (text: string | number) => unitConversion(text, 2),
      },
      {
        title: 'quality_power_Dc',
        dataIndex: 'Dc',
        render: (text: string | number) => unitConversion(text, 2),
      },
    ],
    render: (v: any, record: Record<string, any>) => {
      const changeText =
        record?.power_increase_24h && Number(record.power_increase_24h)
      const className = changeText
        ? changeText < 0
          ? 'text_red'
          : 'text_green'
        : ''
      const flag = changeText ? (changeText > 0 ? '+' : '-') : ''
      const [textValue, unit] = unitConversion(v, 2).split(' ')
      return (
        <>
          <span>{textValue}</span>
          <span className="unit ml-1 inline text-xs">{unit}</span>
          <span className={`${className} ml-1 font-HarmonyOS_Medium text-xs`}>
            {`${flag}${unitConversion(Math.abs(changeText), 2)}`}
          </span>
        </>
      )
    },
  },
  {
    title: 'add_power_in_32g',
    title_tip: 'add_power_in_32g_tip',
    tip: 'add_power_in_32g_tip',
    dataIndex: 'add_power_in_32g',
    tipContent: [
      {
        title: 'gas_in_32g',
        dataIndex: 'gas_in_32g',
        render: (text: string | number) => {
          return formatFilNum(text, false, false) + '/TIB'
        },
      },
      {
        title: 'gas_in_64g',
        dataIndex: 'gas_in_64g',
        render: (text: string | number) =>
          formatFilNum(text, false, false) + '/TIB',
      },
    ],
    render: (v: any) => {
      const [show, unit] = formatFilNum(v, false, false, 4).split(' ')
      return (
        <>
          <span>{show}</span>
          <span className="unit ml-1	text-xs">{unit + '/TiB'}</span>
        </>
      )
    },
  }, //32GiB扇区新增算力成本，单位FIL/TiB
  {
    title: 'miner_initial_pledge',
    dataIndex: 'miner_initial_pledge',
    render: (v: any) => {
      const [show, unit] = formatFilNum(v, false, false, 4).split(' ')
      return (
        <>
          <span>{show}</span>
          <span className="unit ml-1 text-xs">{unit + '/TiB'}</span>
        </>
      )
    },
  }, //当前扇区质押量
  {
    title: 'fil_per_tera_24h',
    tip: 'fil_per_tera_24h_tip',
    dataIndex: 'fil_per_tera_24h',
    // 悬停明细：NV29（FIP-0118）之后区块奖励按权重拆三股——共识流（矿工实收）/服务流/销毁，
    // 此处展示近24h三流已发生额 + 各占合计的比例 + 合计（24h铸造量），并给出跳转奖励流向卡的入口。
    // 两网分支：判据是「本网是否**已激活** NV29」，而不是「是否已排期」——
    // 主网 nv29_epoch 已排到 6470279，但当前高度还没到，此时 TotalMintedReward
    // （NV29 才引入的计数器）恒 0，摆三行会显示「合计 0」。故用当前高度与激活高度比较。
    // 未激活时不摆三行 0，只给一句说明。
    // 返回数组即按 meta.tsx 既有 <ul> 渲染；占比在 render 里用合计现算，合计为 0 时不显示占比。
    tipContent: (dataSource: Record<string, any>) => {
      const nv29 = Number(dataSource?.nv29_epoch || 0)
      const height = Number(dataSource?.latest_height || 0)
      const nv29Active = nv29 > 0 && height >= nv29
      const renderAmount = (text: string | number, ds: Record<string, any>) => {
        const total = Number(ds?.reward_stream_total_24h || 0)
        const value = Number(text)
        const percent =
          total > 0 && isFinite(value) && isFinite(total)
            ? ((value / total) * 100).toFixed(1) + '%'
            : ''
        return (
          <span>
            {/* 接口按本仓惯例给 attoFIL，必须 formatFil 换算成 FIL 再格式化
                （同卡片总奖励/出块奖励字段同款写法） */}
            {formatNumber(formatFil(text, 'FIL'), 2)} FIL
            {percent ? (
              <span className="ml-2 text-xs opacity-70">{percent}</span>
            ) : null}
          </span>
        )
      }
      if (!nv29Active) {
        return [{ title: 'reward_stream_nv29_inactive' }]
      }
      return [
        {
          title: 'reward_stream_miner',
          dataIndex: 'reward_stream_miner_24h',
          render: renderAmount,
        },
        {
          title: 'reward_stream_service',
          dataIndex: 'reward_stream_service_24h',
          render: renderAmount,
        },
        {
          title: 'reward_stream_burn',
          dataIndex: 'reward_stream_burn_24h',
          render: renderAmount,
        },
        {
          title: 'reward_stream_total',
          dataIndex: 'reward_stream_total_24h',
          render: renderAmount,
        },
      ]
    },
    render: (v: any) => {
      const [show, unit] = formatFilNum(v, false, false, 4).split(' ')
      return (
        <>
          <span>{show}</span>
          <span className="unit ml-1 text-xs">{unit + '/TiB'}</span>
        </>
      )
    },
  }, //近24h产出效率，单位FIL/TiB

  {
    title: 'total_contract/24h_contract',
    dataIndex: 'total_contract',
    tip: 'total_contract/24h_contract_tip',
    tipContent: [
      { title: 'verified_contracts', dataIndex: 'verified_contracts' },
    ],
    render: (v: number | string, record: any) => {
      const changeText =
        record?.total_contract_change_in_24h &&
        Number(record.total_contract_change_in_24h)
      const className = changeText
        ? changeText < 0
          ? 'text_red'
          : 'text_green'
        : ''
      const flag = changeText ? (changeText > 0 ? '+' : '-') : ''
      return (
        <span className="flex items-baseline gap-x-1">
          {formatNumber(v, 2)}
          {changeText && (
            <span
              className={`${className} font-HarmonyOS_Medium text-xs font-medium`}
            >
              {flag}
              {changeText}
            </span>
          )}
        </span>
      )
    },
  }, //全网合约数/24h变化
  {
    title: 'contract_transaction/24h_change',
    dataIndex: 'contract_txs',
    render: (v: number | string, record: any) => {
      const changeText =
        record?.contract_txs_change_in_24h &&
        Number(record.contract_txs_change_in_24h)
      const className = changeText
        ? changeText < 0
          ? 'text_red'
          : 'text_green'
        : ''
      const flag = changeText ? (changeText > 0 ? '+' : '-') : ''
      return (
        <span className="flex items-baseline gap-x-1">
          {formatNumber(v, 2)}
          {changeText && (
            <span
              className={`${className} font-HarmonyOS_Medium text-xs font-medium`}
            >
              {flag}
              {changeText}
            </span>
          )}
        </span>
      )
    },
  }, //合约交易数/24h变化
  {
    title: 'contract_address/24h_change',
    dataIndex: 'contract_users',
    render: (v: number | string, record: any) => {
      const changeText =
        record?.contract_users_change_in_24h &&
        Number(record.contract_users_change_in_24h)
      const className = changeText
        ? changeText < 0
          ? 'text_red'
          : 'text_green'
        : ''
      const flag = changeText ? (changeText > 0 ? '+' : '-') : ''
      return (
        <span className="flex items-baseline gap-x-1">
          {formatNumber(v, 2)}
          {changeText && (
            <span
              className={`${className} font-HarmonyOS_Medium  text-xs font-medium`}
            >
              {flag} {changeText}
            </span>
          )}
        </span>
      )
    },
  }, //合约交易地址/24h变化
  {
    title: 'gas_24',
    dataIndex: 'sum',
    tipContent: [
      {
        title: 'contract_gas',
        dataIndex: 'contract_gas',
        render: (text: string | number) => formatFilNum(text, false, false, 4),
      },
    ],
    render: (v: any) => {
      const [show, unit] = formatFilNum(v, false, false, 4).split(' ')
      return (
        <>
          <span>{show}</span>
          <span className="unit ml-1	text-xs">{unit}</span>
        </>
      )
    },
  }, //近24h产出效率，单位FIL/TiB
] as const

export const meta_list = [
  {
    title: 'power_increase_24h',
    dataIndex: 'power_increase_24h',
    render: (v: number | string) => {
      if (!v) return '--'
      const [textValue, unit] = unitConversion(v, 4).split(' ')
      return (
        <span>
          <span>{textValue + ' '}</span>
          <span className="unit">{unit}</span>
        </span>
      )
    },
  }, //近24h增长算力

  //最新区块时间
  // {
  //   title: 'total_blocks',
  //   dataIndex:'total_blocks',

  //   render: (v: number | string) => formatNumber(v, 2)
  // }, //全网出块数量

  {
    title: 'total_quality_power',
    tip: 'total_quality_power_tip',
    dataIndex: 'total_quality_power',

    render: (v: number | string) => {
      if (!v) return '--'
      const [textValue, unit] = unitConversion(v, 4).split(' ')
      return (
        <span>
          <span>{textValue + ' '}</span>
          <span className="unit">{unit}</span>
        </span>
      )
    },
  }, //全网有效算力
  {
    title: 'rewards_increase_24h',
    dataIndex: 'rewards_increase_24h',

    render: (v: number | string) => {
      return (
        <span>
          <span>{formatNumber(formatFil(v, 'FIL'), 2) + ' '}</span>
          <span className="unit">{'FIL'}</span>
        </span>
      )
    },
  }, //近24h出块奖励

  {
    title: 'miner_initial_pledge',
    dataIndex: 'miner_initial_pledge',

    render: (v: string | number) => {
      return (
        <span>
          <span>{formatNumber(formatFil(v, 'FIL', 4)) + ' '}</span>
          <span className="unit">{'FIL/TiB'}</span>
        </span>
      )
    },
  }, //当前扇区质押量
  // {
  //   title: 'base_fee',
  //   dataIndex:'base_fee',

  //   render: (v: string | number) => {
  //     return formatFilNum(Number(v),false,false) //  Number(formatFil(v,'attoFIL'))+' attoFIL'
  //   }
  // }, //当前基础费率
  {
    title: 'gas_in_32g_meta',
    tip: 'gas_in_32g_tip',
    dataIndex: 'gas_in_32g',

    render: (v: number | string) => {
      let value = ''
      let unit = ''
      if (Number(v) < 0.0001) {
        value = formatFil(v, 'nanoFIL', 4)
        unit = 'nanoFIL/TiB'
      } else {
        value = formatFil(v, 'FIL', 4)
        unit = 'FIL/TiB'
      }
      return (
        <span>
          <span>{value + ' '}</span>
          <span className="unit">{unit}</span>
        </span>
      )
    },
  }, //32GiB扇区Gas消耗，单位FIL/TiB
  {
    title: 'add_power_in_32g',
    tip: 'add_power_in_32g_tip',
    dataIndex: 'add_power_in_32g',

    render: (v: number | string) => {
      return (
        <span>
          <span>{formatFil(v, 'FIL', 4) + ' '}</span>
          <span className="unit">{'FIL/TiB'}</span>
        </span>
      )
    },
  }, //32GiB扇区新增算力成本，单位FIL/TiB
  {
    title: 'fil_per_tera_24h',
    tip: 'fil_per_tera_24h_tip',
    dataIndex: 'fil_per_tera_24h',

    render: (v: string) => {
      return (
        <span>
          <span>{formatFil(v, 'FIL', 4) + ' '}</span>
          <span className="unit">{'FIL/TiB'}</span>
        </span>
      )
    },
  }, //近24h产出效率，单位FIL/TiB
  {
    title: 'total_rewards',
    dataIndex: 'total_rewards',

    render: (v: number | string) => {
      // return Number(formatFil(v,'FIL')).toLocaleString() + ' FIL'
      return (
        <span>
          <span>{Number(formatFil(v, 'FIL')).toLocaleString() + ' '}</span>
          <span className="unit">{'FIL'}</span>
        </span>
      )
    },
  }, //全网出块奖励，单位Fil
  {
    // NV29（FIP-0118）起区块奖励拆三股（矿工实收 / 服务流待提取 / 销毁）。本格只放**三股合计**这一个数
    // （= 累计铸造量，契约 A2 的 reward_stream_minted_total），与左边「全网出块奖励（矿工实收）」并列即可读出三股关系。
    // ⚠️ 硬规矩：「全网指标」是一面**数字墙**，每格只能是一个数字——严禁把块级组件（如
    // RewardAllocationBlock）塞进某一格：整块面板会在网格里铺开，把整行撑到 700px+、后续卡片被挤到很远
    // （用户 2026-10-08 指出「红框里的网页完全不应该出现在这里，这里只能是一个数字」）。
    // 三股明细的落点是首页 RewardAllocation 卡与统计页 BlockChain→区块奖励分配 卡（#reward_split）。
    // 机检：ops/check_meta_tiles.js（本墙与首页 home_meta 都不得出现大写开头的 JSX 组件标签）。
    title: 'reward_stream_alloc_title',
    tip: 'reward_stream_alloc_tip',
    dataIndex: 'reward_stream_minted_total',
    render: (v: any) => {
      // 后端老版本没有该字段时显示 '--'，不渲染成 0（沿用 34227b46 的防呆约定）
      if (v === undefined || v === null || v === '') return '--'
      return (
        <span>
          <span>{Number(formatFil(v, 'FIL')).toLocaleString() + ' '}</span>
          <span className="unit">{'FIL'}</span>
        </span>
      )
    },
  }, //区块奖励分配（三股合计＝累计铸造量；明细见首页与统计页的区块奖励分配卡）
  {
    title: 'win_count_reward',
    dataIndex: 'win_count_reward',
    // 挂上此前四语都补了却 unused 的 win_count_reward_tip（解释该指标为「近24h实收口径」，
    // 旧口径是协议固定毛值）——挂比删更能说明口径变化，故选挂上。
    tip: 'win_count_reward_tip',
    render: (v: any) => {
      return (
        <span>
          <span>{Number(formatFil(v, 'FIL', 4)).toLocaleString() + ' '}</span>
          <span className="unit">{'FIL'}</span>
        </span>
      )
    },
  }, //每赢票奖励，单位Fil

  {
    title: 'gas_in_64g_meta',
    tip: 'gas_in_64g_tip',
    dataIndex: 'gas_in_64g',
    render: (v: number | string) => {
      let value = ''
      let unit = ''
      if (Number(v) < 0.0001) {
        value = formatFil(v, 'nanoFIL', 4)
        unit = 'nanoFIL/TiB'
      } else {
        value = formatFil(v, 'FIL', 4)
        unit = 'FIL/TiB'
      }
      return (
        <span>
          <span>{value + ' '}</span>
          <span className="unit">{unit}</span>
        </span>
      )
    },
  }, //64GiB扇区Gas消耗，单位FIL/TiB
  {
    title: 'add_power_in_64g',
    tip: 'add_power_in_64g_tip',
    dataIndex: 'add_power_in_64g',

    render: (v: number | string) => {
      return (
        <span>
          <span>{formatFil(v, 'FIL', 4) + ' '}</span>
          <span className="unit">{'FIL/TiB'}</span>
        </span>
      )
    },
  }, //64GiB扇区新增算力成本，单位FIL/TiB
  {
    title: 'avg_block_count',
    tip: 'avg_block_count_tip',
    dataIndex: 'avg_block_count',

    render: (v: number | string) => formatNumber(v),
  }, //平均每高度区块数量
  {
    title: 'avg_message_count',
    dataIndex: 'avg_message_count',

    tip: 'avg_message_count_tip',

    render: (v: number | string) => formatNumber(v),
  }, //平均每高度消息数
  {
    title: 'active_miners',
    dataIndex: 'active_miners',

    render: (v: number | string) => formatNumber(v),
  }, //活跃节点数
  {
    title: 'burnt',
    dataIndex: 'burnt',

    render: (v: number | string) => {
      return (
        <span>
          <span>{formatNumber(formatFil(v, 'FIL'), 4) + ' '}</span>
          <span className="unit">{'FIL'}</span>
        </span>
      )
    },
  }, //销毁量
  {
    title: 'circulating_percent',
    dataIndex: 'circulating_percent',
    render: (v: number) => Number(v * 100).toFixed(2) + '%',
  }, //流通率
  {
    title: 'quality_power_Cc',
    dataIndex: 'Cc',
    render: (text: string | number) => {
      const [textValue, unit] = unitConversion(text, 2).split(' ')
      return (
        <span>
          <span>{textValue + ' '}</span>
          <span className="unit">{unit}</span>
        </span>
      )
    },
  },
  {
    title: 'quality_power_Dc',
    dataIndex: 'Dc',
    render: (text: string | number) => {
      const [textValue, unit] = unitConversion(text, 2).split(' ')
      return (
        <span>
          <span>{textValue + ' '}</span>
          <span className="unit">{unit}</span>
        </span>
      )
    },
  },
  {
    title: 'gas_24',
    dataIndex: 'sum',
    tipContent: [
      {
        title: 'contract_gas',
        dataIndex: 'contract_gas',
        render: (text: string | number) => formatFilNum(text, false, false, 2),
      },
    ],
    render: (v: any) => {
      const [show, unit] = formatFilNum(v, false, false, 4).split(' ')
      return (
        <>
          <span>{show}</span>
          <span className="unit ml-1	text-xs">{unit}</span>
        </>
      )
    },
  }, //近24h产出效率，单位FIL/TiB
  {
    title: 'total_contract',
    dataIndex: 'total_contract',
    tip: 'total_contract/24h_contract_tip',

    render: (v: number | string, record: any) => {
      const changeText =
        record?.total_contract_change_in_24h &&
        Number(record.total_contract_change_in_24h)
      return (
        <span className="flex items-baseline gap-x-1">
          {formatNumber(v, 2)}
          {/* {changeText && <span className={`${className} font-medium font-HarmonyOS_Medium text-xs`}>{flag}{ changeText}</span>} */}
        </span>
      )
    },
  }, //全网合约数/24h变化
  {
    title: 'total_contract_24h_contract',
    dataIndex: 'total_contract_change_in_24h',
    render: (v: number | string, record: any) => {
      const changeText =
        record?.total_contract_change_in_24h &&
        Number(record.total_contract_change_in_24h)
      const className = changeText
        ? changeText < 0
          ? 'text_red'
          : 'text_green'
        : ''
      const flag = changeText ? (changeText > 0 ? '+' : '-') : ''
      return (
        <span className="flex items-baseline gap-x-1">
          {flag}
          {Math.abs(changeText)}
          {/* {changeText && <span className={`${className} font-medium font-HarmonyOS_Medium text-xs`}>{flag}{ changeText}</span>} */}
        </span>
      )
    },
  }, //24h变化

  { title: 'verified_contracts', dataIndex: 'verified_contracts' },

  {
    title: 'contract_transaction',
    dataIndex: 'contract_txs',
    render: (v: number | string, record: any) => {
      return (
        <span className="flex items-baseline gap-x-1">
          {formatNumber(v, 2)}
          {/* {changeText && <span className={`${className} font-medium font-HarmonyOS_Medium text-xs`}>{flag}{changeText}</span>} */}
        </span>
      )
    },
  }, //合约交易数/24h变化
  {
    title: 'contract_transaction_24h_change',
    dataIndex: 'contract_txs',
    render: (v: number | string, record: any) => {
      const changeText =
        record?.contract_txs_change_in_24h &&
        Number(record.contract_txs_change_in_24h)
      const flag = changeText ? (changeText > 0 ? '+' : '-') : ''
      return (
        <span className="flex items-baseline gap-x-1">
          {changeText && (
            <span>
              {flag}
              {changeText}
            </span>
          )}
        </span>
      )
    },
  }, //合约交易数/24h变化
  {
    title: 'contract_address',
    dataIndex: 'contract_users',
    render: (v: number | string, record: any) => {
      return (
        <span className="flex items-baseline gap-x-1">
          {formatNumber(v, 2)}
        </span>
      )
    },
  }, //合约交易地址/24h变化
  {
    title: 'contract_address_24h_change',
    dataIndex: 'contract_users',
    render: (v: number | string, record: any) => {
      const changeText =
        record?.contract_users_change_in_24h &&
        Number(record.contract_users_change_in_24h)
      const flag = changeText ? (changeText > 0 ? '+' : '-') : ''
      return (
        <span className="flex items-baseline gap-x-1">
          {/* {formatNumber(v, 2)} */}
          {changeText && (
            <span>
              {flag} {changeText}
            </span>
          )}
        </span>
      )
    },
  }, //合约交易地址/24h变化
  {
    title: 'contract_balance',
    dataIndex: 'total_balance',
    render: (v: number | string, record: any) => {
      if (!v) return '--'
      return formatFilNum(v)
    },
  },
]

export const no_result = {
  title: 'search_notFound',
  warn_text: 'warn_text',
  warn_details: 'warn_details',
  go_home: 'go_home',
}
