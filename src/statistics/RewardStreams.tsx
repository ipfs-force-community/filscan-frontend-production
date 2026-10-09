/** @format */
import { apiUrl } from '@/contents/apiUrl'
import EChart from '@/components/echarts'
import { Translation } from '@/components/hooks/Translation'
import { reward_streams, reward_streams_intervals } from '@/contents/statistic'
import { formatDateTime, formatFil, formatFilNum } from '@/utils'
import { getColor, get_xAxis } from '@/utils/echarts'
import { useEffect, useMemo, useState } from 'react'
import styles from './RewardStreams.module.scss'
import classNames from 'classnames'
import useAxiosData from '@/store/useAxiosData'
import Segmented from '@/packages/segmented'
import GoIcon from '@/assets/images/black_go.svg'
import GoMobileIcon from '@/assets/images/icon-right-white.svg'
import Link from 'next/link'
import { BrowserView, MobileView } from '@/components/device-detect'
import useWindow from '@/components/hooks/useWindown'
import filscanStore from '@/store/modules/filscan'
import { observer } from 'mobx-react'
import {
  USE_FAKE_REWARD_STREAMS,
  fakeRewardStreamsResponse,
} from './rewardStreamsFake'

interface Props {
  origin?: string
  className?: string
}

// 区块奖励流向（NV29/FIP-0118）：矿工 / 服务流 / 销毁 三股，堆叠柱展示份额构成。
// （2026-10-08 二次裁定：本卡是全网唯一能看到奖励流向的地方 ⇒ 保留；同页的「服务奖励排行」卡改由首页承载。）
// 字段口径与现有统计曲线一致（attoFIL 十进制字符串，展示时 ÷1e18 转 FIL）。
export default observer((props: Props) => {
  const { origin, className } = props
  const { theme, lang } = filscanStore
  const { tr } = Translation({ ns: 'static' })
  const { axiosData } = useAxiosData()
  const [options, setOptions] = useState<any>({})
  const [interval, setInterval] = useState('24h')
  const { isMobile } = useWindow()
  const color = useMemo(() => {
    return getColor(theme)
  }, [theme])

  const default_xAxis = useMemo(() => {
    return get_xAxis(theme, isMobile)
  }, [theme, isMobile])

  const defaultOptions = useMemo(() => {
    return {
      grid: {
        top: 30,
        left: 20,
        right: 20,
        bottom: 20,
        containLabel: true,
      },
      yAxis: {
        type: 'value',
        position: 'left',
        // 堆叠柱必须以 0 为基线，故不用 scale（否则常量序列会把轴压成退化区间、柱子不可见）
        scale: false,
        nameTextStyle: {
          color: color.textStyle,
        },
        axisLabel: {
          formatter: '{value} FIL',
          textStyle: {
            //  fontSize: this.fontSize,
            color: isMobile ? color.mobileLabelColor : color.labelColor,
          },
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed',
            color: color.splitLine,
          },
        },
      },
      legend: {
        show: false,
      },
      tooltip: {
        //@ts-ignore
        position: function (pos, params, dom, rect, size) {
          // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
          var obj = { top: 80 }
          //@ts-ignore
          obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5
          return isMobile ? obj : undefined
        },
        trigger: 'axis',
        backgroundColor: color.toolbox,
        borderColor: 'transparent',
        textStyle: {
          color: '#ffffff',
        },
        formatter(v: any) {
          var result = v[0]?.data?.showTime || ''
          v.forEach((item: any) => {
            if (item.data) {
              result +=
                '<br/>' +
                item.marker +
                tr(item.seriesName) +
                ': ' +
                item.data.amount +
                item.data.unit
            }
          })
          return result
        },
      },
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, lang, isMobile])

  useEffect(() => {
    load()
  }, [])

  const load = async (time?: string) => {
    const seriesObj: any = {}
    reward_streams.list.forEach((v) => {
      seriesObj[v.dataIndex] = []
    })
    const dateList: any = []
    const seriesData: any = []
    const inter = time || interval

    // 后端 RewardStreams 接口部署前，本地渲染验证走 Fake（见 rewardStreamsFake.ts，默认关闭）
    const result: any = USE_FAKE_REWARD_STREAMS
      ? fakeRewardStreamsResponse(inter)
      : await axiosData(apiUrl.static_reward_streams, { interval: inter })

    // 兼容网关外壳 {code,msg,data:{…}} 与直出 {nv29_epoch,items} 两种形状
    const payload = result?.data ?? result ?? {}
    const items: any[] = payload?.items || []
    const nv29 = Number(payload?.nv29_epoch || 0)

    items.forEach((value: any) => {
      const { block_time } = value
      const showTime =
        inter === '24h'
          ? formatDateTime(block_time, 'HH:mm')
          : formatDateTime(block_time, 'MM-DD HH:mm')
      dateList.push(showTime)
      reward_streams.list.forEach((item: any) => {
        const raw = value[item.dataIndex]
        seriesObj[item.dataIndex].push({
          value: formatFil(raw, 'FIL', 2),
          showTime: formatDateTime(block_time, 'YYYY-MM-DD HH:mm'),
          amount: formatFilNum(raw, false, false, 4, false).split(' ')[0],
          unit: 'FIL',
        })
      })
    })

    // nv29_epoch > 0 时，在激活高度对应的 x 位置画一条竖线；
    // nv29_epoch == 0（主网当前未排期）不画线、不显示该文案。
    let nv29Line: any = null
    if (nv29 > 0) {
      const idx = items.findIndex((v: any) => Number(v.epoch) >= nv29)
      if (idx >= 0) {
        nv29Line = {
          silent: true,
          symbol: 'none',
          lineStyle: {
            color: '#E15252',
            type: 'dashed',
          },
          label: {
            show: true,
            position: 'insideEndTop',
            color: isMobile ? color.mobileLabelColor : color.labelColor,
            formatter: tr('reward_stream_nv29_line'),
          },
          data: [{ xAxis: dateList[idx] }],
        }
      }
    }

    reward_streams.list.forEach((item: any) => {
      seriesData.push({
        type: item.type,
        stack: item.stack,
        data: seriesObj[item.dataIndex],
        name: item.title,
        symbol: 'circle',
        itemStyle: {
          color: item.color,
        },
        barMaxWidth: '30',
        ...(item.dataIndex === 'miner' && nv29Line
          ? { markLine: nv29Line }
          : {}),
      })
    })
    setOptions({ series: seriesData, xData: dateList })
  }

  const newOptions = useMemo(() => {
    const newSeries: any = []
    ;(options?.series || []).forEach((seriesItem: any) => {
      newSeries.push(seriesItem)
    })
    return {
      ...defaultOptions,
      xAxis: {
        ...default_xAxis,
        data: options?.xData || [],
      },
      series: newSeries,
    }
  }, [options, defaultOptions])
  return (
    <div className={classNames(styles.wrap, `h-[full] w-full  ${className}`)}>
      <div
        className={classNames(
          'mx-2.5 mb-4 flex flex-1  flex-row flex-wrap items-center justify-between',
          styles['title-wrap'],
        )}
      >
        <div className="w-fit min-w-[120px] font-HarmonyOS text-lg font-semibold ">
          {tr('block_reward_streams')}
        </div>
        {/* 时段控件只在数据统计页出现（并排 Segmented 三档：24时/7天/30天）。
            首页不暴露任何时段控件（产品 2026-10-09 更正）：固定用默认档 '24h'，
            要切时段走右上角跳转图标去统计页。 */}
        {origin !== 'home' && (
          <Segmented
            defaultValue={interval}
            data={reward_streams_intervals}
            ns="static"
            isHash={false}
            onChange={(value) => {
              setInterval(value)
              load(value)
            }}
          />
        )}
        {/* 首页专属：跳数据统计页同一张图的图标（统计页本来就在那页 ⇒ 仅 home 渲染） */}
        {origin === 'home' && (
          <Link href={`/statistics/charts#block_reward_streams`}>
            <MobileView>
              <GoMobileIcon width={28} height={28} />
            </MobileView>
            <BrowserView>
              <GoIcon
                width={18}
                height={18}
                className="mr-2.5 cursor-pointer"
              />
            </BrowserView>
          </Link>
        )}
      </div>
      <div
        className={classNames(
          `card_shadow border_color h-[350px] w-full rounded-xl border pb-2`,
          styles.content,
        )}
      >
        <EChart options={newOptions} />
      </div>
    </div>
  )
})
