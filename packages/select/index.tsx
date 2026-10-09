/** @format */

import { Translation } from '@/components/hooks/Translation'
import { Option_Item } from '@/contents/type'
import { useEffect, useState } from 'react'
import { getSvgIcon } from '@/svgsIcon'

export default ({
  options,
  ns = 'home',
  onChange,
  header,
  wrapClassName,
  className,
  value,
  suffix,
  optionsCard,
  disabledKeys,
  disabledTip,
}: {
  ns: string
  options?: Array<Option_Item>
  optionsCard?: JSX.Element
  onChange: (value: string) => void
  header?: JSX.Element
  wrapClassName?: string
  value?: string | undefined
  className?: string
  suffix?: JSX.Element
  /** 不可选的档位（如测试网 1 年档无历史数据）：置灰且不响应点击；不传 = 行为完全不变 */
  disabledKeys?: string[]
  /** 置灰档位的悬停提示（i18n key，走 ns 命名空间）；仅 disabledKeys 命中时生效 */
  disabledTip?: string
}) => {
  const { tr } = Translation({ ns })
  const [showLabel, setShowLabel] = useState('')
  const [active, setActive] = useState(value)

  useEffect(() => {
    if (value && Array.isArray(options)) {
      const file = options.find((v) => v.value === value)
      setActive(value)
      if (file) setShowLabel(file?.label)
    } else if (options && options.length > 0) {
      setShowLabel(options[0]?.label)
      setActive(options[0]?.value)
    }
  }, [options, value])

  const handleClick = (item: Option_Item) => {
    setShowLabel(item.label)
    setActive(item.value)
    onChange(item.value)
  }

  return (
    <div
      className={`group relative flex h-fit w-fit cursor-pointer items-center rounded-[5px]  ${wrapClassName}`}
    >
      {header ? (
        header
      ) : (
        <span className="des_bg_color border_color flex !h-8 w-full min-w-[82px] items-center justify-between gap-x-2 rounded-[5px] border px-2 font-HarmonyOS  text-xs font-medium">
          {tr(showLabel)}
          {getSvgIcon('downIcon')}
        </span>
      )}

      <ul
        style={{ padding: '15px' }}
        className={`select_shadow border_color invisible absolute inset-y-full z-10 h-fit w-max list-none rounded-[5px]  border  group-hover:visible ${className}`}
      >
        {Array.isArray(options) &&
          options?.map((item) => {
            const isDisabled = !!disabledKeys?.includes(item.value)
            return (
              <li
                onClick={() => {
                  // 置灰档位（如测试网历史数据不足的 1 年档）：不响应点击，行为与 Segmented 一致
                  if (isDisabled) return
                  handleClick(item)
                }}
                key={item.value}
                title={isDisabled && disabledTip ? tr(disabledTip) : undefined}
                className={`rounded-[5px] p-2 ${
                  isDisabled
                    ? 'cursor-not-allowed opacity-40'
                    : 'cursor-pointer hover:text-primary'
                } ${
                  item.value === active && !isDisabled
                    ? 'bg-bg_hover text-primary'
                    : ''
                }`}
              >
                {tr(item.label)}
              </li>
            )
          })}
        {optionsCard && optionsCard}
      </ul>
    </div>
  )
}
