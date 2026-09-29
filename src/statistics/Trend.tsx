/** @format */
import { apiUrl } from '@/contents/apiUrl'
import EChart from '@/components/echarts'
import { Translation } from '@/components/hooks/Translation'
import { power_trend, power_trend_intervals } from '@/contents/statistic'
import { getSvgIcon } from '@/svgsIcon'
import { formatDateTime } from '@/utils'
import {
  DEFAULT_TREND_INTERVAL,
  TREND_INTERVAL_FALLBACKS,
  formatPowerAxisTick,
  hasEnoughPoints,
  pickAxisUnits,
  pickTrendFallbackInterval,
  scaleToPowerUnit,
  scaleToPowerUnitForDisplay,
  unavailableTrendIntervals,
  type PowerUnit,
} from '@/utils/powerTrend'
import { getColor, get_xAxis } from '@/utils/echarts'
import GoIcon from '@/assets/images/black_go.svg'
import GoMobileIcon from '@/assets/images/icon-right-white.svg'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import useObserver from '@/components/hooks/useObserver'
import styles from './trend.module.scss'
import classNames from 'classnames'
import { BrowserView, MobileView } from '@/components/device-detect'
import useAxiosData from '@/store/useAxiosData'
import Segmented from '@/packages/segmented'
import useWindow from '@/components/hooks/useWindown'
import filscanStore from '@/store/modules/filscan'
import { observer } from 'mobx-react'
interface Props {
  origin?: string
  className?: string
}

export default observer((props: Props) => {
  const { origin, className } = props
  const { theme, lang } = filscanStore
  const { tr } = Translation({ ns: 'static' })
  const ref = useObserver()
  const { axiosData } = useAxiosData()
  const [noShow, setNoShow] = useState<Record<string, boolean>>({})
  const [options, setOptions] = useState<any>({})
  // 轴单位（左轴=有效算力/原值算力，右轴=算力净增/损失），取到数据后按各轴数据量级定档
  // 初值与改动前写死的 EiB/PiB 一致，主网量级仍会算成 EiB
  const [axisUnits, setAxisUnits] = useState<PowerUnit[]>(['EiB', 'PiB'])
  // 时间区间：默认仍是 1m（改动前行为）；默认档位点数不足时进入 historyLimited（测试网历史状态只有约 36h）
  const [activeInterval, setActiveInterval] = useState<string>(
    DEFAULT_TREND_INTERVAL,
  )
  const [listByInterval, setListByInterval] = useState<Record<string, any[]>>(
    {},
  )
  const [intervalCounts, setIntervalCounts] = useState<Record<string, number>>(
    {},
  )
  const [historyLimited, setHistoryLimited] = useState(false)
  const { isMobile } = useWindow()
  const color = useMemo(() => {
    return getColor(theme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme])

  const default_xAxis = useMemo(() => {
    return get_xAxis(theme, isMobile)
  }, [theme, isMobile])

  // 档位里点数不足的（测试网无历史数据）置灰，不给用户点到空白图
  const unavailableIntervals = useMemo(() => {
    return unavailableTrendIntervals(intervalCounts, TREND_INTERVAL_FALLBACKS)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intervalCounts])

  const defaultOptions = useMemo(() => {
    const [leftUnit, rightUnit] = axisUnits
    let options = {
      grid: {
        // 展示区间说明时留出一行小字的高度，避免压住轴标签
        top: historyLimited ? (isMobile ? 34 : 46) : 30,
        left: 20,
        right: 20,
        bottom: 20,
        containLabel: true,
      },
      yAxis: [
        {
          type: 'value',
          position: 'left',
          scale: true,
          nameTextStyle: {
            color: color.textStyle,
          },
          axisLabel: {
            // 单位跟随数据量级（EiB / PiB / TiB），不再写死
            formatter: (value: number) => formatPowerAxisTick(value, leftUnit),
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
            show: false,
            lineStyle: {
              type: 'dashed',
              color: color.splitLine,
            },
          },
        },
        {
          type: 'value',
          position: 'right',
          scale: true,
          nameTextStyle: {
            color: color.textStyle,
          },
          axisLabel: {
            // 右轴（算力净增/损失）独立定档
            formatter: (value: number) => formatPowerAxisTick(value, rightUnit),
            textStyle: {
              //  fontSize: this.fontSize,
              color: isMobile ? color.mobileLabelColor : color.labelColor,
            },
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: color.splitLine,
            },
          },
        },
      ],
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
          var result = v?.[0]?.data?.showTime || ''
          v.forEach((item: any) => {
            if (item.data) {
              result +=
                '<br/>' +
                item.marker +
                tr(item.seriesName) +
                ': ' +
                item.data.amount +
                ' ' +
                item.data.unit
            }
          })
          return result
        },
      },
    }
    if (isMobile) {
      ;(options as any)['grid'] = {
        top: historyLimited ? '28px' : '16px',
        right: '12px',
        bottom: '16px',
        left: '12px',
        containLabel: true,
      }
    }
    return options
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, isMobile, axisUnits, historyLimited])

  useEffect(() => {
    load()
  }, [])

  // 用一批数据（原始字节值）构建图表 series；单位按该数据的量级定档，不做插值/平滑
  const buildOptions = (list: any[]) => {
    const units = pickAxisUnits(list)
    const seriesObj: any = {}
    power_trend.list.forEach((v) => {
      seriesObj[v.dataIndex] = []
    })
    const dateList: any[] = []
    const legendList: any[] = []
    const seriesData: any[] = []
    list.forEach((value: any) => {
      const { timestamp } = value
      dateList.push(formatDateTime(timestamp, 'MM-DD'))
      power_trend.list.forEach((item: any) => {
        // 同一轴上的系列共用一个单位（按该轴数据量级定档）
        const unit = units[item.yIndex] || units[0]
        const raw = value[item.dataIndex]
        seriesObj[item.dataIndex].push({
          // 绘图值：同一轴同一单位，保留 6 位小数（不插值、不平滑）
          value: scaleToPowerUnit(raw, unit, 6),
          // tooltip 值：同口径单位，但小数值自动补足小数位，不显示成 0
          amount: scaleToPowerUnitForDisplay(raw, unit, 2),
          unit,
          showTime: formatDateTime(timestamp, 'YYYY-MM-DD HH:mm'),
        })
      })
    })
    power_trend.list.forEach((item: any) => {
      legendList.push({
        name: item.dataIndex,
        color: item.color,
        type: item.type,
      })
      seriesData.push({
        type: item.type,
        data: seriesObj[item.dataIndex],
        key: item.dataIndex,
        name: item.dataIndex,
        yAxisIndex: item.yIndex,
        symbol: 'circle',
        smooth: true,
        itemStyle: {
          color: item.color,
        },
        barMaxWidth: '30',
      })
    })
    setAxisUnits(units)
    setOptions({ series: seriesData, xData: dateList, legendData: legendList })
  }

  const load = async () => {
    const result: any = await axiosData(apiUrl.line_trend, {
      interval: DEFAULT_TREND_INTERVAL,
    })
    const primaryList: any[] = result?.list || []
    if (hasEnoughPoints(primaryList)) {
      // 默认档位就有折线数据（主网）：请求与展示跟改动前一致，不额外请求、不显示档位与说明
      setListByInterval({ [DEFAULT_TREND_INTERVAL]: primaryList })
      setIntervalCounts({ [DEFAULT_TREND_INTERVAL]: primaryList.length })
      setActiveInterval(DEFAULT_TREND_INTERVAL)
      setHistoryLimited(false)
      buildOptions(primaryList)
      return
    }
    // 默认档位点数不足（测试网只保留约 36h 历史状态，1m/1y 只有 1 个点）：
    // 逐档探测可用性，顺便把各档数据缓存下来（切档位不再重复请求）
    const lists: Record<string, any[]> = {
      [DEFAULT_TREND_INTERVAL]: primaryList,
    }
    const counts: Record<string, number> = {
      [DEFAULT_TREND_INTERVAL]: primaryList.length,
    }
    for (const item of TREND_INTERVAL_FALLBACKS) {
      const res: any = await axiosData(apiUrl.line_trend, { interval: item })
      const list: any[] = res?.list || []
      lists[item] = list
      counts[item] = list.length
    }
    // 取回退顺序里第一个能画出线的档位（24h -> 7d -> 30d -> 1y），都没有就画空图，不编数据
    const fallback = pickTrendFallbackInterval(counts)
    setListByInterval(lists)
    setIntervalCounts(counts)
    setHistoryLimited(true)
    setActiveInterval(fallback || DEFAULT_TREND_INTERVAL)
    buildOptions(fallback ? lists[fallback] : [])
  }

  const changeInterval = (value: string) => {
    setActiveInterval(value)
    buildOptions(listByInterval[value] || [])
  }

  const newOptions = useMemo(() => {
    const newSeries: any = []
    ;(options?.series || []).forEach((seriesItem: any) => {
      if (!noShow[seriesItem?.name]) {
        newSeries.push(seriesItem)
      }
    })
    return {
      ...defaultOptions,
      xAxis: {
        ...default_xAxis,
        data: options?.xData || [],
      },
      series: newSeries,
    }
  }, [options, defaultOptions, default_xAxis, noShow])

  const propsRef = origin === 'home' ? { ref } : {}

  // 真实区间说明（浅色小字）：只在默认档位数据不足、自动回退时出现
  const historyNote = historyLimited
    ? tr('power_trend_history_note', { range: activeInterval })
    : ''

  return (
    <div
      //id='power'
      className={classNames(
        styles.trend,
        `h-[full] w-full  ${className} ${origin === 'home' ? 'mt-20' : ''}`,
      )}
      {...propsRef}
    >
      <div
        className={classNames(
          `mb-2.5 flex min-h-[36px] flex-wrap items-center justify-between ${
            lang === 'en' ? 'h-[60px]' : ''
          }`,
          styles['title-wrap'],
        )}
      >
        <div className="flex flex-1 flex-row flex-wrap items-center">
          <div
            className={classNames(
              'w-fit pl-2.5 font-HarmonyOS text-lg font-semibold',
              styles.title,
            )}
          >
            {tr('power')}
          </div>
          <div className="w-fit">
            <BrowserView>
              <span className="ml-5 flex gap-x-4">
                {options?.legendData?.map((v: any) => {
                  return (
                    <span
                      className="flex cursor-pointer items-center gap-x-1 text-xs"
                      key={v.name}
                      onClick={() => {
                        setNoShow({ ...noShow, [v.name]: !noShow[v.name] })
                      }}
                      style={{ color: noShow[v.name] ? '#d1d5db' : v.color }}
                    >
                      {getSvgIcon(
                        v.type === 'bar' ? 'barLegend' : 'legendIcon',
                      )}
                      <span className="text_des text-xs font-normal">
                        {tr(v.name)}
                      </span>
                    </span>
                  )
                })}
              </span>
            </BrowserView>
          </div>
        </div>
        {historyLimited && (
          <Segmented
            defaultValue={activeInterval}
            data={power_trend_intervals}
            ns="static"
            isHash={false}
            disabledKeys={unavailableIntervals}
            disabledTip="power_trend_data_unavailable"
            onChange={(value: string) => changeInterval(value)}
          />
        )}
        {origin === 'home' && (
          <Link href={`/statistics/charts#blockChain`}>
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

      <BrowserView>
        <div
          className={`card_shadow border_color relative h-[350px] w-full rounded-xl border pb-2`}
        >
          {historyNote && (
            <span
              className="text_des pointer-events-none absolute right-2.5 top-1.5 z-10 text-[11px] font-normal opacity-70"
              data-testid="power-trend-history-note"
            >
              {historyNote}
            </span>
          )}
          <EChart options={newOptions} />
        </div>
      </BrowserView>
      <MobileView>
        <div
          className={classNames(
            `card_shadow border_color w-full rounded-xl border pb-2`,
            styles['chart-wrap'],
          )}
        >
          {(() => {
            if ((lang === 'en' || lang === 'ka') && isMobile) {
              return (
                <span
                  className={classNames(
                    'chart-legend grid grid-cols-2 gap-2',
                    styles.legend,
                  )}
                >
                  {options?.legendData?.map((v: any) => {
                    return (
                      <span
                        className="flex cursor-pointer items-center gap-x-1 text-xs"
                        key={v.name}
                        onClick={() => {
                          setNoShow({ ...noShow, [v.name]: !noShow[v.name] })
                        }}
                        style={{ color: noShow[v.name] ? '#d1d5db' : v.color }}
                      >
                        {getSvgIcon(
                          v.type === 'bar' ? 'barLegend' : 'legendIcon',
                        )}
                        <span
                          className={classNames(
                            'text_des text-xs font-normal',
                            styles.value,
                          )}
                        >
                          {tr(v.name)}
                        </span>
                      </span>
                    )
                  })}
                </span>
              )
            }
            return (
              <span
                className={classNames(
                  'chart-legend flex gap-x-4',
                  styles.legend,
                )}
              >
                {options?.legendData?.map((v: any) => {
                  return (
                    <span
                      className="flex cursor-pointer items-center gap-x-1 text-xs"
                      key={v.name}
                      onClick={() => {
                        setNoShow({ ...noShow, [v.name]: !noShow[v.name] })
                      }}
                      style={{ color: noShow[v.name] ? '#d1d5db' : v.color }}
                    >
                      {getSvgIcon(
                        v.type === 'bar' ? 'barLegend' : 'legendIcon',
                      )}
                      <span
                        className={classNames(
                          'text_des text-xs font-normal',
                          styles.value,
                        )}
                      >
                        {tr(v.name)}
                      </span>
                    </span>
                  )
                })}
              </span>
            )
          })()}
          <div className="relative h-[350px]">
            {historyNote && (
              <span className="text_des pointer-events-none absolute right-2.5 top-1 z-10 text-[10px] font-normal opacity-70">
                {historyNote}
              </span>
            )}
            <EChart options={newOptions} />
          </div>
        </div>
      </MobileView>
    </div>
  )
})
