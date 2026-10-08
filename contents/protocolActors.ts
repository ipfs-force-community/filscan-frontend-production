/**
 * NV29（FIP-0118 / Solstice 奖励流）的两个协议合约地址（SWA / SRA）。
 *
 * 来源（逐字）：lotus v1.37.0
 *   - build/buildconstants/params_mainnet.go:168-169
 *   - build/buildconstants/params_calibnet.go:155-156
 *     均定义：
 *       SWAActor = "0x66C11A9F6dfEC3c1557958cF9f575a023EB01421"
 *       SRAActor = "0x0339f205314C8210AF7Cb075d1A96D012e7896a9"
 *   两网（主网 mainnet 与校准网 calibnet）地址**相同**（逐字比对确认）。
 *
 * 语义（同源 lotus / go-state-types v0.19.0）：
 *   - SWA = Stream Weight Administrator：被授权管理奖励流（权重）配置
 *     （go-state-types `builtin/v19/reward/reward_state.go:72-74`）。
 *   - SRA = 服务流（service stream）分配合约：作为服务流 ShareMap 的写入方（Writer）
 *     （lotus `chain/consensus/filcns/upgrades.go:3480` 的 `DistributionInit.Writer = params.SRAActor`）。
 *
 * 说明：这里只登记 **FEVM（0x）形态**的地址。地址页若以 f0/f4（ID/robust）形态访问，需要
 * 链上解析（0x ↔ actor ID 的映射是链上分配、无法离线推导），当前接口未提供该映射，故不在此匹配。
 */

export interface ProtocolActorInfo {
  key: 'swa' | 'sra'
  /** 展示用短标签。 */
  label: 'SWA' | 'SRA'
  /** i18n 键（ns: detail）—— 地址页展示说明（三语）。 */
  descKey: string
}

/** key 一律用小写 0x 地址，便于大小写不敏感匹配（ETH 地址大小写不敏感）。 */
export const PROTOCOL_ACTORS: Record<string, ProtocolActorInfo> = {
  '0x66c11a9f6dfec3c1557958cf9f575a023eb01421': {
    key: 'swa',
    label: 'SWA',
    descKey: 'reward_stream_protocol_swa',
  },
  '0x0339f205314c8210af7cb075d1a96d012e7896a9': {
    key: 'sra',
    label: 'SRA',
    descKey: 'reward_stream_protocol_sra',
  },
}

/** 按地址查协议合约信息；命中返回 info，否则返回 null（大小写不敏感）。 */
export function getProtocolActorInfo(
  address?: string | null,
): ProtocolActorInfo | null {
  if (!address || typeof address !== 'string') return null
  return PROTOCOL_ACTORS[address.trim().toLowerCase()] || null
}
