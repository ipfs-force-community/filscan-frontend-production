import React, { useEffect, useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { Button, Modal } from 'antd'
import Image from 'next/image'
import fvmBg from '@/assets/images/fvmBg.png'
import fvm from '@/assets/images/fvm.png'
import code from '@/assets/images/fevmCode.png'
import style from './index.module.scss'
import { Translation } from '@/components/hooks/Translation'
import { staticUrl, resolveStaticUrl } from '@/contents/apiUrl'

function Share({ data, title }: { data: any; title: string }) {
  const myRef = useRef<any>()
  const [open, setOpen] = useState(false)
  const { tr } = Translation({ ns: 'common' })

  const [content, setContent] = useState<Record<string, Array<any>>>({})

  const handleScreenshot = () => {
    html2canvas(myRef.current, {
      useCORS: true,
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = imgData
      link.download = `filscan-fvm.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
  }

  useEffect(() => {
    if (title === 'all') {
      const newObj: any = {}
      ;(data || []).forEach((v: any) => {
        newObj[v.detail] = newObj[v.detail] || []
        newObj[v.detail].push(v)
      })
      setContent(newObj)
    } else {
      setContent({
        [title]: data,
      })
    }
  }, [data, title])

  return (
    <>
      <Button
        className="cancel_btn   mt-20 !w-full"
        onClick={() => {
          window.open('https://forms.gle/iZNQTZdLzv3sZxiK7')
        }}
      >
        <span className="!text-primary"> {tr('add_project')}</span>
      </Button>
      <Button
        className="primary_btn  mt-4 !w-full cursor-pointer"
        onClick={() => setOpen(true)}
      >
        {tr('fvm_share')}
      </Button>
      <Modal
        open={open}
        width={765}
        closeIcon={false}
        footer={null}
        wrapClassName="noPaddingModal"
        onCancel={() => {
          setOpen(false)
        }}
      >
        <div className={style.shareFvm}>
          <div className={style.shareFvmContent}>
            <div className={style['shareFvmContent-main']} ref={myRef}>
              <Image
                className={style['shareFvmContent-bg']}
                src={fvmBg}
                width={765}
                alt=""
              />
              <div className={style['shareFvmContent-header']}>
                <div className="flex items-center gap-x-2">
                  <Image
                    src={staticUrl + '/images/logo.png'}
                    width={60}
                    height={60}
                    alt="logo"
                  />
                  <Image
                    src={staticUrl + '/images/logoText.png'}
                    alt="logo"
                    width={142}
                    height={24}
                  ></Image>
                </div>
                <Image src={fvm} alt="" width={190} className="mt-[20px]" />
              </div>
              <div className={style['shareFvmContent-content']}>
                {Object.keys(content).map((key) => {
                  return (
                    <div key={key}>
                      <div
                        className={style['shareFvmContent-content-title']}
                      >{`${key} (${content[key].length})`}</div>
                      {content[key] && content[key].length > 0 && (
                        <ul className={style['shareFvmContent-content-main']}>
                          {content[key].map((item, index) => {
                            return (
                              <li
                                key={index}
                                className={
                                  style['shareFvmContent-content-item']
                                }
                              >
                                <Image
                                  src={resolveStaticUrl(item.logo)}
                                  alt=""
                                  width={36}
                                  height={36}
                                  className="h-9 w-9 rounded-full"
                                />
                                <div
                                  className={
                                    style['shareFvmContent-content-item-name']
                                  }
                                >
                                  <span className="font-medium">
                                    {item?.name || ''}
                                  </span>
                                  <span
                                    className={
                                      style[
                                        'shareFvmContent-content-item-name-des'
                                      ]
                                    }
                                  >
                                    {item?.detail || ''}
                                  </span>
                                </div>
                              </li>
                            )
                          })}
                        </ul>
                      )}
                    </div>
                  )
                })}
              </div>
              <div className={style['shareFvmContent-footer']}>
                <div className={style['shareFvmContent-footer-text']}>
                  <div>{tr('footer_des1')}</div>
                  <div>{tr('footer_des2')}</div>
                </div>
                <div className={style['shareFvmContent-footer-code']}>
                  <Image src={code} alt="" width={100} />
                </div>
              </div>
            </div>
          </div>
          <div className={style['shareFvm-save']}>
            {/* <Button className="cancel_btn">{tr('add_project')}</Button> */}
            {/* <div
              className={`primary_btn m-auto !w-[220px] cursor-pointer`}
              onClick={handleScreenshot}
            >
              {tr('save_pic')}
            </div> */}
            <div
              className={`primary_btn m-auto !w-[220px] cursor-pointer`}
              onClick={handleScreenshot}
            >
              {tr('save_pic')}
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default Share
