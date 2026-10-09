import { Translation } from '@/components/hooks/Translation'
import { useHash } from '@/components/hooks/useHash'
import { chartsNav } from '@/contents/statistic'
import { Menu_Info } from '@/contents/type'
import { getSvgIcon } from '@/svgsIcon'
import PowerTrend from '@/src/statistics/Trend'
import BlockRewardTrend from '@/src/statistics/BlockRewardTrend'
import RewardStreams from '@/src/statistics/RewardStreams'
import BlockRewardPer from '@/src/statistics/BlockRewardPer'
import ActiveNodeTrend from '@/src/statistics/ActiveNodeTrend'
import Link from 'next/link'
import FilChart from '@/src/statistics/FilChart'
import Charts from '@/src/statistics/Charts'
import classNames from 'classnames'
import { BrowserView, MobileView } from '@/components/device-detect'
import Meta from '@/src/statistics/Meta'

import styles from './index.module.scss'
import ContractTrend from '@/src/statistics/ContractTrend'
import ContractGas from '@/src/statistics/contractGas'
import ContractAddr from '@/src/statistics/contractAddr'
import ContractCon from '@/src/statistics/contractCon'
import ContractBalance from '@/src/statistics/ContractBanlace'
import { observer } from 'mobx-react'
import { useEffect } from 'react'

export default observer(() => {
  const { tr } = Translation({ ns: 'static' })
  const { hash } = useHash()

  useEffect(() => {
    // 旧 hash 别名：「算力倍数结构走势」已并入「算力走势」⇒ 落点重定向到合并后的那张图
    // （hash 仍以 'blockChain' 开头，故上面的分组判据照常渲染；这里只改滚动落点）
    const hashAliases: Record<string, string> = {
      blockChain_cc_dc_power: 'blockChain_power',
    }
    const target = hashAliases[hash] || hash
    const hashArr = [
      'networks',
      'fevm',
      'fevm_trend',
      'blockChain',
      'blockChain_power',
      'block_reward_streams',
      'reward_split',
      'fil_overview',
    ]
    if (typeof window === 'undefined') return
    if (hashAliases[hash]) {
      document.getElementById(target)?.scrollIntoView()
    } else if (hashArr.includes(target)) {
      window.scrollTo(0, 0)
    }
  }, [hash])

  const renderNavChildren = (itemChildren: Array<Menu_Info>) => {
    return (
      <ul className="flex w-full flex-col">
        {itemChildren.map((child: Menu_Info) => {
          return (
            <Link
              key={child.key}
              href={`/statistics/charts#${child.key}`}
              className={`text_des text_color  flex w-full items-center gap-x-2 rounded-[5px] p-1.5 pl-10 text-sm hover:!text-primary ${
                hash === child.key ? 'bg-bg_hover !text-primary' : ''
              }`}
            >
              {tr(child?.title || child.key)}
            </Link>
          )
        })}
      </ul>
    )
  }
  return (
    <div
      className={classNames(
        styles['statistics-charts'],
        'main_contain !overflow-auto',
      )}
    >
      <div className={classNames('flex gap-x-5', styles.content)}>
        <BrowserView>
          <div className={`${styles['static-menu']}`}>
            <div className="mx-2.5 mb-2 flex h-10 flex-col justify-center text-lg font-medium">
              <span>{tr('static_overview')}</span>
            </div>
            <ul className="card_shadow border_color flex h-fit cursor-pointer flex-col rounded-xl border py-4">
              {chartsNav.map((item) => {
                const { preIcon, title, key } = item
                return (
                  <div
                    key={item.key}
                    className="relative flex w-full flex-col items-center px-4 font-HarmonyOS_Medium"
                  >
                    <Link
                      key={item.key}
                      href={`/statistics/charts#${item.key}`}
                      className={`text_color flex h-8 w-full items-center gap-x-2 rounded-[5px] px-2.5  hover:text-primary ${
                        hash === item.key ? 'bg-bg_hover text-primary' : ''
                      }`}
                    >
                      {preIcon && getSvgIcon(preIcon)}
                      {tr(title || key)}
                    </Link>
                    {item.children && renderNavChildren(item.children)}
                  </div>
                )
              })}
            </ul>
          </div>
        </BrowserView>
        <MobileView>
          <div className={styles['nav-wrap']}>
            {chartsNav.map((value, index) => {
              return (
                <Link
                  className={
                    hash === value.key || (hash === '' && index == 0)
                      ? styles.active
                      : ''
                  }
                  key={value.key}
                  href={`/statistics/charts#${value.key}`}
                >
                  {tr(value.title || value.key)}
                </Link>
              )
            })}
          </div>
        </MobileView>

        <div
          className={classNames('flex flex-1 flex-col', styles['tab-content'])}
        >
          {!hash && <Meta />}
          {hash === 'networks' && <Meta />}
          {hash.startsWith('fevm') && (
            <div>
              <div id="fevm_trend">
                <ContractTrend />
              </div>
              <div id="fevm_con" className={styles['statistics-target']}>
                <ContractCon />
              </div>
              <div id="fevm_addr" className={styles['statistics-target']}>
                <ContractAddr />
              </div>
              <div id="fevm_gas" className={styles['statistics-target']}>
                <ContractGas />
              </div>
              <div id="fevm_balance" className={styles['statistics-target']}>
                <ContractBalance />
              </div>
            </div>
          )}
          {/* 「区块奖励流向」保留（用户 2026-10-08 二次裁定：这是全网唯一能看到奖励流向的地方）。
              「服务奖励排行」卡改由首页承载 —— 同页曾与首页那张重复，故本组不再渲染 RewardSplit；
              hash 判据里仍留着 reward_split，老链接/书签照样落在这组区块上。 */}
          {(hash.startsWith('blockChain') ||
            hash === 'block_reward_streams' ||
            hash === 'reward_split') && (
            <div>
              <div id="blockChain_power">
                <PowerTrend />
              </div>
              <div
                id="blockChain_trend"
                className={styles['statistics-target']}
              >
                <BlockRewardTrend />
              </div>
              <div
                id="block_reward_streams"
                className={styles['statistics-target']}
              >
                <RewardStreams />
              </div>
              <div
                id="blockChain_reward_per"
                className={styles['statistics-target']}
              >
                <BlockRewardPer />
              </div>
              <div
                id="blockChain_nodes"
                className={styles['statistics-target']}
              >
                <ActiveNodeTrend />
              </div>
            </div>
          )}
          {hash === 'fil_overview' && (
            <>
              <FilChart />
              <Charts />
            </>
          )}
        </div>
      </div>
    </div>
  )
})
