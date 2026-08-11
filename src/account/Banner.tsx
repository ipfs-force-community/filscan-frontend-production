import accountBg from '@/assets/images/accountBg.png'
import accountMain from '@/assets/images/accountMain.png'
import Image from 'next/image'
import { Translation } from '@/components/hooks/Translation'

export default () => {
  const { tr } = Translation({ ns: 'common' })

  return (
    <div className="relative h-[320px] w-full bg-accountBg">
      <Image src={accountBg} alt="" className="h-[320px]" />
      <div className="absolute left-[50%] top-[50%] flex w-full  max-w-[1440px] -translate-x-1/2 -translate-y-1/2 justify-between	px-[70px]">
        <div className="ml-[90px] flex flex-col justify-center text-5xl  text-white">
          {tr('account_banner_bg')}
          <div className=" mt-4	text-xl text-gray-400">
            {tr('account_banner_main')}
          </div>
        </div>
        <Image src={accountMain} alt="" className=" h-[280px] w-auto" />
      </div>
      <div></div>
    </div>
  )
}
