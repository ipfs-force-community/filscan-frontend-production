import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import logo from '@/assets/images/logo.png'
import { assetPrefix } from '@/contents/apiUrl'

interface Props {
  link: string
}
// 二维码中央 Logo 跟随 NEXT_PUBLIC_ASSET_PREFIX 配置：配置了资源前缀（OSS/CDN）→ 使用 {前缀}/logo.ico；留空 → 使用本地 /favicon.ico
const qrLogo = assetPrefix ? `${assetPrefix}/logo.ico` : '/favicon.ico'
export default function QRCodePage(props: Props) {
  const { link } = props
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<any>(null)

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        // 生成二维码数据
        const qrCodeData: string = await QRCode.toDataURL(link, { margin: 3 })
        // 加载Logo图片
        const logoImage = new Image()
        logoImage.crossOrigin = 'anonymous'
        logoImage.src = qrLogo
        // 在Canvas上绘制二维码和Logo图片
        const canvas: any = canvasRef.current
        const context = canvas.getContext('2d')
        const qrCodeImage = new Image()
        qrCodeImage.crossOrigin = 'anonymous'
        qrCodeImage.src = qrCodeData
        qrCodeImage.onload = () => {
          context.drawImage(qrCodeImage, 0, 0, canvas.width, canvas.height)
          setTimeout(() => {
            const dataUrl = canvas.toDataURL()
            imgRef.current.style.width = '110px'
            imgRef.current.src = dataUrl
            canvas.style.display = 'none'
          })
        }
      } catch (error) {
        console.error('生成二维码时出错：', error)
      }
    }

    generateQRCode()
  }, [link, imgRef.current])

  return (
    <>
      <img ref={imgRef} width={0} height={0} className="rounded-md" />
      <canvas ref={canvasRef} width={100} height={100} className="rounded-md" />
    </>
  )
}
