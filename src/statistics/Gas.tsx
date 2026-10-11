/** @format */
import { useState, useMemo, useEffect } from 'react'
import { Translation } from '@/components/hooks/Translation'
import { getColor, get_xAxis, seriesArea } from '@/utils/echarts'
import EChart from '@/components/echarts'
import { apiUrl } from '@/contents/apiUrl'
import { formatFil, formatFilNum, formatNumber } from '@/utils'
import useAxiosData from '@/store/useAxiosData'
import useWindow from '@/components/hooks/useWindown'
import filscanStore from '@/store/modules/filscan'
import { observer } from 'mobx-react'

interface Props {
  active?: string
  className?: string
}

//仅含基础费
const showData: any = [
  {
    label: 'base_fee',
    type: 'line',
    unit: 'nanoFIL',
  },
]

function Gas(props: Props) {
  const { theme, lang } = filscanStore
  const { tr } = Translation({ ns: 'static' })
  const { active = '24h', className = '' } = props
  const [value, setValue] = useState(active)
  const { axiosData } = useAxiosData()
  const [unit, setUnit] = useState('')
  const { isMobile } = useWindow()

  const color = useMemo(() => {
    return getColor(theme)
  }, [theme])

  const default_xAxis = useMemo(() => {
    return get_xAxis(theme, isMobile)
  }, [theme, isMobile])

  const defaultOptions: any = useMemo(() => {
    let options = {
      yAxis: {
        type: 'value',
        //scale: true,
        axisLabel: {
          fontFamily: 'HarmonyOS_Regular',
          fontSize: 14,
          color: isMobile ? color.mobileLabelColor : color.labelColor,
          formatter(v: any) {
            return formatNumber(v) + '' + unit
          },
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: color.lineStyle,
          },
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
        show: false, // 设置图例不显示
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: color.toolbox,
        borderColor: 'transparent',
        textStyle: {
          color: '#ffffff',
        },
        formatter(v: any) {
          var result = v[0].data.timestamp || v[0].name
          v.forEach((item: any, index: number) => {
            if (item.data) {
              result +=
                '<br/>' +
                item.marker +
                tr(item.seriesName) +
                ': ' +
                item.data.showValue +
                ' ' +
                item.data.showUnit
            }
          })
          return result
        },
      },
    }

    if (isMobile) {
      ;(options as any)['grid'] = {
        top: '5%',
        right: '20px',
        bottom: '0%',
        left: '12px',
        containLabel: true,
      }
    }
    return options
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, isMobile, unit])

  const [options, setOptions] = useState<any>()

  useEffect(() => {
    setValue(active)
    load(active)
  }, [active])

  const load = (inter?: string) => {
    const interval = inter || value
    const dateList: Array<string> = []
    const seriesObj: any = {
      base_fee: [],
    }
    const newOpt: any = {}
    let maxGas: number = 0
    let showUnit = ''
    axiosData(apiUrl.static_gas, { interval }).then((res: any) => {
      res?.list?.forEach((vItem: any) => {
        const { timestamp, base_fee, gas_in_32g, gas_in_64g } = vItem
        maxGas = maxGas > Number(base_fee) ? maxGas : Number(base_fee)
      })
      if (maxGas) {
        showUnit = formatFilNum(maxGas, false, false, 4, false).split(' ')[1]
        setUnit(showUnit)
      }
      res?.list?.forEach((dataItem: any) => {
        const { timestamp, base_fee, gas_in_32g, gas_in_64g } = dataItem
        let showTime: string = ''
        if (value === '24h') {
          const newTime = timestamp.split(' ')[1]
          showTime = newTime.split(':')[0] + ':' + newTime.split(':')[1]
        } else {
          showTime = timestamp.split('+')[0]
        }
        dateList.push(showTime)
        seriesObj.base_fee.push({
          value: formatFil(base_fee, showUnit),
          showValue: formatFilNum(base_fee, false, false, 4, false).split(
            ' ',
          )[0],
          showUnit: formatFilNum(base_fee, false, false, 4, false).split(
            ' ',
          )[1],
          timestamp: timestamp.split('+')[0],
        })
      })
      newOpt.xData = dateList
      newOpt.series = []
      showData.forEach((item: any) => {
        newOpt.series.push({
          type: item.type,
          ...seriesArea,
          data: seriesObj[item.label],
          name: item.label,
          smooth: false,
          yAxisIndex: item.yIndex,
          symbol: 'none',
          unit: item.unit,
        })
      })
      setOptions({ ...newOpt })
    })
  }

  const newOptions = useMemo(() => {
    return {
      ...defaultOptions,
      xAxis: {
        ...default_xAxis,
        data: options?.xData || [],
      },
      series: options?.series || [],
    }
  }, [options, defaultOptions])

  return (
    <div className={`h-full w-full ${className}`}>
      <EChart options={newOptions} />
    </div>
  )
}

export default observer(Gas)
