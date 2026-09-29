/** @format */

import { Translation } from '@/components/hooks/Translation'
import { useHash } from '@/components/hooks/useHash'
import { Item } from '@/contents/type'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import styles from './index.module.scss'
import { BrowserView, MobileView } from '@/components/device-detect'
function extractPathParam(route: string) {
  const match = route.match(/\[([^\]]+)\]/)
  return match ? match[1] : null
}

//分段控制器，添加锚点

export default ({
  data,
  defaultValue,
  ns,
  isHash = true,
  onChange,
  defaultActive,
  disabledKeys,
  disabledTip,
}: {
  data: Array<Item>
  defaultValue: string
  ns: string
  isHash: boolean
  defaultActive?: string
  /** 无数据的档位（如测试网 1y），置灰且不可点 */
  disabledKeys?: string[]
  /** 置灰档位的悬停提示（i18n key，走 ns 命名空间） */
  disabledTip?: string
  onChange?: (value: string) => void
}) => {
  const { tr } = Translation({ ns })
  const router = useRouter()
  const [active, setActive] = useState(defaultValue)

  useEffect(() => {
    setActive(defaultValue)
  }, [defaultValue])

  const handleClick = (event: any, tabId: string) => {
    // 在当前路由上添加锚点 '#section1'
    // const scrollPosition =
    //   window.pageYOffset || document.documentElement.scrollTop;
    event.preventDefault()
    setActive(tabId)
    if (onChange) onChange(tabId)
    if (isHash) {
      // 获取动态路由参数的名称
      const paramName: string | null = extractPathParam(router.pathname)
      // 获取动态路由参数的值
      const paramValue = paramName ? router.query[paramName] : null
      const newQuery = paramName ? { [paramName]: paramValue } : {}
      let newAsPath = paramValue
        ? `${router.pathname.split('[')[0]}${paramValue}#${tabId}`
        : `${router.pathname}#${tabId}`
      if (tabId === defaultActive) {
        newAsPath = newAsPath.split('#')[0]
      }
      router.push(
        {
          pathname: `${router.pathname}`,
          query: { ...newQuery },
        },
        newAsPath,
        {
          shallow: false,
          scroll: false,
        },
      )
    }
    // 恢复滚动条位置
    // window.scrollTo(0, scrollPosition);
  }

  return (
    <>
      <ul
        className={classNames(
          styles.segmented,
          'des_bg_color ml-2.5 flex h-fit w-fit list-none rounded-[5px] p-0.5',
        )}
      >
        {data.map((item: any) => {
          const { title } = item
          const isDisabled = !!disabledKeys?.includes(item.dataIndex)
          return (
            <li
              // href={hash ? `${pathValue}#${item.dataIndex}` : ''}
              key={item.dataIndex}
              title={isDisabled && disabledTip ? tr(disabledTip) : undefined}
              onClick={(e) => {
                if (isDisabled) {
                  // 无数据的档位（测试网历史数据不足）：置灰且不响应点击
                  e.preventDefault()
                  return
                }
                handleClick(e, item.dataIndex)
              }}
              className={classNames(
                `text_des_hover  flex h-7 w-fit items-center justify-center px-4 py-[5px] text-xs font-medium  ${
                  active === item.dataIndex
                    ? 'tab_shadow highlight  main_bg_color rounded-[5px]'
                    : ''
                } ${
                  isDisabled
                    ? 'cursor-not-allowed opacity-40'
                    : 'cursor-pointer'
                }`,
                styles.item,
              )}
              //id={item.dataIndex}
            >
              {typeof title === 'function' ? title() : tr(item.title)}
            </li>
          )
        })}
      </ul>
    </>
  )
}
