const mainUrl = process.env.APP_BASE_URL
// const testUrl = 'http://192.168.19.80:17000/api/v1'
const proUrl =
  process.env.APP_BASE_URL_PRO || 'http://192.168.1.177:27000/pro/v1'

// 静态资源基地址（images 等资源的根目录），通过 .env 的 NEXT_PUBLIC_STATIC_URL 配置：
//   - 留空：使用本地资源（相对路径 /images/xxx，资源放 public/images 或由 nginx 提供）
//   - OSS：https://filscan-v2.oss-accelerate.aliyuncs.com/fvm_manage
//   - CDN：https://cdn.filscan.io/fvm_manage
export const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL || ''

// 构建产物（_next/*）资源前缀，通过 .env 的 NEXT_PUBLIC_ASSET_PREFIX 配置：
//   - 留空：使用本地（/_next/static/...，由 Next.js server 或 nginx 提供）
//   - OSS：https://filscan-v2.oss-accelerate.aliyuncs.com/client
//   - CDN：https://cdn.filscan.io/client
export const assetPrefix = process.env.NEXT_PUBLIC_ASSET_PREFIX || ''

// 后端接口返回的图片等资源 URL 可能指向 OSS（如 https://filscan-v2.oss-xxx.aliyuncs.com/fvm_manage/xxx），
// 此处统一按 NEXT_PUBLIC_STATIC_URL 配置重写：
//   - 配置 CDN/OSS 前缀 → 替换为对应前缀（如 https://cdn.filscan.io/fvm_manage/xxx）
//   - 留空（本地）→ 去掉 OSS 域名前缀，变为相对路径（如 /banner/xxx，由本地 public 提供）
const OSS_URL_PREFIX_RE = /^https:\/\/filscan-v2\.oss-(?:cn-hongkong|accelerate)\.aliyuncs\.com\/fvm_manage/

export function resolveStaticUrl(url?: string): string {
  if (!url) return ''
  // 本地相对路径 / data:/ blob: 等直接返回
  if (url.startsWith('/') || url.startsWith('data:') || url.startsWith('blob:')) return url
  const matched = url.match(OSS_URL_PREFIX_RE)
  if (matched) {
    return staticUrl + url.slice(matched[0].length)
  }
  // 非本 OSS 域名的外链（第三方图片等）原样返回
  return url
}

export interface API {
  home_meta: string
  line_trend: string
  static_gas: string
  rank_pool: string
  rank_provider: string
  tipset_chain: string
  tipset_message_opt: string
  tipset_message: string
}

export const proApi = {
  //登录注册
  mail_exists: proUrl + '/MailExists',
  resetPassword: proUrl + '/ResetPasswordByCode',
  send_code: proUrl + '/SendVerificationCode',
  byCode: proUrl + '/ResetPasswordByCode',
  login: proUrl + '/Login',
  userInfo: proUrl + '/UserInfo',
  updateInfo: proUrl + '/UpdateUserInfo',
  getOverview: proUrl + '/MinerInfoDetail',
  getGroups: proUrl + '/GetUserGroups',
  getGroupsId: proUrl + '/GetGroup',
  createGroup: proUrl + '/CreateGroup',
  saveGroup: proUrl + '/SaveGroupMiners',
  delGroup: proUrl + '/DeleteGroup',
  getLucky: proUrl + '/LuckyRateDetail',
  getBalance: proUrl + '/BalanceDetail',
  getReward: proUrl + '/RewardDetail',
  getGas: proUrl + '/GasCostDetail',
  getPower: proUrl + '/PowerDetail',
  getSector: proUrl + '/SectorDetail',
  account_miners: proUrl + '/CountUserMiners',
  saveMiner: proUrl + '/SaveUserMiners',
}
//account
export const heightDetail = mainUrl + '/TipsetDetail'
export const EvmContractSummary = mainUrl + '/EvmContractSummary'
export const EvmTxsHistory = mainUrl + '/EvmTxsHistory'
export const EvmGasTrend = mainUrl + '/EvmGasTrend'
export const ContractBalanceTrend = mainUrl + '/ContractBalanceTrend'
export const ContractUsersTrend = mainUrl + '/ContractUsersTrend'
export const ContractCntTrend = mainUrl + '/ContractCntTrend'
export const FilPrice = mainUrl + '/FilPrice'
export const FinalHeight = mainUrl + '/FinalHeight'
export const DCTrend = mainUrl + '/DCTrend'
export const TransMethod = mainUrl + '/TransferMethodByAccountID'
export const cwUrl = mainUrl + '/TipsetStateTree'

export const metaOther = mainUrl + '/BannerIndicator'
export const tokenName = mainUrl + '/ERC20AddrTransfersTokenTypes'
export const pendingMsg = mainUrl + '/PendingMsgByAccount'

export const apiUrl: API | any = {
  fvm_hot: mainUrl + '/GetFEvmHotItems',
  fvm_category: mainUrl + '/GetFEvmCategory',
  fvm_items: mainUrl + '/GetFEvmItemsByCategory',
  home_banner: mainUrl + '/GetBannerList',
  searchInfo: mainUrl + '/SearchInfo',
  home_meta: mainUrl + '/TotalIndicators',
  line_trend: mainUrl + '/BaseLineTrend',
  static_gas: mainUrl + '/BaseFeeTrend',
  static_gas_24: mainUrl + '/GasDataTrend',
  static_fil_chart: mainUrl + '/FilCompose',
  static_block_trend: mainUrl + '/BlockRewardTrend',
  static_active_miner: mainUrl + '/ActiveMinerTrend',
  static_message_trend: mainUrl + '/MessageCountTrend',
  rank_pool: mainUrl + '/OwnerRank',
  rank_provider: mainUrl + '/MinerRank',
  rank_growth: mainUrl + '/MinerPowerRank',
  rank_rewards: mainUrl + '/MinerRewardRank',
  tipset_chain: mainUrl + '/LatestBlocks',

  tipset_BlockDetails: mainUrl + '/BlockDetails',
  tipset_Block_messages: mainUrl + '/MessagesByBlock',
  tipset_message_opt: mainUrl + '/AllMethods',
  tipset_message_pool_opt: mainUrl + '/AllMethodsByMessagePool',
  tipset_block_message_opt: mainUrl + '/AllMethodsByBlock',
  tipset_message: mainUrl + '/LatestMessages',
  tipset_address: mainUrl + '/RichAccountRank',
  tipset_transfer: mainUrl + '/LargeTransfers',
  tipset_Dsn: mainUrl + '/SearchMarketDeals',
  tipset_pool: mainUrl + '/MessagesPool',
  detail_account: mainUrl + '/AccountInfoByID',
  detail_owner: mainUrl + '/AccountOwnerByID',
  detail_message: mainUrl + '/MessageDetails',
  detail_message_event: mainUrl + '/EventsInMessage',
  detail_message_trans: mainUrl + '/InternalTransfer',

  detail_miner_list: mainUrl,
  detail_list_method: mainUrl + '/AllMethodByAccountID',
  detail_message_list: mainUrl + '/MessagesByAccountID',
  detail_block_list: mainUrl + '/BlocksByAccountID',
  detail_trance_list: mainUrl + '/TracesByAccountID',
  detail_deal: mainUrl + '/DealDetails',
  account_change: mainUrl + '/BalanceTrendByAccountID',
  account_trend: mainUrl + '/PowerTrendByAccountID',
  detail_Indicators: mainUrl + '/IndicatorsByAccountID',
  contract_verify: mainUrl + '/VerifyContract',
  contract_hard_verify: mainUrl + '/VerifyHardhatContract',
  contract_verify_list: mainUrl + '/VerifiedContractList',
  contract_verify_logs: mainUrl + '/ActorEventsList',

  contract_rank: mainUrl + '/EvmContractList',
  contract_verify_des: mainUrl + '/VerifiedContractByActorID',
  contract_solidity: mainUrl + '/SolidityVersions',
  contract_Licenses: mainUrl + '/Licenses',

  contract_transferInMessage: mainUrl + '/ERC20TransferInMessage',
  contract_transferInMessageNft: mainUrl + '/NFTMessageTransfers',
  contract_swap: mainUrl + '/SwapInfoInMessage',
  contract_ERC20List: mainUrl + '/ERC20List',
  contract_ERC20TokenList: mainUrl + '/ERC20OwnerTokenList',

  contract_ERC20Transfer: mainUrl + '/ERC20Transfer',
  contract_ERC20Owner: mainUrl + '/ERC20Owner',
  contract_ERC20Dex: mainUrl + '/ERC20DexTrade',
  contract_NFTTransfers: mainUrl + '/NFTTransfers',
  contract_NFTOwners: mainUrl + '/NFTOwners',

  contract_ERC20Transfers: mainUrl + '/ERC20AddrTransfers',
  contract_ERC20Summary: mainUrl + '/ERC20Summary',
  contract_ERC20Market: mainUrl + '/ERC20Market',
  contract_detailList: mainUrl,
  contract_nfts: mainUrl + '/NFTTokens',
  contract_fnsUrl: mainUrl + '/FnsBindDomains',
  contract_FnsSummary: mainUrl + '/NFTSummary',
  contract_domain: mainUrl + '/FnsDomainDetail',
  contract_domain_address: mainUrl + '/FnsAddressDomains',

  fevm_defiSummary: mainUrl + '/DefiSummary',
  fevm_defiList: mainUrl + '/DefiProtocolList',
}
