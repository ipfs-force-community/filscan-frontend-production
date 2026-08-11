const mainUrl = process.env.APP_BASE_URL
const testUrl = 'http://192.168.19.80:17000/api/v1'
const testMain = 'https://api-v2.filscan.io/pro/v1'

const proUrl = process.env.APP_BASE_URL_PRO

// 静态资源基地址（images 等资源的根目录），通过 .env 的 NEXT_PUBLIC_STATIC_URL 配置：
//   - 留空：使用本地资源（相对路径 /images/xxx，资源放 public/images 或由 nginx 提供）
//   - OSS：https://filscan-v2.oss-accelerate.aliyuncs.com/fvm_manage
//   - CDN：https://cdn.filscan.io/fvm_manage
export const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL || ''

//用户信息
export const login = proUrl + '/Login'
export const userInfo = proUrl + '/UserInfo'
export const verifyCode = proUrl + '/SendVerificationCode'
export const resetPassword = proUrl + '/ResetPasswordByCode'
export const inviteCode = proUrl + '/UserInviteCode'
export const inviteList = proUrl + '/UserInviteRecord'
export const ValidInvite = proUrl + '/ValidInvite'
export const updateInfo = proUrl + '/UpdateUserInfo'

//pro 项目分析
export const fileBase = mainUrl + '/FilecoinBaseData'
export const marketKline = mainUrl + '/GetFilecoinKLine'
export const filecoinValue = mainUrl + '/GetFilecoinChange'
export const fileTrend = mainUrl + '/GetFilecoinTrend'
export const fileNetwork = mainUrl + '/NetworkCapital'
export const fileNetworkTrend = mainUrl + '/NetworkCapitalFigure'
export const fileVestList = mainUrl + '/VestReleaseDate'
export const fileTokens = mainUrl + '/TokenHolderAddress'
export const fileTokenTrend = mainUrl + '/TokenHolderTrend'
export const fileActive = mainUrl + '/TopActiveAddress'

//资金穿透
export const fundAddress = proUrl + '/EvaluateAddr'
export const fundInfo = proUrl + '/CapitalAddrInfo'
export const fundTransaction = proUrl + '/CapitalAddrTransaction'

//活动
export const eventsList = mainUrl + '/GetEventsList'
//节点管家
export const countMiners = proUrl + '/CountUserMiners'
export const UserGroups = proUrl + '/GetUserGroups'
export const saveMiner = proUrl + '/SaveUserMiners'
export const delGroup = proUrl + '/DeleteGroup'
export const saveGroup = proUrl + '/SaveGroupMiners'
export const minerOverview = proUrl + '/MinerInfoDetail'
export const powerData = proUrl + '/PowerDetail'
export const gasData = proUrl + '/GasCostDetail'
export const expiredData = proUrl + '/SectorDetail'
export const rewardData = proUrl + '/RewardDetail'
export const luckyData = proUrl + '/LuckyRateDetail'
export const balanceData = proUrl + '/BalanceDetail'
export const minerCategory = proUrl + '/GetRuleMinerInfo'
export const saveRules = proUrl + '/SaveUserRules'
export const getRules = proUrl + '/GetUserRules'
export const rulesActive = proUrl + '/UpdateRuleActiveState'
export const deleteRules = proUrl + '/DeleteUserRule'
export const deleteMiners = proUrl + '/DeleteGroupMiners'
//k线
