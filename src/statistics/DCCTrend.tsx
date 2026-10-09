/** @format */
// 已下线（已合并进「算力走势」）。恢复方式＝把本组件挂回 pages/statistics/charts/index.tsx
// 并在侧栏（contents/statistic.tsx 的 chartsNav）加回 blockChain_cc_dc_power 条目。
import { DCTrend } from '@/contents/apiUrl'
import EChart from '@/components/echarts'
import { Translation } from '@/components/hooks/Translation'
import { power_tier_trend, timeList } from '@/contents/statistic'
import { formatDateTime, unitConversion } from '@/utils'
import { getColor, get_xAxis, seriesChangeArea } from '@/utils/echarts'
import { useEffect, useMemo, useState } from 'react'
import styles from './DCCTrend.module.scss'
import classNames from 'classnames'
import useAxiosData from '@/store/useAxiosData'
import Segmented from '@/packages/segmented'
import useWindow from '@/components/hooks/useWindown'
import filscanStore from '@/store/modules/filscan'
import { observer } from 'mobx-react'

interface Props {
  origin?: string
  className?: string
}

// 已按 NV29（Solstice / FIP-0118，主网高度 6,470,279）改造：本图 = 「算力倍数结构走势」。
// 两条线不再用 DC/CC（datacap 冻结后该口径失效），字段由 DCTrend 响应直接给出，
// 口径唯一实现在后端 chain.QualityTierSplit（NV29 前后同式，历史不重算）：
//   full_multiplier_power  ＝ 满倍率算力（处于 10× 档的等效原始字节）
//   pending_upgrade_power  ＝ 可升级算力（未达满倍率的等效原始字节，SP 可主动升到 10×）
// 前端不重算该公式（避免两处口径分叉）；raw / quality_adj_power 仍随响应返回，供查证。
// 恢复方式（一行）：把 contents/statistic.tsx 的 power_tier_trend 两条线 dataIndex 改回 cc/dc，
// 并在 i18n 恢复 dc_trend / cc_trend，即回到旧的 CC/DC 口径（组件本体保留，未删）。
export default observer((props: Props) => {
  const { className } = props
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
        scale: true,
        nameTextStyle: {
          color: color.textStyle,
        },
        axisLabel: {
          formatter: '{value} PiB',
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
        // NV29 改造：原来 legend.show=false，用户只能靠颜色猜哪条是 DC/CC；改为常显图例。
        show: true,
        top: 0,
        textStyle: {
          color: isMobile ? color.mobileLabelColor : color.labelColor,
        },
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
                item.seriesName +
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
  }, [theme, isMobile])

  useEffect(() => {
    load()
  }, [])

  const load = async (time?: string) => {
    const seriesObj: any = {}
    power_tier_trend.list.forEach((v) => {
      seriesObj[v.dataIndex] = []
    })
    const dateList: any = []
    const seriesData: any = []
    const inter = time || interval
    const result: any = await axiosData(DCTrend, { interval: inter })

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

      // 口径唯一实现在后端 chain.QualityTierSplit（NV29 前后同式），前端只渲染：
      //   full_multiplier_power ＝ 满倍率算力（处于 10× 档的等效原始字节）
      //   pending_upgrade_power ＝ 可升级算力（未达满倍率的等效原始字节，SP 可主动升到 10×）
      power_tier_trend.list.forEach((item: any) => {
        const val = Number(value[item.dataIndex]) || 0
        const [amount, unit] = unitConversion(val, 2)?.split(' ') || []
        seriesObj[item.dataIndex].push({
          amount,
          value: Number(unitConversion(val, 2, 5).split(' ')[0]),
          showTime: formatDateTime(block_time, 'YYYY-MM-DD HH:mm'),
          unit,
        })
      })
    })

    // NV29 竖线（照抄 RewardStreams.tsx 的 nv29Line 实现）：
    // 仅在**窗口跨越激活高度**时画线（窗口首点早于 nv29 且窗口内存在 ≥ nv29 的点）——
    // 否则本窗口全部在 NV29 之后，画在左边缘会被误读成「NV29 在本窗口起点激活」。
    // nv29_epoch == 0（主网尚未排期）不画线。
    let nv29Line: any = null
    if (nv29 > 0 && items.length) {
      const idx = items.findIndex((v: any) => Number(v.epoch) >= nv29)
      const straddles = idx >= 0 && Number(items[0].epoch) < nv29
      if (straddles) {
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
            formatter: tr('power_multiplier_nv29_line'),
          },
          data: [{ xAxis: dateList[idx] }],
        }
      }
    }

    power_tier_trend.list.forEach((item: any, i: number) => {
      seriesData.push({
        type: item.type,
        // ...seriesChangeArea,
        data: seriesObj[item.dataIndex],
        name: tr(item.title),
        symbol: 'circle',
        smooth: true,
        itemStyle: {
          color: item.color,
        },
        barMaxWidth: '30',
        ...(i === 0 && nv29Line ? { markLine: nv29Line } : {}),
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
    <div
      // id='block_reward_per'
      className={classNames(styles.wrap, `h-[full] w-full  ${className}`)}
    >
      <div
        className={classNames(
          'mx-2.5 mb-4 flex flex-1  flex-row flex-wrap items-center justify-between',
          styles['title-wrap'],
        )}
      >
        <div
          className={classNames(
            'w-fit min-w-[120px] font-HarmonyOS text-lg font-semibold ',
            styles.title,
          )}
        >
          {tr('power_multiplier_trend')}
        </div>
        <Segmented
          defaultValue={interval}
          data={timeList}
          ns="static"
          isHash={false}
          onChange={(value) => {
            setInterval(value)
            load(value)
          }}
        />
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
