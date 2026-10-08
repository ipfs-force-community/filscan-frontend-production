/** @format */

import { Translation } from '@/components/hooks/Translation'
import { ProtocolActorInfo } from '@/contents/protocolActors'
import classNames from 'classnames'
import styles from './ProtocolActorNote.module.scss'

// NV29（FIP-0118）协议合约地址说明条：命中 SWA/SRA（常量表见 contents/protocolActors.ts）时，
// 在地址页展示「协议地址」徽标 + 一句人话说明（三语）。未命中返回 null，不影响既有页面。
export default function ProtocolActorNote({
  actor,
  className,
}: {
  actor?: ProtocolActorInfo | null
  className?: string
}) {
  const { tr } = Translation({ ns: 'detail' })
  if (!actor) return null

  return (
    <div className={classNames(styles.protocolNote, className)}>
      <span className={styles.protocolBadge}>
        {tr('reward_stream_protocol_badge')} · {actor.label}
      </span>
      <span className={styles.protocolDesc}>{tr(actor.descKey)}</span>
    </div>
  )
}
