/**
 * NV29/FIP-0118 奖励流方法名 → 人话标签（i18n key）。
 *
 * 方法名以 go-state-types v0.19.0 `builtin/v19/reward/methods.go` 为准：
 *   SetWeightRecordsExported / StepWeightRecordsExported / RegisterStreamExported /
 *   RemoveStreamExported / SetDistributionExported / SetSharesExported /
 *   ReplaceAddressExported / CancelPendingExported / ClaimExported。
 *
 * 这里只做**显示层映射**：不改后端返回的方法名；命中映射表时用 i18n 文案替换渲染，
 * 未命中一律原样返回（与后端「未知方法」原样展示的兜底一致）。
 */
export const reward_method_name_map: Record<string, string> = {
  ClaimExported: 'method_ClaimExported',
  SetWeightRecordsExported: 'method_SetWeightRecordsExported',
  StepWeightRecordsExported: 'method_StepWeightRecordsExported',
  RegisterStreamExported: 'method_RegisterStreamExported',
  RemoveStreamExported: 'method_RemoveStreamExported',
  SetDistributionExported: 'method_SetDistributionExported',
  SetSharesExported: 'method_SetSharesExported',
  ReplaceAddressExported: 'method_ReplaceAddressExported',
  CancelPendingExported: 'method_CancelPendingExported',
}

/**
 * 方法名的显示层人话化：命中映射表用 tr(key) 文案，否则原样返回。
 * tr 由调用方传入（ns='detail'）。
 */
export function humanizeMethodName(
  name: string,
  tr: (key: string) => string,
): string {
  if (!name) return name
  const key = reward_method_name_map[name]
  return key ? tr(key) : name
}
