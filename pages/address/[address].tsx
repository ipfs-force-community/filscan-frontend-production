/** @format */

import Copy from '@/components/copy'
import { Translation } from '@/components/hooks/Translation'
import { TransMethod, apiUrl, tokenName } from '@/contents/apiUrl'
import { address_detail, address_tabs } from '@/contents/detail'
import { getProtocolActorInfo } from '@/contents/protocolActors'
import ProtocolActorNote from '@/src/nv29/ProtocolActorNote'
import Content from '@/packages/content'
import Segmented from '@/packages/segmented'
import AccountChange from '@/src/detail/accountChange'
import List from '@/src/detail/list'
import useAxiosData from '@/store/useAxiosData'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import styles from './index.module.scss'
import classNames from 'classnames'
import { BrowserView, MobileView } from '@/components/device-detect'
import CopySvgMobile from '@/assets/images/icon-copy.svg'
import { formatNumber, get$Number } from '@/utils'
import Image from '@/packages/image'
import Link from 'next/link'
import { getSvgIcon } from '@/svgsIcon'
import Loading from '@/components/loading'
import PendingMsg from '@/src/detail/list/PendingMsg'
/** @format */
export default () => {
  const router = useRouter()
  const { address } = router.query
  const { tr } = Translation({ ns: 'detail' })
  const { axiosData } = useAxiosData()
  const [data, setData] = useState<any>({})
  const [tokenList, setTokenList] = useState<Array<any>>([])
  const [verifyData, setVerifyData] = useState<any>({})
  const [accountType, setAccountType] = useState('')
  const [interval, setInterval] = useState('1m')
  const [methodOptions, setMethodOptions] = useState([])
  const [transOptions, setTransOptions] = useState([])
  const [tokenOptions, setTokenOptions] = useState([])
  const [pendingData, setPendingData] = useState({})
  const [actorId, setActorId] = useState('')
  const [loading, setLoading] = useState(false)
  const [domains, setDomains] = useState<any>({})

  useEffect(() => {
    setActorId('')
    setMethodOptions([])
    setInterval('1m')
    setAccountType('')
    if (address) {
      loadMethod()
      load()
      loadFnsDomain(address)
    }
  }, [address])

  const loadMethod = async () => {
    const result: any = await axiosData(
      apiUrl.detail_list_method,
      {
        account_id: address,
      },
      { isCancel: false },
    )
    const newMethod: any = [
      {
        label: 'all',
        value: 'all',
      },
    ]
    Object.keys(result?.method_name_list || {}).forEach((li: string) => {
      newMethod.push({ label: li, dataIndex: li, value: li })
    })
    setMethodOptions(newMethod)

    const result1: any = await axiosData(
      TransMethod,
      {
        account_id: address,
      },
      { isCancel: false },
    )
    const newTransMethod: any = [
      {
        label: 'all',
        value: 'all',
      },
    ]
    ;(result1?.method_name_list || [])?.forEach((li: string) => {
      newTransMethod.push({ label: li, dataIndex: li, value: li })
    })
    setTransOptions(newTransMethod)

    const result2 = await axiosData(tokenName, { address }, { isCancel: false })
    const newTokenMethod: any = [
      {
        label: 'all_token',
        value: 'all',
      },
    ]
    ;(result2?.token_names || [])?.forEach((li: string) => {
      newTokenMethod.push({ label: li, dataIndex: li, value: li })
    })
    setTokenOptions(newTokenMethod)
  }

  const load = async () => {
    setLoading(true)
    const result: any = await axiosData(
      apiUrl.detail_account,
      {
        account_id: address,
      },
      { isCancel: false },
    )
    setLoading(false)
    let baseResult: any = {}
    const mainType = result?.account_type || ''
    if (result?.account_info[`account_${mainType}`]) {
      baseResult = result?.account_info[`account_${mainType}`]
    } else {
      baseResult = result?.account_info
    }
    setData(baseResult)
    setAccountType(result?.account_type || '')
    if (result?.account_info?.account_basic?.account_id) {
      setActorId(result.account_info.account_basic.account_id)
    }
    if (baseResult?.account_basic?.account_id) {
      // 已被验证合约
      loadVerify(baseResult?.account_basic?.account_id)
    }
    if (typeof address === 'string') {
      // 增加代币列表
      let showErc20 = ''
      if (address.startsWith('0x')) {
        showErc20 = address
      } else if (baseResult?.account_basic?.eth_address?.startsWith('0x')) {
        showErc20 = baseResult?.account_basic?.eth_address
      } else {
        showErc20 = baseResult?.account_basic?.account_id
      }
      loadERC20TokenList(showErc20)
    }
  }

  //合约
  const loadVerify = async (id: string) => {
    const result = await axiosData(
      apiUrl.contract_verify_des,
      {
        input_address: id,
      },
      { isCancel: false },
    )
    setVerifyData({ ...result })
  }

  const loadERC20TokenList = async (id: string) => {
    const tokenList = await axiosData(apiUrl.contract_ERC20TokenList, {
      address: id,
    })
    const items: any = []
    if (
      tokenList &&
      Object.keys(tokenList).length > 0 &&
      tokenList?.items?.length > 0
    ) {
      const objTotal: any = {
        title: `$${formatNumber(
          tokenList?.total_value,
          4,
        )} (${tokenList?.total} Tokens)`,
        value: `$${tokenList?.total_value} (${tokenList?.total})`,
      }
      tokenList?.items?.forEach((t: any) => {
        if (t.amount) {
          const obj = {
            ...t,
            key: t.contract_id,
            value: t.contract_id,
            title: (
              <div className="mt-2.5 flex w-full cursor-pointer justify-between gap-x-2">
                <div className="flex items-center gap-x-2">
                  <Image src={t.icon_url} alt="" width={36} height={36} />
                  <span className="flex flex-col items-start">
                    <span>{t.token_name}</span>
                    <span> {formatNumber(t.amount, 4)} </span>
                  </span>
                </div>
                <span>{get$Number(t.value, 4)}</span>
              </div>
            ),
          }
          items.push(obj)
        }
      })
      setTokenList([objTotal, ...items])
    }
  }

  const loadFnsDomain = async (addr: string | string[]) => {
    const result = await axiosData(
      `${apiUrl.contract_fnsUrl}`,
      { addresses: [addr] },
      { isCancel: false },
    )
    setDomains(result)
  }

  const contentList = useMemo(() => {
    return address_detail.content(accountType)
  }, [accountType])

  const tabsList = useMemo(() => {
    let defaultOpt: any = []
    address_tabs.forEach((v: any) => {
      if (v?.optionsUrl === 'AllMethodByAccountID') {
        v.headerOptions = methodOptions
      }
      if (v?.optionsUrl === 'TransferMethodByAccountID') {
        v.headerOptions = transOptions
      }
      if (v?.optionsUrl === 'ERC20AddrTransfersTokenTypes') {
        v.headerOptions = tokenOptions
      }
      defaultOpt.push({ ...v })
    })

    let evmList: Array<any> = []
    if (verifyData && verifyData.source_file) {
      evmList = [
        {
          title:
            verifyData?.compiled_file &&
            Object.keys(verifyData?.compiled_file || {}).length > 0
              ? () => {
                  return (
                    <span className="flex items-center gap-x-2">
                      {getSvgIcon('successIcon')}
                      {tr('contract_verify')}
                    </span>
                  )
                }
              : tr('contract_verify'),
          dataIndex: 'contract_verify',
        },
        {
          title: 'event_log',
          dataIndex: 'event_log',
        },
      ]
    }
    return [...defaultOpt, ...evmList]
  }, [methodOptions, transOptions, tokenOptions, verifyData])

  if (loading) {
    return <Loading />
  }
  // NV29（FIP-0118）协议合约地址标签：SWA/SRA（常量表见 contents/protocolActors.ts）。
  // 只匹配 FEVM(0x) 形态；地址页若以 f0/f4 形态访问需链上解析，当前接口未提供，故不展示。
  const protocolActor =
    getProtocolActorInfo(typeof address === 'string' ? address : null) ||
    getProtocolActorInfo(data?.account_basic?.eth_address) ||
    getProtocolActorInfo(data?.eth_address)
  return (
    <div className={classNames(styles.address, 'main_contain')}>
      <div
        className={classNames(
          styles['address-row'],
          'HarmonyOS_Medium mb-2.5 ml-2.5 flex items-center text-lg font-medium',
        )}
      >
        <span className={styles.label}>{tr('account_title')}:</span>
        <MobileView>
          <span className="copy-row">
            <span className="normal-text">{address}</span>
            {address && typeof address === 'string' && (
              <Copy
                text={address}
                icon={<CopySvgMobile />}
                className="copy-lg"
              />
            )}
          </span>
        </MobileView>

        <BrowserView>
          <span
            className={classNames(
              styles.text,
              'ml-4 flex items-center gap-x-1',
            )}
          >
            <span>{address || ''}</span>
            {address && typeof address === 'string' && <Copy text={address} />}
          </span>
          {typeof address === 'string' &&
            domains?.domains &&
            domains?.domains[address] && (
              <Link
                className="ml-2"
                href={`/domain/${domains?.domains[address]}?provider=${domains.provider}`}
              >
                ({domains?.domains[address]})
              </Link>
            )}
        </BrowserView>
      </div>
      <ProtocolActorNote actor={protocolActor} />
      <div
        className={classNames(
          'card_shadow border_color flex items-center rounded-xl border p-7',
          styles.content,
        )}
      >
        <BrowserView>
          <Content
            contents={contentList}
            ns={'detail'}
            columns={2}
            data={{ ...data, tokenList }}
          />
        </BrowserView>
        <MobileView>
          <Content
            contents={contentList}
            ns={'detail'}
            columns={1}
            data={{ ...data, tokenList }}
          />
        </MobileView>
      </div>
      <AccountChange
        header={
          <div
            className="mx-2.5 mb-2.5 mt-5 flex items-center justify-between"
            key="detail_account_change"
          >
            <span className="HarmonyOS_Medium text-lg  font-medium">
              {tr('account_change')}
            </span>
            <Segmented
              data={address_detail.account_change.tabsList || []}
              ns="detail"
              defaultValue={interval}
              isHash={false}
              onChange={(value: string) => {
                setInterval(value)
              }}
            />
          </div>
        }
        accountId={address}
        interval={interval}
        list={address_detail.account_change.list}
      />
      <PendingMsg
        account_id={data?.account_basic?.account_id}
        account_address={data?.account_basic?.account_address}
      />
      <List
        tabList={tabsList}
        defaultActive="traces_list"
        accountId={address}
        actorId={actorId}
        verifyData={verifyData}
      />
    </div>
  )
}
