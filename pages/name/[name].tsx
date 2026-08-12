import { Translation } from '@/components/hooks/Translation'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import Image from '@/packages/image'
import Link from 'next/link'
import useAxiosData from '@/store/useAxiosData'
import { apiUrl, resolveStaticUrl } from '@/contents/apiUrl'

export default () => {
  const { tr } = Translation({ ns: 'domain' })
  const router = useRouter()
  const { axiosData } = useAxiosData()
  const [data, setData] = useState<any>({})

  const [address, type] = useMemo(() => {
    const new_owner = router.query?.name || ''
    const new_type = router.query?.type || ''
    return [new_owner, new_type]
  }, [router.query])

  useEffect(() => {
    // domain detail
    if (address) {
      axiosData(apiUrl.contract_domain_address, {
        address: address,
        type,
      }).then((res: any) => {
        setData(res)
      })
    }
  }, [address])

  return (
    <div className="main_contain">
      <div className="flex items-center gap-x-2 font-HarmonyOS_Bold text-lg">
        <span>{tr('Result_for')}:</span>
        <span>{address}</span>
      </div>
      <div className="card_shadow border_color mt-5 rounded-[12px] border p-5">
        <div className="ml-2.5 font-HarmonyOS_Medium text-base">
          {' '}
          {tr('allDomains', { value: data?.domains?.length })}
        </div>
        <ul className="mt-5">
          {data?.domains?.map((item: any, index: number) => {
            return (
              <li key={index} className="flex items-center gap-x-2 p-2.5">
                {item.logo && (
                  <Image
                    width={35}
                    height={35}
                    src={resolveStaticUrl(item.logo)}
                    alt=""
                  />
                )}
                <Link
                  key={item}
                  href={`/domain/${item.domain}?provider=${item.provider}`}
                >
                  {item.domain || ''}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
