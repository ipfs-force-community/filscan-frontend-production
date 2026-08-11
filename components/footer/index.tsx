/** @format */
import { Translation } from '../hooks/Translation'
import { getSvgIcon } from '@/svgsIcon'
import { BrowserView, MobileView } from '../device-detect'
import MFooter from '@/components/mobile/footer'
import codeImg from '@/assets/images/code.png'
import Image from 'next/image'
import { staticUrl } from '@/contents/apiUrl'

const footerLinks = [
  {
    label: 'twitter',
    type: '_blank',
    link: 'https://twitter.com/FilscanOfficial',
  },
  {
    label: 'telegram',
    type: '_blank',
    link: 'https://t.me/+bI9fUEkmPjMzYjg1',
  },
  {
    label: 'outlook',
    type: '_self',
    link: 'mailto:filscanteam@outlook.com',
  },
]

export default () => {
  const { tr } = Translation({ ns: 'common' })
  return (
    <>
      <MobileView>
        <MFooter />
      </MobileView>
      <BrowserView>
        <div className="h-[140px] w-screen bg-footerColor">
          <div className="custom_footer flex flex-col justify-between bg-footerColor">
            {/* <div className='!text-white flex items-center mt-4'>
             <IconLogo width={30} height={30} />
              <span className='font-Barlow font-medium text-xl ml-2'>Filscan.io </span>
            </div> */}
            <div
              //href={'/'}
              className="text_color flex cursor-pointer items-center gap-x-2"
            >
              <Image
                src={staticUrl + '/images/logo.png'}
                width={40}
                height={40}
                alt="logo"
              />
              {/* {getSvgIcon('logoText')} */}
              <Image
                src={staticUrl + '/images/logoText.png'}
                alt="logo"
                width={95}
                height={16}
              ></Image>
              {/* <span className='font-Barlow font-bold text-xl '>Filscan</span> */}
            </div>
            <div className="flex items-end justify-between	 text-border_des">
              <div className="flex flex-col gap-y-1 text-xs">
                <span>{tr('footer_des1')}</span>
                <span>{tr('footer_des2')}</span>
              </div>
              <div className="flex ">
                <div>
                  <ul className="flex justify-end gap-x-5 pr-[10px] text-white">
                    {footerLinks.map((linkItem) => {
                      return (
                        <a
                          key={linkItem.label}
                          className="h-5 w-5 rounded bg-white"
                          target={linkItem.type}
                          style={{ color: '#fff' }}
                          href={linkItem.link}
                        >
                          {getSvgIcon(linkItem.label)}
                        </a>
                      )
                    })}
                  </ul>
                  <div className="mt-5">filscanteam@outlook.com</div>
                </div>
                <div className="ml-4 flex h-[50] w-[50px] justify-center rounded-[5px] bg-white p-1">
                  <Image src={codeImg} alt="" width={50} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </BrowserView>
    </>
  )
}
