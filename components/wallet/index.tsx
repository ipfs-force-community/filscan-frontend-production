import { Button, Modal } from 'antd'
import { useEffect, useState } from 'react'
import Image from '@/packages/image'
import style from './index.module.scss'
import { addNetwork, connect_account, getNetWork } from '@/store/wallet'
import { LogoutOutlined } from '@ant-design/icons'
import { isIndent } from '@/utils'
import walletStore from '@/store/modules/wallet'
import { staticUrl } from '@/contents/apiUrl'

const WalletList = [
  {
    label: 'TokenPocket',
    value: 'TokenPocket',
    url: 'https://chrome.google.com/webstore/detail/tokenpocket/mfgccjchihfkkindfppnaooecgfneiii',
    icon: staticUrl + '/images/TokenPocket.png',
  },
  {
    label: 'MetaMask',
    value: 'MetaMask',
    url: 'https://metamask.io/',
    icon: staticUrl + '/images/MetaMask.png',
  },
]

function Wallet() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { wallet, account } = walletStore
  useEffect(() => {
    const objValue = JSON.parse(localStorage?.getItem('wallet') || '{}')
    const handleAccountsChanged = (accounts: any, other: any) => {
      if (objValue?.account !== account) {
        //退出登录
        localStorage.removeItem('wallet')
        window.location.reload()
      } else if (objValue?.account) {
        walletStore.setWallet(objValue)
        localStorage.setItem('wallet', JSON.stringify(objValue))
      }
    }

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged)
    } else {
      console.log('=不支持钱包 || 未下载钱包')
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      }
    }
  }, [])

  useEffect(() => {
    const objValue = JSON.parse(localStorage?.getItem('wallet') || '{}')
    const new_wallet = {
      wallet: objValue?.wallet || '',
      account: objValue?.account || '',
    }
    walletStore.setWallet(new_wallet)
  }, [])

  const handleClick = async (item: any) => {
    if (item.value === 'TokenPocket') {
      if (!window?.ethereum?.isTokenPocket) {
        //dowm wallet
        window.open(item.url)
        window.location.reload()
      }
    }
    if (!window.ethereum) {
      //未连接钱包
      console.log('=不支持钱包 || 未下载钱包')
      return window.open('https://metamask.io/')
    }

    const chainId = await getNetWork()
    let account: any = ''
    if (!chainId) {
      // 切换网络
      const res = await addNetwork()
      if (res) {
        account = await connect_account()
      }
    } else {
      account = await connect_account()
    }
    const new_wallet = {
      wallet: item.value,
      account,
    }
    localStorage.setItem('wallet', JSON.stringify(new_wallet))
    walletStore.setWallet(new_wallet)
    setIsModalOpen(false)
  }

  const handleClickOut = () => {
    localStorage.removeItem('wallet')
    walletStore.setWallet({
      wallet: '',
      account: '',
    })
  }

  return (
    <>
      {account ? (
        <div>
          <div className="mt-4 flex items-center gap-x-2 ">
            <span
              className="border_color w-fit cursor-pointer rounded-[5px] border px-4 py-2"
              onClick={() => {
                window.open(`https://filscan.io/address/${account}/`)
              }}
            >
              {`Connected - Web3 [${isIndent(account, 4)}]`}
            </span>
            <span
              className="border_color flex h-9 w-9 items-center justify-center rounded-[5px] border"
              onClick={handleClickOut}
            >
              <LogoutOutlined rev={undefined} />
            </span>
          </div>
        </div>
      ) : (
        <Button
          className="mt-4 flex cursor-pointer items-center justify-center px-4 py-2.5 !text-primary"
          onClick={() => setIsModalOpen(true)}
        >
          Connect Wallet
        </Button>
      )}
      <Modal
        title="Connect a Wallet"
        className="custom_modal"
        width={600}
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
      >
        <div className={style.wallet_des}>
          {`Connecting wallet for read function is optional, useful if you want to call certain functions or simply use your wallet's node.`}
        </div>
        {WalletList.map((wallet_Item: any) => {
          return (
            <div
              className={style.wallet_item}
              key={wallet_Item.value}
              onClick={() => handleClick(wallet_Item)}
            >
              <Image
                className={style.wallet_item_image}
                src={wallet_Item.icon}
                width={25}
                height={25}
                alt=""
              />
              <span className={style.wallet_item_name}>
                {wallet_Item.label}
              </span>
            </div>
          )
        })}
      </Modal>
    </>
  )
}

export default Wallet
