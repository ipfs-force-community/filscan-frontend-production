/** @format */

import { getSvgIcon } from '@/svgsIcon'
import { MenuItem } from './type'
import Link from 'next/link'
import TagInput from '@/packages/tagInput'
import {
  formatDateTime,
  formatFil,
  formatFilNum,
  formatNumber,
  formatNumberPercentage,
  unitConversion,
} from '@/utils'
import ActiveRules from '@/src/account/monitor/ActiveRules'
import classNames from 'classnames'
import TextTooltip from '@/packages/textTooltip'
import PowerIcon from '@/assets/images/member/memberPower.svg'
import BalanceIcon from '@/assets/images/member/memberBalance.svg'
import SectorIcon from '@/assets/images/member/memberSector.svg'
import EmailIcon from '@/assets/images/member/email.svg'
import MsgIcon from '@/assets/images/member/msg.svg'
import PhoneIcon from '@/assets/images/member/phone.svg'
import PowerWarnIcon from '@/assets/images/member/power.svg'
import BalanceWarnIcon from '@/assets/images/member/balance.svg'
import SectorWarnIcon from '@/assets/images/member/sector.svg'
import ActivePower from '@/assets/images/member/activePower.svg'
import ActiveBalance from '@/assets/images/member/activeBalance.svg'
import ActiveSector from '@/assets/images/member/activeSector.svg'
import ActiveWarn from '@/assets/images/member/activeWarn.svg'
import Companies from '@/assets/images/member/companies.svg'
import CompaniesPro from '@/assets/images/member/companiesPro.svg'
import CompaniesV from '@/assets/images/member/companiesV.png'
import CompaniesVPro from '@/assets/images/member/companiesVPro.png'
import active1 from '@/assets/images/member/active1.png'
import active2 from '@/assets/images/member/active2.png'
import active3 from '@/assets/images/member/active3.png'
import step from '@/assets/images/step.png'
import Image from 'next/image'
import Vip from '@/assets/images/member/vip.svg'
import FreeVip from '@/assets/images/freeVip.png'
import UserIcon from '@/assets/images/user.svg'

export const userType: any = {
  NormalVIP: {
    title: 'default_user',
    bgColor: '',
    icon: <UserIcon width={20} height={20} />,
  },
  EnterpriseVIP: {
    title: 'companies',
    bgColor: 'rgba(214, 156, 98, 1)',
    icon: <Image src={CompaniesV} width={32} alt="" />,
  },
  EnterpriseProVIP: {
    title: 'companiesPro',
    bgColor: 'rgba(15, 24, 51, 1)',
    icon: <Image src={CompaniesVPro} width={32} alt="" />,
  },
}

export const vipList = ['EnterpriseVIP', 'EnterpriseProVIP']

export const account_manager: Array<MenuItem> = [
  {
    label: 'overview',
    icon: getSvgIcon('account_panel'),
    href: 'overview',
    key: 'overview',
  },
  {
    label: 'data_details',
    icon: getSvgIcon('account_overview'),
    key: 'data_details',
    children: [
      {
        label: 'power', //算力概览
        key: 'power',
      },
      {
        label: 'gas', //gas 消耗
        key: 'gas',
      },
      {
        label: 'expired', //到期扇区
        key: 'expired',
      },
      {
        label: 'reward', //出块奖励
        key: 'reward',
      },
      {
        label: 'lucky', //幸运值
        key: 'lucky',
      },
      {
        label: 'balance', //地址余额
        key: 'balance',
      },
    ],
  },
  {
    label: 'monitor',
    icon: getSvgIcon('monitor'),
    href: 'monitorBalance',
    key: 'monitor',
    sufIcon: <Vip width={16} />,
    vip: true,
    children: [
      {
        label: 'monitorBalance', //余额监控
        key: 'monitorBalance',
      },
      {
        label: 'monitorSector', //gas 消耗
        key: 'monitorSector',
      },
      {
        label: 'monitorPower', //gas 消耗
        key: 'monitorPower',
      },
    ],
  },
  {
    label: 'miners',
    icon: getSvgIcon('account_miners'),
    key: 'miners',
    href: 'miners',
  },
  {
    label: 'active',
    href: 'active',
    sufIcon: <Image src={FreeVip} alt="" height={13} />,
    icon: getSvgIcon('member_active'),
    key: 'active',
  },
  {
    label: 'personal',
    icon: getSvgIcon('account_personal'),
    key: 'personal',
    href: 'personal',
  },
  {
    label: 'logout',
    href: 'logout',
    // titleIcon:'',
    icon: getSvgIcon('account_logout'),
    key: 'logout',
  },
]

export const personal_setting = [
  // {
  //   title: 'personal_name',
  //   dataIndex: 'name',
  //   placeholder: 'personal_name_holder',
  // },
  {
    title: 'old_password',
    placeholder: 'old_placeholder',
    dataIndex: 'old_password',
    rules: [{ required: true, message: 'old_placeholder is required' }],
  },
  {
    title: 'new_password',
    placeholder: 'new_placeholder',
    dataIndex: 'new_password',
    rules: [{ required: true, message: '${new_password} is required' }],
  },
  {
    title: 'confirm_password',
    dataIndex: 'confirm_password',
    placeholder: 'confirm_password',
    rules: [{ required: true, message: '${confirm_password} is required' }],
  },
]

export const overview = {
  headerList: [
    [
      {
        title: 'quality_power_24',
        icon: 'power', // <Image src={power} width={40} height={40} alt='' />,
        dataIndex: 'sum_quality_adj_power',
        render: (text: any, record: any, tr: any) => {
          const changeText = record?.sum_power_change_24h
            ? Number(record.sum_power_change_24h)
            : ''
          const flag = changeText ? (changeText > 0 ? '+' : '') : ''
          const className = changeText
            ? changeText > 0
              ? 'text_green'
              : 'text_red'
            : ''
          const [textValue, unit] = unitConversion(text, 2).split(' ')
          return (
            <div className="flex h-full w-full flex-col justify-between">
              <span className="flex flex-col">
                <span className="text_des text-sm">
                  {tr('quality_power_24')}
                </span>
                <span className={className}>
                  {changeText ? flag + unitConversion(changeText, 2) : '--'}
                </span>
              </span>
              <span className="text_clip flex items-baseline gap-x-1 font-HarmonyOS_Bold text-xl font-semibold">
                {textValue}
                <span className="text_color text-sm">{unit}</span>
              </span>
            </div>
          )
        },
      },
      {
        title: 'total_reward_24',
        icon: 'reward', //<Image src={reward} width={40} height={40} alt='' />,
        dataIndex: 'sum_reward_change_24h',
        render: (text: any, record: any, tr: any) => {
          // const changeText = record?.sum_reward_change_24h
          //   ? Number(record.sum_reward_change_24h)
          //   : '';
          // const flag = changeText ? (changeText > 0 ? '+' : '-') : '';
          // const className = changeText
          //   ? changeText > 0
          //     ? 'text_green'
          //     : 'text_red'
          //   : '';
          const [textValue, unit] = formatFil(text, 'FIL', 4, true).split(' ')
          return (
            <div className="flex h-full w-full flex-col justify-between">
              <span className="flex flex-col">
                <span className="text_des text-sm">
                  {tr('total_reward_24')}
                </span>
                {/* <span className={className}>
                  {flag}
                  {changeText?formatFilNum(Math.abs(Number(changeText)), false, false, 2) : '--'}
                </span> */}
              </span>
              <span className="text_clip flex items-baseline gap-x-1 font-HarmonyOS_Bold text-xl font-semibold">
                {/* {flag}
                {changeText?formatFilNum(Math.abs(Number(changeText)), false, false, 2) : '--'} */}
                {textValue}
                <span className="text-sm">{unit}</span>
              </span>
            </div>
          )
        },
      },
    ],
    [
      {
        title: 'total_out_come_gas',
        icon: 'gas', //<Image src={gas} width={40} height={40} alt='' />,
        dataIndex: 'sum_outlay',
        render: (text: any, record: any, tr: any) => {
          const changeText = record?.sum_gas ? Number(record.sum_gas) : ''
          const flag = changeText ? (changeText > 0 ? '+' : '-') : ''
          const className = changeText
            ? changeText > 0
              ? 'text_green'
              : 'text_red'
            : 'text_des_unit'
          const [textValue, unit] = formatFil(text, 'FIL', 4, true).split(' ')
          return (
            <div className="flex h-full w-full flex-col justify-between">
              <span className="flex flex-col">
                <span className="text_des text-sm">
                  {tr('total_out_come_gas')}
                </span>
                <span className={className}>
                  {flag}
                  {changeText
                    ? formatFil(Math.abs(Number(changeText)), 'FIL', 4, true)
                    : '--'}
                </span>
              </span>
              <span className="text_clip flex items-baseline gap-x-1 font-HarmonyOS_Bold text-xl font-semibold">
                {textValue}
                <span className="text-sm">{unit}</span>
              </span>
            </div>
          )
        },
      },
      {
        title: 'pledge_amount_24',
        icon: 'pledge', //<Image src={pledge} width={40} height={40} alt='' />,
        dataIndex: 'sum_pledge',
        render: (text: any, record: any, tr: any) => {
          const changeText = record?.sum_pledge_change_24h
            ? Number(record.sum_pledge_change_24h)
            : ''
          const flag = changeText ? (changeText > 0 ? '+' : '-') : ''
          const className = changeText
            ? changeText > 0
              ? 'text_green'
              : 'text_red'
            : ''
          const [textValue, unit] = formatFil(text, 'FIL', 4, true).split(' ')
          return (
            <div className="flex h-full w-full flex-col justify-between">
              <span className="flex flex-col">
                <span className="text_des text-sm">
                  {tr('pledge_amount_24')}
                </span>
                <span className={className}>
                  {flag}
                  {changeText
                    ? formatFil(Math.abs(Number(changeText)), 'FIL', 2, true)
                    : '--'}
                </span>
              </span>
              <span className="text_clip flex items-baseline gap-x-1 font-HarmonyOS_Bold text-xl font-semibold">
                {textValue}
                <span className="text-sm">{unit}</span>
              </span>
            </div>
          )
        },
      },
      {
        title: 'balance_24',
        icon: 'balance', //<Image src={balance} width={40} height={40} alt='' />,
        dataIndex: 'sum_balance',
        render: (text: any, record: any, tr: any) => {
          const changeText = record?.sum_balance_change_24h
            ? Number(record.sum_balance_change_24h)
            : ''
          const flag = changeText ? (changeText > 0 ? '+' : '-') : ''
          const className = changeText
            ? changeText > 0
              ? 'text_green'
              : 'text_red'
            : ''
          const [textValue, unit] = formatFil(text, 'FIL', 4, true).split(' ')
          return (
            <div className="flex h-full w-full flex-col justify-between">
              <span className="flex flex-col">
                <span className="text_des text-sm">{tr('balance_24')}</span>
                <span className={className}>
                  {flag}
                  {changeText
                    ? formatFil(Math.abs(Number(changeText)), 'FIL', 2, true)
                    : '--'}
                </span>
              </span>
              <span className="text_clip flex items-baseline gap-x-1 font-HarmonyOS_Bold text-xl font-semibold">
                {textValue}
                <span className="text-sm">{unit}</span>
              </span>
            </div>
          )
        },
      },
    ],
  ],
  columns: (tr: any) => [
    // {
    //   title: 'tag',
    //   dataIndex: 'tag',
    //   fixed: 'left',
    //   width: 100,
    //   ellipsis: {
    //     showTitle: false,
    //   },
    //   render: (text: string, record: any) => {
    //     return <TagInput text={text} isEdit={false} record={record} />;
    //   },
    // },
    {
      title: 'group_name',
      dataIndex: 'group_name',
      width: 100,
      fixed: 'left',
      ellipsis: {
        showTitle: false,
      },
      render: (text: string, record: any) => {
        const showText = record.is_default ? tr('default_group') : text
        return <div className="w-fit rounded-[5px]  p-2 ">{showText}</div>
      },
    },
    {
      title: 'miner_id',
      dataIndex: 'miner_id',
      width: 150,
      fixed: 'left',
      render: (text: string, record: any) => {
        return (
          <div className="flex items-center">
            <Link href={`/miner/${text}`} className="link_text">
              {text}
            </Link>
            {record?.tag && (
              <span className="w-fit max-w-[60px] rounded-[5px] bg-bg_hover px-2 py-1 text-xs  text-primary">
                <TextTooltip text={record?.tag} className="whitespace-nowrap" />
              </span>
            )}
          </div>
        )
      },
    },

    {
      title: 'quality_power',
      dataIndex: 'total_quality_adj_power',
      render: (text: string, record: any) => unitConversion(text, 2),
    },
    {
      title: 'raw_power',
      dataIndex: 'total_raw_byte_power',
      render: (text: string, record: any) => unitConversion(text, 2),
    },
    {
      title: 'total_reward_24',
      dataIndex: 'reward_change_24h',
      //  exports: ['reward_change_24h'],
      amountUnit: {
        reward_change_24h: { unit: 'fil' },
      },
      render: (text: string) => renderFil(text),
      // render: (text: string, record: any) => {
      //   const changeText = Number(record?.reward_change_24h)
      //     ? Number(record.reward_change_24h)
      //     :'';
      //   const flag = changeText ? (changeText > 0 ? '+' : '-') : '';
      //   const className = changeText
      //     ? changeText > 0
      //       ? 'text_green'
      //       : 'text_red'
      //     : '';
      //   return renderFil(text, changeText, flag, className)

      // },
    },
    {
      title: 'total_out_come_gas',
      dataIndex: 'total_outlay',
      exports: ['total_gas'],
      amountUnit: {
        total_outlay: { unit: 'fil', number: 2 },
        total_gas: { unit: 'fil', number: 2 },
      },
      render: (text: string, record: any) => {
        const changeText = record?.total_gas ? Number(record.total_gas) : ''
        const flag = changeText ? (changeText > 0 ? '+' : '-') : ''
        const className = changeText
          ? changeText > 0
            ? 'text_green'
            : 'text_red'
          : ''
        return renderFil(text, changeText, flag, className)
      },
    },
    {
      title: 'pledge_amount_24',
      dataIndex: 'total_pledge_amount',
      exports: ['pledge_change_24h'],
      amountUnit: {
        pledge_change_24h: { unit: 'fil', number: 2 },
        total_pledge_amount: { unit: 'fil', number: 2 },
      },
      render: (text: string, record: any) => {
        const changeText = record?.pledge_change_24h
          ? Number(record.pledge_change_24h)
          : ''
        const flag = changeText ? (changeText > 0 ? '+' : '-') : ''
        const className = changeText
          ? changeText > 0
            ? 'text_green'
            : 'text_red'
          : ''
        return renderFil(text, changeText, flag, className)
      },
    },
    {
      title: 'balance_24',
      dataIndex: 'total_balance',
      exports: ['balance_change_24h'],
      amountUnit: {
        balance_change_24h: { unit: 'fil', number: 2 },
        total_balance: { unit: 'fil', number: 2 },
      },
      render: (text: string, record: any) => {
        const changeText = record?.balance_change_24h
          ? Number(record.balance_change_24h)
          : ''
        const flag = changeText ? (changeText > 0 ? '+' : '-') : ''
        const className = changeText
          ? changeText > 0
            ? 'text_green'
            : 'text_red'
          : ''
        return renderFil(text, changeText, flag, className)
      },
    },
  ],
}

export const account_lucky = {
  columns: (tr: any) => [
    {
      title: 'group_name',
      dataIndex: 'group_name',
      width: 100,
      ellipsis: {
        showTitle: false,
      },
      fixed: 'left',
      render: (text: string, record: any) => {
        const showText = record.is_default ? tr('default_group') : text
        return (
          <div className="text_color text_color w-fit rounded-[5px] p-2 font-normal">
            {showText}
          </div>
        )
      },
    },
    {
      title: 'miner_id',
      dataIndex: 'miner_id',
      width: 100,
      fixed: 'left',
      render: (text: string, record: any) => {
        return (
          <>
            <div className="flex items-center gap-x-[1px]">
              <Link href={`/miner/${text}`} className="link_text">
                {text}
              </Link>
              {record?.tag && (
                <span className="w-fit max-w-[60px] rounded-[5px] bg-bg_hover px-2 py-1 text-xs  text-primary">
                  <TextTooltip
                    text={record?.tag}
                    className="whitespace-nowrap"
                  />
                </span>
              )}
            </div>
          </>
        )
      },
    },
    {
      title: '24h_lucky',
      dataIndex: 'lucky_rate_24h',
      width: '15%',
      amountUnit: {
        lucky_rate_24h: { unit: '%', number: 2 },
      },
      render: (text: string | number) =>
        text ? formatNumberPercentage(text) + '%' : text,
    },
    {
      title: '7d_lucky',
      dataIndex: 'lucky_rate_7d',
      width: '15%',
      amountUnit: {
        lucky_rate_7d: { unit: '%', number: 2 },
      },
      render: (text: string | number) =>
        text ? formatNumberPercentage(text) + '%' : text,
    },
    {
      title: '30d_lucky',
      dataIndex: 'lucky_rate_30d',
      amountUnit: {
        lucky_rate_30d: { unit: '%', number: 2 },
      },
      width: '15%',
      render: (text: string | number) =>
        text ? formatNumberPercentage(text) + '%' : text,
    },
  ],
}

export const account_balance = {
  columns: (tr: any) => [
    // {
    //   title: 'tag',
    //   dataIndex: 'tag',
    //   fixed: 'left',
    //   width: 100,
    //   ellipsis: {
    //     showTitle: false,
    //   },
    //   render: (text: string, record: any) => {
    //     return <TagInput isEdit={false} text={text} record={record} />
    //   },
    // },
    {
      title: 'miner_id',
      dataIndex: 'miner_id',
      width: 100,
      fixed: 'left',
      render: (text: string, record: any) => (
        <div className="flex items-center gap-x-[1px]">
          <Link href={`/miner/${text}`} className="link_text">
            {text}
          </Link>
          {record?.tag && (
            <span className="w-fit max-w-[60px] rounded-[5px] bg-bg_hover px-2 py-1 text-xs  text-primary">
              <TextTooltip text={record?.tag} className="whitespace-nowrap" />
            </span>
          )}
        </div>
      ),
    },
    {
      title: 'group_name',
      dataIndex: 'group_name',
      width: 100,
      fixed: 'left',
      ellipsis: {
        showTitle: false,
      },
      render: (text: string, record: any) => {
        const showText = record.is_default ? tr('default_group') : text
        return (
          <div className="text_color w-fit p-2 font-normal text-mobile_font">
            {showText}
          </div>
        )
      },
    },
    {
      title: 'miner_balance',
      dataIndex: 'miner_balance',
      exports: ['miner_balance_changed'],
      amountUnit: {
        miner_balance_changed: { unit: 'fil', number: 2 },
        miner_balance: { unit: 'fil', number: 0 },
      },

      //width: 170,
      render: (text: string, record: any) => {
        const changeText = record?.miner_balance_changed
          ? Number(record.miner_balance_changed)
          : ''
        const flag = changeText ? (changeText > 0 ? '+' : '-') : ''
        const className = changeText
          ? changeText > 0
            ? 'text_green'
            : 'text_red'
          : ''
        return renderFil(text, changeText, flag, className)
        //   (
        //   <span className='flex flex-col'>
        //     <span>{formatFilNum(text, false, false, 2)}</span>
        //     <span className={`${className}`}>
        //       {flag +
        //         formatFilNum(Math.abs(Number(changeText)), false, false, 2)}
        //     </span>
        //   </span>
        // );
      },
    },
    {
      title: 'owner_balance',
      dataIndex: 'owner_balance',
      exports: ['Owner_balance_changed'],
      amountUnit: {
        owner_balance: { unit: 'fil', number: 0 },
        Owner_balance_changed: { unit: 'fil', number: 0 },
      },

      render: (text: string, record: any) => {
        const changeText = record?.Owner_balance_changed
          ? Number(record.Owner_balance_changed)
          : ''
        const flag = changeText ? (changeText > 0 ? '+' : '-') : ''
        const className = changeText
          ? changeText > 0
            ? 'text_green'
            : 'text_red'
          : ''
        return renderFil(text, changeText, flag, className)
      },
    },
    {
      title: 'worker_balance',
      dataIndex: 'worker_balance',
      //width: 170,
      exports: ['Worker_balance_changed'],

      amountUnit: {
        worker_balance: { unit: 'fil' },
        Worker_balance_changed: { unit: 'fil' },
      },
      render: (text: string, record: any) => {
        const changeText = record?.Worker_balance_changed
          ? Number(record.Worker_balance_changed)
          : ''
        const flag = changeText ? (changeText > 0 ? '+' : '-') : ''
        const className = changeText
          ? changeText > 0
            ? 'text_green'
            : 'text_red'
          : ''
        return renderFil(text, changeText, flag, className)
      },
    },
    {
      title: 'controller_0_balance',
      dataIndex: 'controller_0_balance',
      // width: 200,
      exports: ['Controller_0_balance_changed'],
      amountUnit: {
        controller_0_balance: { unit: 'fil' },
        Controller_0_balance_changed: { unit: 'fil' },
      },
      render: (text: string, record: any) => {
        const changeText = record?.Controller_0_balance_changed
          ? Number(record.Controller_0_balance_changed)
          : ''
        const flag = changeText ? (changeText > 0 ? '+' : '-') : ''
        const className = changeText
          ? changeText > 0
            ? 'text_green'
            : 'text_red'
          : ''
        return renderFil(text, changeText, flag, className)
      },
    },
    {
      title: 'controller_1_balance',
      dataIndex: 'controller_1_balance',
      // width: 200,
      exports: ['controller_1_balance_changed'],

      amountUnit: {
        controller_1_balance: { unit: 'fil' },
        controller_1_balance_changed: { unit: 'fil' },
      },
      render: (text: string, record: any) => {
        const changeText = record?.controller_1_balance_changed
          ? Number(record.controller_1_balance_changed)
          : ''
        const flag = changeText ? (changeText > 0 ? '+' : '-') : ''
        const className = changeText
          ? changeText > 0
            ? 'text_green'
            : 'text_red'
          : ''
        return renderFil(text, changeText, flag, className)
      },
    },
    {
      title: 'controller_2_balance',
      dataIndex: 'controller_2_balance',
      // width: 200,
      exports: ['controller_2_balance_changed'],
      amountUnit: {
        controller_2_balance: { unit: 'fil' },
        controller_2_balance_changed: { unit: 'fil' },
      },
      render: (text: string, record: any) => {
        const changeText = record?.controller_2_balance_changed
          ? Number(record.controller_2_balance_changed)
          : ''
        const flag = changeText ? (changeText > 0 ? '+' : '-') : ''
        const className = changeText
          ? changeText > 0
            ? 'text_green'
            : 'text_red'
          : ''
        return renderFil(text, changeText, flag, className)
      },
    },
    {
      title: 'beneficiary_balance',
      dataIndex: 'beneficiary_balance',
      // width: 200,
      exports: ['beneficiary_balance_changed'],
      amountUnit: {
        beneficiary_balance: { unit: 'fil' },
        beneficiary_balance_changed: { unit: 'fil' },
      },
      render: (text: string, record: any) => {
        const changeText = record?.beneficiary_balance_changed
          ? Number(record.beneficiary_balance_changed)
          : ''
        const flag = changeText ? (changeText > 0 ? '+' : '-') : ''
        const className = changeText
          ? changeText > 0
            ? 'text_green'
            : 'text_red'
          : ''
        return renderFil(text, changeText, flag, className)
      },
    },
    {
      title: 'market_balance',
      dataIndex: 'market_balance',
      // width: 200,
      exports: ['market_balance_changed'],
      amountUnit: {
        market_balance: { unit: 'fil' },
        market_balance_changed: { unit: 'fil' },
      },
      render: (text: string, record: any) => {
        const changeText = record?.market_balance_changed
          ? Number(record.market_balance_changed)
          : ''
        const flag = changeText ? (changeText > 0 ? '+' : '-') : ''
        const className = changeText
          ? changeText > 0
            ? 'text_green'
            : 'text_red'
          : ''
        return renderFil(text, changeText, flag, className)
      },
    },
  ],
}
export const account_reward = {
  columns: (tr: any, type?: string) => {
    let arr: Array<any> = [
      {
        title: 'group_name',
        dataIndex: 'group_name',
        width: 100,
        ellipsis: {
          showTitle: false,
        },
        fixed: 'left',
        render: (text: string, record: any) => {
          const showText = record.is_default ? tr('default_group') : text
          return (
            <div className="text_color w-fit p-2 font-normal text-mobile_font">
              {showText}
            </div>
          )
        },
      },
      {
        title: 'miner_id',
        dataIndex: 'miner_id',
        width: 100,
        fixed: 'left',
        render: (text: string, record: any) => {
          return (
            <>
              <div className="flex items-center gap-x-[1px]">
                <Link
                  href={`/account#reward?miner=${text}`}
                  className="link_text"
                >
                  {text}
                </Link>
                {record?.tag && (
                  <span className="w-fit max-w-[60px] rounded-[5px] bg-bg_hover px-2 py-1 text-xs  text-primary">
                    <TextTooltip
                      text={record?.tag}
                      className="whitespace-nowrap"
                    />
                  </span>
                )}
              </div>
            </>
          )
        },
      },
      { title: 'block_count', dataIndex: 'block_count', width: '20%' },
      { title: 'win_count', dataIndex: 'win_count', width: '20%' },
      {
        title: 'block_reward',
        dataIndex: 'block_reward',
        width: '20%',
        amountUnit: {
          block_reward: { unit: 'fil', number: 4 },
        },
        render: (text: string) => formatFilNum(text),
      },
      // {
      //   title: 'total_reward', dataIndex: 'total_reward', width: '15%',
      //   amountUnit: {
      //     total_reward: { unit: 'fil', number: 4 }
      //   },
      //   render: (text: string) => renderFil(text)
      // },
    ]
    if (type && type === 'detail') {
      arr.unshift({
        title: 'date',
        dataIndex: 'date',
        fixed: 'left',
        width: '15%',
        render: (text: string) => {
          if (text === 'All') {
            return text
          }
          return formatDateTime(text, 'YYYY-MM-DD')
        },
      })
      arr[1].width = '15%'
      arr[2].width = '10%'
      arr[2].render = (text: string) => (
        <Link href={`/miner/${text}`} className="link_text">
          {text}
        </Link>
      )
    }
    return arr
  },
}

export const account_reward_mobile = {
  columns: (tr: any, type?: string) => {
    return {
      group_name: {
        width: 'unset',
        fixed: false,
        render: (text: string, record: any) => {
          const showText = record.is_default ? tr('default_group') : text
          return (
            <div className="w-fit p-2 font-normal text-mobile_font">
              {showText}
            </div>
          )
        },
      },
      miner_id: {
        width: 'unset',
        fixed: false,
        render: (text: string, record: any) => {
          return (
            <>
              <div className="flex items-center gap-x-[1px]">
                <Link
                  href={`/account#reward?miner=${text}`}
                  className="link_text"
                >
                  {text}
                </Link>
                {record?.tag && (
                  <span className="w-fit max-w-[60px] rounded-[5px] bg-bg_hover px-2 py-1 text-xs  text-primary">
                    <TextTooltip
                      text={record?.tag}
                      className="whitespace-nowrap"
                    />
                  </span>
                )}
              </div>
            </>
          )
        },
      },
      block_count: {
        width: 'unset',
        fixed: false,
      },
      win_count: {
        width: 'unset',
        fixed: false,
      },
      block_reward: {
        width: 'unset',
        fixed: false,
      },
      date: {
        width: 'unset',
        fixed: false,
      },
    }
  },
}
export const account_power = {
  columns: (tr: any, type?: string) => {
    let arr: Array<any> = [
      {
        title: 'group_name',
        dataIndex: 'group_name',
        width: 100,
        ellipsis: {
          showTitle: false,
        },
        fixed: 'left',
        render: (text: string, record: any) => {
          const showText = record.is_default ? tr('default_group') : text
          return (
            <div className="text_color w-fit p-2 font-normal text-mobile_font">
              {showText}
            </div>
          )
        },
      },
      {
        title: 'miner_id',
        dataIndex: 'miner_id',
        width: 100,
        fixed: 'left',
        render: (text: string, record: any) => {
          return (
            <>
              <div className="flex items-center gap-x-[1px]">
                <Link
                  href={`/account#power?miner=${text}`}
                  className="link_text"
                >
                  {text}
                </Link>
                {record?.tag && (
                  <span className="w-fit max-w-[60px] rounded-[5px] bg-bg_hover px-2 py-1 text-xs  text-primary">
                    <TextTooltip
                      text={record?.tag}
                      className="whitespace-nowrap"
                    />
                  </span>
                )}
              </div>
            </>
          )
        },
      },

      {
        title: 'quality_power',
        dataIndex: 'quality_power',
        amountUnit: {
          quality_power: { unit: 'power', number: 2 },
        },
        //width: 150,
        render: (text: string, record: any) => unitConversion(text, 2),
      },
      {
        title: 'raw_power',
        dataIndex: 'raw_power',
        /// width: 100,
        amountUnit: {
          raw_power: { unit: 'power', number: 2 },
        },
        render: (text: string, record: any) => unitConversion(text, 2),
      },
      {
        title: 'full_multiplier_power',
        dataIndex: 'full_multiplier_power',
        //  width: 100,
        amountUnit: {
          full_multiplier_power: { unit: 'power', number: 2 },
        },
        render: (text: string, record: any) => unitConversion(text, 2),
      },
      {
        title: 'pending_upgrade_power',
        dataIndex: 'pending_upgrade_power',
        //// width: 200,
        amountUnit: {
          pending_upgrade_power: { unit: 'power', number: 2 },
        },
        render: (text: string, record: any) => unitConversion(text, 2),
      },
      {
        title: 'sector_size',
        dataIndex: 'sector_size',
        //// width: 200,
        render: (text: string, record: any) => unitConversion(text, 2),
      },
      {
        title: 'sector_power_change',
        dataIndex: 'sector_count_change',
        exports: ['sector_power_change'],
        titleTip: 'sector_power_change_tip',
        amountUnit: {
          sector_power_change: { unit: 'power', number: 2 },
        },
        //width: 200,
        render: (text: any, record: any) => {
          const flag = text ? (Number(text) > 0 ? '+' : '-') : ''
          const className = Number(text)
            ? Number(text) > 0
              ? 'text_green'
              : 'text_red'
            : ''
          return (
            <span>
              <span className={className}>
                {flag}
                {formatNumber(Math.abs(text))}
              </span>
              <span>/{unitConversion(record?.sector_power_change, 2)}</span>
            </span>
          )
        },
      },

      {
        title: 'pledge_changed',
        dataIndex: 'pledge_changed',
        titleTip: 'pledge_changed_tip',
        //width: 200,
        amountUnit: {
          pledge_changed: { unit: 'fil' },
        },
        render: (text: string, record: any) => renderFil(text),
      },
      {
        title: 'pledge_changed_per_t',
        dataIndex: 'pledge_changed_per_t',
        titleTip: 'pledge_changed_per_t_tip',

        //width: 200,
        amountUnit: {
          pledge_changed_per_t: { unit: 'fil/T' },
        },
        render: (text: string, record: any) => {
          return renderFil(text, undefined, undefined, undefined, 'FIL/T')
        },
      },
      {
        title: 'penalty',
        dataIndex: 'penalty',
        titleTip: 'penalty_tip',

        //// width: 200,
        amountUnit: {
          penalty: { unit: 'fil' },
        },
        render: (text: string, record: any) => renderFil(text),
      },
      {
        title: 'fault_sectors',
        dataIndex: 'fault_sectors',
        titleTip: 'fault_sectors_tip',
        //width: 200,
        render: (text: string, record: any) => (
          <span className={Number(text) ? '' : 'text_des_unit'}>
            {formatNumber(text)}
          </span>
        ),
      },
    ]
    if (type && type === 'detail') {
      arr.unshift({
        title: 'date',
        dataIndex: 'date',
        fixed: 'left',
        render: (text: string) => formatDateTime(text, 'YYYY-MM-DD'),
      })
      arr[2].render = (text: string) => (
        <Link href={`/miner/${text}`} className="link_text">
          {text}
        </Link>
      )
    }
    return arr
  },
}

export const account_power_mobile = {
  columns: (tr: any) => {
    return {
      group_name: {
        width: 'unset',
        fixed: false,
        render: (text: string, record: any) => {
          const showText = record.is_default ? tr('default_group') : text
          return (
            <div className="w-fit p-2 font-normal text-mobile_font">
              {showText}
            </div>
          )
        },
      },
      miner_id: {
        width: 'unset',
        fixed: false,
        render: (text: string, record: any) => {
          return (
            <>
              <div className="flex items-center gap-x-[1px]">
                <Link
                  href={`/account#power?miner=${text}`}
                  className="link_text"
                >
                  {text}
                </Link>
                {record?.tag && (
                  <span className="w-fit max-w-[60px] rounded-[5px] bg-bg_hover px-2 py-1 text-xs  text-primary">
                    <TextTooltip
                      text={record?.tag}
                      className="whitespace-nowrap"
                    />
                  </span>
                )}
              </div>
            </>
          )
        },
      },

      quality_power: {
        width: 'unset',
        fixed: false,
      },
      raw_power: {
        width: 'unset',
        fixed: false,
      },
      full_multiplier_power: {
        width: 'unset',
        fixed: false,
      },
      pending_upgrade_power: {
        width: 'unset',
        fixed: false,
      },
      sector_size: {
        width: 'unset',
        fixed: false,
      },
      pledge_changed: {
        width: 'unset',
        fixed: false,
      },
      pledge_changed_per_t: {
        width: 'unset',
        fixed: false,
      },
      penalty: {
        width: 'unset',
        fixed: false,
        render: (text: string, record: any) => {
          return (
            <div className="box-border flex flex-shrink-0">
              {renderFil(text)}
            </div>
          )
        },
      },
      fault_sectors: {
        fixed: false,
        render: (text: string, record: any) => (
          <span className={classNames(Number(text) ? '' : 'text_des_unit')}>
            {formatNumber(text)}
          </span>
        ),
      },
      date: {
        width: 'unset',
        fixed: false,
      },
    }
  },
}

export const account_gas = {
  columns: (tr: any, type?: string) => {
    let arr: Array<any> = [
      {
        title: 'group_name',
        dataIndex: 'group_name',
        width: 100,
        fixed: 'left',
        ellipsis: {
          showTitle: false,
        },
        render: (text: string, record: any) => {
          const showText = record.is_default ? tr('default_group') : text
          return (
            <div className="text_color w-fit rounded-[5px] p-2 font-normal">
              {showText}
            </div>
          )
        },
      },
      {
        title: 'miner_id',
        dataIndex: 'miner_id',
        width: 100,
        fixed: 'left',
        render: (text: string, record: any) => {
          return (
            <>
              <div className="flex items-center gap-x-[1px]">
                <Link href={`/account#gas?miner=${text}`} className="link_text">
                  {text}
                </Link>
                {record?.tag && (
                  <span className="w-fit max-w-[60px] rounded-[5px] bg-bg_hover px-2 py-1 text-xs  text-primary">
                    <TextTooltip
                      text={record?.tag}
                      className="whitespace-nowrap"
                    />
                  </span>
                )}
              </div>
            </>
          )
        },
      },
      {
        title: 'sector_power_change',
        dataIndex: 'sector_count_change',
        titleTip: 'sector_power_change_tip',
        exports: ['sector_power_change'],
        amountUnit: {
          sector_power_change: { unit: 'power', number: 2 },
        },
        render: (text: any, record: any) => {
          const flag = text ? (Number(text) > 0 ? '+' : '-') : ''
          const className = Number(text)
            ? Number(text) > 0
              ? 'text_green'
              : 'text_red'
            : ''
          return (
            <span>
              <span className={className}>
                {flag}
                {formatNumber(Math.abs(text))}
              </span>
              <span>/{unitConversion(record?.sector_power_change, 2)}</span>
            </span>
          )
        },
      },
      {
        title: 'total_gas_cost',
        dataIndex: 'total_gas_cost',
        titleTip: 'total_gas_cost_tip',

        // width: 200,
        amountUnit: {
          total_gas_cost: { unit: 'fil' },
        },
        render: (text: any) => renderFil(text),
      },
      {
        title: 'seal_gas_cost',
        dataIndex: 'seal_gas_cost',
        titleTip: 'seal_gas_cost_tip',
        // width: 200,
        amountUnit: {
          total_gas_cost: { unit: 'fil' },
        },
        render: (text: any) =>
          renderFil(text, undefined, undefined, undefined, 'FIL'),
      },
      {
        title: 'seal_gas_per_t',
        dataIndex: 'seal_gas_per_t',
        titleTip: 'seal_gas_per_t_tip',
        // width: 200,
        amountUnit: {
          total_gas_cost: { unit: 'fil/T' },
        },
        render: (text: any) =>
          renderFil(text, undefined, undefined, undefined, 'FIL/T'),
      },
      {
        title: 'deal_gas_cost',
        dataIndex: 'deal_gas_cost',
        titleTip: 'deal_gas_cost_tip',

        // width: 200,
        amountUnit: {
          deal_gas_cost: { unit: 'fil' },
        },
        render: (text: any) => renderFil(text),
      },
      {
        title: 'wd_post_gas_cost',
        titleTip: 'wd_post_gas_cost_tip',
        dataIndex: 'wd_post_gas_cost',
        // width: 200,
        amountUnit: {
          wd_post_gas_cost: { unit: 'fil' },
        },
        render: (text: any) => renderFil(text),
      },
      {
        title: 'wd_post_gas_per_t',
        dataIndex: 'wd_post_gas_per_t',
        titleTip: 'wd_post_gas_per_t_tip',
        // width: 200,
        amountUnit: {
          wd_post_gas_per_t: { unit: 'fil/T' },
        },
        render: (text: any) =>
          renderFil(text, undefined, undefined, undefined, 'FIL/T'),
      },
    ]
    if (type && type === 'detail') {
      arr.unshift({
        title: 'date',
        dataIndex: 'date',
        fixed: 'left',
        // width: 200,
        render: (text: string) => {
          if (text === 'All') {
            return text
          }
          return formatDateTime(text, 'YYYY-MM-DD')
        },
      })
      arr[2].render = (text: string) => (
        <Link href={`/miner/${text}`} className="link_text">
          {text}
        </Link>
      )
    }
    return arr
  },
}

export const account_gas_mobile = {
  columns: (tr: any) => {
    return {
      group_name: {
        width: 'unset',
        fixed: false,
        render: (text: string, record: any) => {
          const showText = record.is_default ? tr('default_group') : text
          return (
            <div className="w-fit p-2 font-normal text-mobile_font">
              {showText}
            </div>
          )
        },
      },
      miner_id: {
        width: 'unset',
        fixed: false,
        render: (text: string, record: any) => {
          return (
            <>
              <div className="flex items-center gap-x-[1px]">
                <Link
                  href={`/account#power?miner=${text}`}
                  className="link_text"
                >
                  {text}
                </Link>
                {record?.tag && (
                  <span className="w-fit max-w-[60px] rounded-[5px] bg-bg_hover px-2 py-1 text-xs  text-primary">
                    <TextTooltip
                      text={record?.tag}
                      className="whitespace-nowrap"
                    />
                  </span>
                )}
              </div>
            </>
          )
        },
      },

      sector_count_change: {
        width: 'unset',
        fixed: false,
      },
      total_gas_cost: {
        width: 'unset',
        fixed: false,
      },
      seal_gas_cost: {
        width: 'unset',
        fixed: false,
      },
      seal_gas_per_t: {
        width: 'unset',
        fixed: false,
      },
      deal_gas_cost: {
        width: 'unset',
        fixed: false,
      },
      wd_post_gas_cost_tip: {
        width: 'unset',
        fixed: false,
      },
      wd_post_gas_per_t: {
        width: 'unset',
        fixed: false,
      },
      date: {
        width: 'unset',
        fixed: false,
      },
    }
  },
}

export const account_expired = {
  headerList: [
    {
      title: 'exp_month',
      dataIndex: 'exp_month',
      width: '20%',
      render: (text: string, record: any, tr: any) => {
        const [year, month] = text.split('-')
        return <span>{formatDateTime(text, 'YYYY-MM')}</span>
        // return <span>{tr('exp_month', { year, month })}</span>;
      },
    },
    {
      title: 'miner_count',
      dataIndex: 'total_miner_count',
      width: '20%',
      render: (text: string | number) => formatNumber(text),
    },
    {
      title: 'exp_power',
      dataIndex: 'total_exp_power',
      width: '15%',
      render: (text: string, record: any) => unitConversion(text, 2),
    },
    {
      title: 'sector_count',
      dataIndex: 'total_exp_sector_count',
      width: '15%',
      render: (text: string | number) => formatNumber(text),
    },
    {
      title: 'exp_dc',
      dataIndex: 'total_exp_dc',
      width: '15%',
      render: (text: string, record: any) => unitConversion(text, 2),
    },
    {
      title: 'exp_pledge',
      dataIndex: 'total_exp_pledge',
      width: '15%',

      render: (text: string | number) => renderFil(text),
    },
  ],
  columns: (tr: any, type?: 'detail') => {
    let arr: Array<any> = [
      {
        title: 'group_name',
        dataIndex: 'group_name',
        width: 100,
        fixed: 'left',
        ellipsis: {
          showTitle: false,
        },
        render: (text: string, record: any) => {
          const showText = record.is_default ? tr('default_group') : text
          return (
            <div className="text_color w-fit rounded-[5px] p-2 font-normal">
              {showText}
            </div>
          )
        },
      },
      {
        title: 'miner_id',
        dataIndex: 'miner_id',
        width: 100,
        fixed: 'left',
        render: (text: string, record: any) => {
          return (
            <>
              <div className="flex items-center gap-x-[1px]">
                <Link
                  href={`/account#expired?miner=${text}`}
                  className="link_text"
                >
                  {text}
                </Link>
                {record?.tag && (
                  <span className="w-fit max-w-[60px] rounded-[5px] bg-bg_hover px-2 py-1 text-xs  text-primary">
                    <TextTooltip
                      text={record?.tag}
                      className="whitespace-nowrap"
                    />
                  </span>
                )}
              </div>
            </>
          )
        },
      },
      {
        title: 'exp_power',
        dataIndex: 'exp_power',
        width: '15%',
        amountUnit: {
          exp_power: { unit: 'power', number: 2 },
        },
        render: (text: string, record: any) => unitConversion(text, 2),
      },
      {
        title: 'sector_count',
        dataIndex: 'exp_sector_count',
        width: '15%',
        render: (text: string | number) => formatNumber(text),
      },
      {
        title: 'exp_dc',
        dataIndex: 'exp_dc',
        width: '15%',
        amountUnit: {
          exp_dc: { unit: 'power', number: 2 },
        },
        render: (text: string, record: any) => unitConversion(text, 2),
      },
      {
        title: 'exp_pledge',
        dataIndex: 'exp_pledge',
        amountUnit: {
          exp_pledge: { unit: 'fil', number: 4 },
        },
        width: '15%',
        render: (text: string | number) => renderFil(text),
      },
    ]
    if (type && type === 'detail') {
      arr.unshift({
        title: 'exp_time',
        dataIndex: 'exp_date',
        fixed: 'left',
        width: '10%',
        render: (text: string) => formatDateTime(text, 'YYYY-MM-DD'),
      })
      ;(arr[1].width = '10%'),
        (arr[3].width = '10%'),
        (arr[2].render = (text: string) => (
          <Link href={`/miner/${text}`} className="link_text">
            {text}
          </Link>
        ))
    }
    return arr
  },
}

export const account_miners = {
  groups_miners_columns: [
    {
      dataIndex: 'miner_tag',
      title: 'custom_tag',
      width: '45%',
    },
    {
      dataIndex: 'miner_id',
      title: 'miner_id',
      width: '45%',
      render: (text: string) => (
        <Link href={`/miner/${text}`} className="link_text">
          {text}
        </Link>
      ),
    },
    {
      dataIndex: 'edit',
      title: 'edit',
      width: '10%',
    },
  ],
}

function renderFil(
  text: string | number,
  changeText?: number | string,
  flag: string = '',
  className?: string,
  unit: string = 'FIL',
) {
  const textValue = formatFil(text, unit, 4, true)
  return (
    <span className="flex flex-col">
      <span className={`${Number(text) ? '' : 'text_des_unit'}`}>
        {textValue}
      </span>
      {changeText !== undefined && (
        <span className={`${changeText ? className : 'text_des_unit'}`}>
          {flag + ' '}
          {formatFil(Math.abs(Number(changeText)), unit, 4, true)}
        </span>
      )}
    </span>
  )
}

const monitorUnit: Record<string, string> = {
  ExpireSectorMonitor: 'day',
  BalanceMonitor: 'FIL',
}
//监控columns
export const monitor_list = (tr: any, onChange: any, type?: string) => {
  return [
    {
      dataIndex: 'group_name',
      title: 'group_name',
      width: '100',
      fixed: 'left',
      render: (text: string, record: any) => {
        const showText = record.is_default ? tr('default_group') : text
        return (
          <div className="text_color w-fit p-2 font-normal text-mobile_font">
            {showText}
          </div>
        )
      },
    },

    {
      dataIndex: 'miner_id_or_all',
      title: 'miner_id',
      width: '200',
      fixed: 'left',
      render: (text: string, record: any) => {
        if (text === '') {
          return 'All'
        }
        return (
          <div className="flex items-center gap-x-1">
            {text}
            {record.miner_tag && (
              <span className="w-fit max-w-[60px] rounded-[5px] bg-bg_hover px-2 py-1 text-xs  text-primary">
                <TextTooltip
                  text={record.miner_tag}
                  className="whitespace-nowrap"
                />
              </span>
            )}
          </div>
        )
      },
    },
    {
      dataIndex: 'examination',
      title: 'examination',
      render: (text: string, record: any) => {
        if (type === 'power') {
          return (
            <div className="leading-7">
              <div>{tr('power_rules_1')}</div>
              <div>{tr('power_rules_2')}</div>
              <div>{tr('power_rules_3')}</div>
            </div>
          )
        }
        return (
          <ul className="list-none leading-7">
            {record.rules.map((rule: any, index: number) => {
              return (
                <li key={index}>
                  {`${tr(
                    rule?.account_type?.toLocaleLowerCase() ||
                      record.monitor_type,
                  )} ${tr(rule.operator)} ${tr(rule.operand)} ${tr(
                    monitorUnit[record.monitor_type],
                  )}`}
                </li>
              )
            })}
          </ul>
        )
      },
    },
    {
      dataIndex: 'alarm',
      title: 'alarm',
      render: (text: any, record: any) => {
        const mailList = record.mail_alert
        const msgList = record.msg_alert
        const callList = record.call_alert
        const obj: Record<string, any> = {
          email_warn: mailList,
          message_warn: msgList,
          phone_warn: callList,
        }
        return (
          <div className="flex list-none flex-col gap-y-2">
            {Object.keys(obj).map((key: string) => {
              const resList = obj[key]
              if (Array.isArray(resList)) {
                return (
                  <div key={key} className="flex flex-wrap font-normal">
                    <div className="text_des mr-2 w-fit">{tr(key)}:</div>
                    <div className="">
                      {resList.map((warn: string, index: number) => {
                        return <li key={index}>{warn}</li>
                      })}
                    </div>
                  </div>
                )
              }
            })}
          </div>
        )
      },
    },
    {
      dataIndex: 'created_at',
      title: 'created_at',
      render: (text: string, record: any) => {
        return formatDateTime(text)
      },
    },
    {
      dataIndex: 'is_active',
      title: 'status',
      render: (text: boolean, record: any, index: number) => {
        return (
          <ActiveRules
            text={text}
            title="isActive"
            onChange={() => onChange('isActive', record, index)}
          />
        )
      },
    },
    {
      dataIndex: 'edit',
      title: 'edit',
      width: '100',
      fixed: 'right',
      render: (text: any, record: any, index: number) => {
        return (
          <div className="flex gap-x-2 font-normal">
            <span
              className="cursor-pointer text-primary"
              onClick={() => onChange('edit_write', record, index)}
            >
              {tr(type === 'power' ? 'edit_write_warn' : 'edit_write')}
            </span>
            {type !== 'power' && (
              <ActiveRules
                text={text}
                title="edit_delete"
                onChange={() => onChange('edit_delete', record, index)}
              />
            )}
          </div>
        )
      },
    },
  ]
}

//告警方式
export const defaultWarn: any = {
  email_warn: {
    title: 'email_warn',
    value: 'email',
    placeholder: 'email_warn_placeholder',
    inputValue: '',
    warning: false,
    warningText: 'email_warn_warning',
    checked: false,
  },
  message_warn: {
    title: 'message_warn',
    value: 'message',
    placeholder: 'message_warn_placeholder',
    inputValue: '',
    warning: false,
    warningText: 'phone_warn_warning',
    checked: false,
  },
  phone_warn: {
    title: 'phone_warn',
    value: 'phone',
    placeholder: 'phone_warn_placeholder',
    inputValue: '',
    warning: false,
    warningText: 'phone_warn_warning',
    checked: false,
  },
}

//会员
export const member_list_1 = [
  {
    icon: <PowerIcon />,
    title: 'power_title',
    value: 'power_text',
  },
  {
    icon: <BalanceIcon />,
    title: 'balance_title',
    value: 'balance_text',
  },
  {
    icon: <SectorIcon />,
    title: 'sector_title',
    value: 'sector_text',
  },
]

export const member_list_2 = [
  {
    title: [
      {
        icon: <PowerWarnIcon />,
        title: 'warn_power',
      },
      {
        icon: <BalanceWarnIcon />,
        title: 'warn_balance',
      },
      {
        icon: <SectorWarnIcon />,
        title: 'warn_sector',
      },
    ],
    content: 'data_text',
  },
  {
    title: [
      {
        icon: <EmailIcon />,
        title: 'warn_email',
      },
      {
        icon: <MsgIcon />,
        title: 'warn_msg',
      },
      {
        icon: <PhoneIcon />,
        title: 'warn_phone',
      },
    ],
    content: 'warn_text',
  },
]

export const member_main: any = {
  EnterpriseVIP: {
    title: 'companies',
    icon: <Image src={CompaniesV} alt="" width={126} />,
    list: [
      { title: 'companies_1', icon: <i className="icon icon-quanyiicon" /> },
      { title: 'companies_2', icon: <i className="icon icon-quanyiicon" /> },
      { title: 'companies_3', icon: <i className="icon icon-quanyiicon" /> },
      { title: 'companies_4', icon: <i className="icon icon-quanyiicon" /> },
      { title: 'companies_5', icon: <i className="icon icon-quanyiicon" /> },
    ],
    priceList: [
      { title: 'monthly', price: '169U' },
      {
        title: 'quarter',
        price: '439U',
        discount: 'quarter_discount',
      },
      { title: 'year', price: '1599U', discount: 'year_discount' },
    ],
  },
  EnterpriseProVIP: {
    title: 'companiesPro',
    icon: <Image src={CompaniesVPro} alt="" width={126} />,
    list: [
      {
        title: 'companies_1_pro',
        icon: <i className="icon icon-quanyiicon " />,
      },
      { title: 'companies_2', icon: <i className="icon icon-quanyiicon" /> },
      { title: 'companies_3', icon: <i className="icon icon-quanyiicon" /> },
      { title: 'companies_4', icon: <i className="icon icon-quanyiicon" /> },
      { title: 'companies_6', icon: <i className="icon icon-quanyiicon" /> },
      { title: 'companies_5', icon: <i className="icon icon-quanyiicon" /> },
    ],
    priceList: [
      { title: 'monthly', price: '269U' },
      {
        title: 'quarter',
        price: '699U',
        discount: 'quarter_discount',
      },
      { title: 'year', price: '2499U', discount: 'year_discount' },
    ],
  },
}

//活动
export const active_member = [
  {
    title: 'active_1',
    icon: <Image src={active2} alt="" width={58} />,
    des: 'active_1_des',
  },
  {
    title: '',
    icon: <Image src={step} alt="" width={98} />,
    des: '',
  },
  {
    title: 'active_2',
    icon: <Image src={active3} alt="" width={58} />,
    des: 'active_2_des',
  },
  {
    title: '',
    icon: <Image src={step} alt="" width={98} />,
    des: '',
  },
  {
    title: 'active_3',
    icon: <Image src={active1} alt="" width={58} />,
    des: 'active_3_des',
  },
]

export const active_member_detail = [
  {
    icon: <Companies />,
    des: 'companies_1',
  },
  {
    icon: <Companies />,
    des: 'active_member_1',
  },
  {
    icon: <Companies />,
    des: 'companies_5',
  },
]
export const active_member_share = [
  {
    icon: <ActivePower />,
    title: 'warn_power',
  },
  {
    icon: <ActiveSector />,
    title: 'warn_sector',
  },
  {
    icon: <ActiveBalance />,
    title: 'warn_balance',
  },
  {
    icon: <ActiveWarn />,
    title: 'active_member_warn',
  },
]

export const active_member_list = (tr: any) => {
  return [
    {
      title: 'date',
      dataIndex: 'register_time',
      render: (text: string) => formatDateTime(text),
    },
    {
      title: 'invitees',
      dataIndex: 'user_email',
    },

    {
      title: 'status',
      dataIndex: 'is_valid',
      render: (text: boolean) => {
        return (
          <ul className="list-none text-sm ">
            <li className="text_green flex items-center gap-x-2">
              {getSvgIcon('successIcon')}
              {tr('success_member')}
            </li>
            {text && (
              <li className="text_green flex items-center gap-x-2">
                {getSvgIcon('successIcon')}
                {tr('success_miners')}
              </li>
            )}
            {!text && (
              <li className="text_red flex items-center gap-x-2">
                {getSvgIcon('errorIcon')}
                {tr('error_member')}
              </li>
            )}
          </ul>
        )
      },
    },
    {
      title: 'is_valid',
      dataIndex: 'is_valid',
      render: (text: boolean) => {
        return text ? tr('success_active') : tr('error_active')
      },
    },
  ]
}
