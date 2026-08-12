import styles from './style.module.scss'
import { observer } from 'mobx-react'
import { Carousel, Image } from 'antd'
import useAxiosData from '@/store/useAxiosData'
import { useEffect, useRef, useState } from 'react'
import useWindow from '@/components/hooks/useWindown'
import { apiUrl, resolveStaticUrl } from '@/contents/apiUrl'
import filscanStore from '@/store/modules/filscan'

const Banner = (props: any) => {
  const { axiosData } = useAxiosData()
  const { lang } = filscanStore
  const [data, setData] = useState([])
  const { isMobile } = useWindow()
  useEffect(() => {
    loadBanner()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, isMobile])

  const loadBanner = async () => {
    const result: any = await axiosData(
      apiUrl.home_banner,
      {
        category: 'mobile_home',
        language: lang || 'zh',
      },
      { isCancel: false },
    )
    setData(result?.items || [])
  }

  return (
    <div className={styles.banner}>
      <Carousel>
        {data?.map((item: any, index) => {
          return (
            <div
              key={index}
              onClick={() => {
                if (item.link) {
                  window.open(item.link)
                }
              }}
            >
              <Image
                preview={false}
                src={resolveStaticUrl(item.url)}
                alt=""
                width="100%"
                className="carousel-image cursor-pointer rounded-[6px] object-cover"
              />
            </div>
          )
        })}
      </Carousel>
    </div>
  )
}

export default observer(Banner)
