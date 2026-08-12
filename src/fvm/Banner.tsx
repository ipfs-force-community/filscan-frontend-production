import { Carousel, Image } from 'antd'
import { useEffect, useRef, useState } from 'react'
import useAxiosData from '@/store/useAxiosData'
import { apiUrl, resolveStaticUrl } from '@/contents/apiUrl'
import filscanStore from '@/store/modules/filscan'
import { observer } from 'mobx-react'

function Banner() {
  const { axiosData } = useAxiosData()
  const { theme, lang } = filscanStore
  const carousel = useRef<any>(null)
  const [data, setData] = useState([])

  useEffect(() => {
    loadBanner()
  }, [lang])

  const loadBanner = async () => {
    const result: any = await axiosData(apiUrl.home_banner, {
      category: 'metric_banner',
      language: lang || 'zh',
    })
    setData(result?.items || [])
  }

  if (data.length === 0) {
    return null
  }

  return (
    <div className="group relative mt-8 h-full w-full overflow-hidden px-2.5">
      <Carousel
        autoplay={true}
        autoplaySpeed={5000}
        ref={carousel}
        infinite={true}
      >
        {[...data]?.map((item: any, index) => {
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
                className="carousel-image cursor-pointer rounded-2xl object-cover"
              />
            </div>
          )
        })}
      </Carousel>
    </div>
  )
}

export default observer(Banner)
