/** @format */

//import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import Banner from '@/components/banner'
import MobileBanner from '@/components/mobile/home/banner'
import Meta from '@/src/home/meta'
import RewardAllocation from '@/src/home/RewardAllocation'
import Gas from '@/src/statistics/Gas'
import Rank from '@/src/rank'
import Link from 'next/link'
import { Translation } from '@/components/hooks/Translation'
import GoIcon from '@/assets/images/black_go.svg'
import GoMobileIcon from '@/assets/images/icon-right-white.svg'
import ContractRank from '@/src/contract/rank'
import DefiList from '@/src/fevm/defi'
import Trend from '@/src/statistics/Trend'
import useObserver from '@/components/hooks/useObserver'
import { BrowserView, MobileView } from '@/components/device-detect'
import styles from './style.module.scss'
import Defi from '@/components/mobile/home/defi'
import MobileContractRank from '@/components/mobile/home/contractRank'
import MobileRank from '@/components/mobile/home/rank'
import classNames from 'classnames'
import ContractTrend from '@/src/statistics/ContractTrend'

function Home(props: any) {
  const { tr } = Translation({ ns: 'home' })
  const ref = useObserver()
  const ref1 = useObserver()
  return (
    <div className={styles['home-page']}>
      <div>
        <MobileView>
          <MobileBanner />
        </MobileView>
        <BrowserView>
          <Banner />
        </BrowserView>
        <div className={classNames('main_contain !mt-[26px]', styles.content)}>
          <div className="meta-gas flex h-[270px] justify-between gap-x-5 ">
            <Meta />
            <div
              className={classNames(
                'card_shadow border_color gas-wrap h-[270px] w-[403px] rounded-xl border',
                styles['gas-wrap'],
              )}
            >
              <BrowserView>
                <div
                  className={`flex justify-between p-5 font-HarmonyOS text-xs`}
                >
                  {tr('base_gas')}
                  <Link href={`/statistics/gas/`}>
                    <GoIcon className="cursor-pointer" width={18} height={18} />
                  </Link>
                </div>
              </BrowserView>

              <MobileView>
                <div className={styles['chart-title']}>
                  <div className={styles.label}>{tr('base_gas')}</div>
                  <Link href={`/statistics/gas/`}>
                    <GoMobileIcon
                      className="cursor-pointer"
                      width={22}
                      height={22}
                    />
                  </Link>
                </div>
              </MobileView>
              <Gas className={'!h-[210px] w-full'} />
            </div>
          </div>
          {/* 区块奖励分配（NV29 三股）：紧邻上方网络数据区；未激活 NV29 时块内只给一句说明 */}
          <div className="mt-5">
            <RewardAllocation />
          </div>
          <div className="box-column mt-12 flex h-[400px] justify-between gap-x-5">
            <Trend origin="home" className={'!h-full w-full flex-1'} />
            <ContractTrend origin="home" className={'!h-full w-full flex-1'} />
          </div>
          <BrowserView>
            <div className="mt-32" ref={ref}>
              <Rank origin={'home'} />
            </div>
            <div className="mt-12 flex gap-x-5" ref={ref1}>
              <div className="w-1/2">
                <ContractRank origin="home" />
              </div>
              <div className="w-1/2">
                <div
                  className={`flex h-[30px] items-center justify-between px-2.5`}
                >
                  <div className="font-HarmonyOS text-lg font-semibold">
                    {tr('defi_list')}
                  </div>
                  <Link href={`/fevm/defi`}>
                    <GoIcon className="cursor-pointer" width={18} height={18} />
                  </Link>
                </div>
                <DefiList origin="home" />
              </div>
            </div>
          </BrowserView>
        </div>
      </div>
      <MobileView>
        <div className={classNames('px-[12px]')}>
          <MobileRank />
          <MobileContractRank />
          <Defi />
        </div>
      </MobileView>
    </div>
  )
}

export default Home
