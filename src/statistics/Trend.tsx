/** @format */
import { apiUrl } from '@/contents/apiUrl'
import EChart from '@/components/echarts'
import Tooltip from '@/packages/tooltip'
import { Translation } from '@/components/hooks/Translation'
import { power_trend, power_trend_intervals } from '@/contents/statistic'
import { getSvgIcon } from '@/svgsIcon'
import { formatDateTime } from '@/utils'
import {
  DEFAULT_TREND_INTERVAL,
  TREND_INTERVALS,
  formatPowerAxisTick,
  pickAxisUnits,
  scaleToPowerUnit,
  scaleToPowerUnitForDisplay,
  shouldDrawNv29Line,
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
import Select from '@/packages/select'
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
  // 轴单位（左轴=有效算力 QA；右轴=原值算力的两档：满倍率 + 可升级），取到数据后按各轴数据量级定档
  // 初值与上限一致：左轴 EiB、右轴 PiB（上限常量见 utils/powerTrend.ts 的 POWER_TREND_AXIS_UNIT_CAPS）
  const [axisUnits, setAxisUnits] = useState<PowerUnit[]>(['EiB', 'PiB'])
  // 时间区间：默认 30 天；四档常显（测试网历史状态只有约 36h，点数不足的档位置灰）
  const [activeInterval, setActiveInterval] = useState<string>(
    DEFAULT_TREND_INTERVAL,
  )
  const [listByInterval, setListByInterval] = useState<Record<string, any[]>>(
    {},
  )
  const [intervalCounts, setIntervalCounts] = useState<Record<string, number>>(
    {},
  )
  // 本网 NV29 激活高度（响应字段 nv29_epoch）；0/缺失 = 未排期或不带该字段，不画竖线
  const [nv29Epoch, setNv29Epoch] = useState<number>(0)
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
    return unavailableTrendIntervals(intervalCounts)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intervalCounts])

  const defaultOptions = useMemo(() => {
    const [leftUnit, rightUnit] = axisUnits
    let options = {
      grid: {
        top: 30,
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
            // 右轴（原值算力的两档）独立定档
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
          // 五行：时间 + 有效算力（左轴）/ 原值算力（左轴）/ 可升级算力（右轴）/ 算力增量（右轴，带正负号）
          // 每行数值随所属系列的单位（series 行用所属轴的定档单位），不再有额外的解释层 extras。
          v.forEach((item: any) => {
            if (item.data) {
              const amt = Number(item.data.amount)
              // 算力增量可正可负：正数补一个明确的「+」号
              const sign =
                item.seriesName === 'change_quality_adj_power' && amt > 0
                  ? '+'
                  : ''
              result +=
                '<br/>' +
                item.marker +
                tr(item.seriesName) +
                ': ' +
                sign +
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
        top: '16px',
        right: '12px',
        bottom: '16px',
        left: '12px',
        containLabel: true,
      }
    }
    return options
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, isMobile, axisUnits])

  useEffect(() => {
    load()
  }, [])

  // 用一批数据（原始字节值）构建图表 series；单位按该数据的量级定档，不做插值/平滑
  const buildOptions = (list: any[], nv29: number = nv29Epoch) => {
    const units = pickAxisUnits(list)
    const seriesObj: any = {}
    power_trend.list.forEach((v) => {
      seriesObj[v.dataIndex] = []
    })
    const dateList: any[] = []
    const legendList: any[] = []
    const seriesData: any[] = []
    // NV29 竖线：仅当本档窗口跨越激活高度时画（下标 >= 0）。画线那一次 x 轴标签要带
    // 时间（MM-DD HH:mm），否则同一天多点的标签重复会让 markLine 落到错的位置。
    const nv29Idx = shouldDrawNv29Line(list, nv29)
    const dateLabelFmt = nv29Idx >= 0 ? 'MM-DD HH:mm' : 'MM-DD'
    list.forEach((value: any) => {
      const { timestamp } = value
      dateList.push(formatDateTime(timestamp, dateLabelFmt))
      power_trend.list.forEach((item: any) => {
        // 同一轴上的系列共用一个单位（按该轴数据量级定档）
        const unit = units[item.yIndex] || units[0]
        const rawVal = value[item.dataIndex]
        seriesObj[item.dataIndex].push({
          // 绘图值：同一轴同一单位，保留 6 位小数（不插值、不平滑）
          value: scaleToPowerUnit(rawVal, unit, 6),
          // tooltip 值：同口径单位，但小数值自动补足小数位，不显示成 0
          amount: scaleToPowerUnitForDisplay(rawVal, unit, 2),
          unit,
          showTime: formatDateTime(timestamp, 'YYYY-MM-DD HH:mm'),
        })
      })
    })
    // NV29 解释层竖线（照抄 DCCTrend.tsx 的 markLine 写法），挂到 series[0]（有效算力线）
    let nv29Line: any = null
    if (nv29Idx >= 0) {
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
          formatter: tr('power_trend_nv29_line'),
        },
        data: [{ xAxis: dateList[nv29Idx] }],
      }
    }
    power_trend.list.forEach((item: any, i: number) => {
      legendList.push({
        name: item.dataIndex,
        color: item.color,
        type: item.type,
        tip: item.tip,
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
        // 四线两轴、无面积填充：不透传 stack / areaStyle（一律折线）
        ...(i === 0 && nv29Line ? { markLine: nv29Line } : {}),
      })
    })
    setAxisUnits(units)
    setOptions({ series: seriesData, xData: dateList, legendData: legendList })
  }

  const load = async () => {
    // 先按默认档位取数并立即出图（不等其它档位，避免慢档拖住首屏）
    const primary: any = await axiosData(
      apiUrl.line_trend,
      { interval: DEFAULT_TREND_INTERVAL },
      { flag: `power_trend_${DEFAULT_TREND_INTERVAL}` },
    )
    const nv29 = Number(primary?.nv29_epoch || 0) || 0
    const primaryList: any[] = primary?.list || []
    setListByInterval({ [DEFAULT_TREND_INTERVAL]: primaryList })
    setIntervalCounts({ [DEFAULT_TREND_INTERVAL]: primaryList.length })
    setNv29Epoch(nv29)
    setActiveInterval(DEFAULT_TREND_INTERVAL)
    buildOptions(primaryList, nv29)
    // 其余档位后台预取：用于「点数不足置灰」+ 切档即出图；不阻塞首屏。
    // 每档用独立 flag（取消键变成 method:url_flag），四档并发互不取消。
    TREND_INTERVALS.filter((iv) => iv !== DEFAULT_TREND_INTERVAL).forEach(
      async (iv) => {
        const res: any = await axiosData(
          apiUrl.line_trend,
          { interval: iv },
          { flag: `power_trend_${iv}` },
        )
        const list: any[] = res?.list || []
        setListByInterval((prev) => ({ ...prev, [iv]: list }))
        setIntervalCounts((prev) => ({ ...prev, [iv]: list.length }))
        const resNv29 = Number(res?.nv29_epoch || 0) || 0
        if (resNv29 > 0) setNv29Epoch((prev) => prev || resNv29)
      },
    )
  }

  const changeInterval = async (value: string) => {
    setActiveInterval(value)
    // 已缓存（预取过）直接出图
    if (listByInterval[value]) {
      buildOptions(listByInterval[value])
      return
    }
    // 未缓存（预取失败/新增档位）：按需请求该档位再出图
    const res: any = await axiosData(
      apiUrl.line_trend,
      { interval: value },
      { flag: `power_trend_${value}` },
    )
    const list: any[] = res?.list || []
    setListByInterval((prev) => ({ ...prev, [value]: list }))
    setIntervalCounts((prev) => ({ ...prev, [value]: list.length }))
    buildOptions(list)
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
            <span className="ml-1 inline-flex items-center align-middle [&_svg]:inline-block [&_svg]:align-middle">
              <Tooltip context={tr('power_trend_tip')} />
            </span>
          </div>
          <div className="w-fit">
            <BrowserView>
              <span className="ml-5 flex gap-x-4">
                {options?.legendData?.map((v: any) => {
                  return (
                    <span
                      className="flex cursor-pointer items-center gap-x-1 text-xs"
                      key={v.name}
                      title={v.tip ? tr(v.tip) : undefined}
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
        {/* 档位控件按 origin 分岔（产品 2026-10-09 更正）：首页＝下拉（合约交易同款），
            数据统计页＝原并排 Segmented 按钮；两者共用同一份 interval 状态与
            changeInterval / unavailableIntervals 逻辑，仅控件本身不同。 */}
        {origin === 'home' ? (
          <Select
            ns="static"
            options={power_trend_intervals}
            value={activeInterval}
            disabledKeys={unavailableIntervals}
            disabledTip="power_trend_data_unavailable"
            onChange={(value: string) => changeInterval(value)}
          />
        ) : (
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
                        title={v.tip ? tr(v.tip) : undefined}
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
                      title={v.tip ? tr(v.tip) : undefined}
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
            <EChart options={newOptions} />
          </div>
        </div>
      </MobileView>
    </div>
  )
})
