import { Plus } from 'lucide-react'
import { Avatar, Button, Text } from '../atoms'
import { RiskBadge } from '../molecules'
import type { RiskLevel } from '../../api/types'
import { formatSemester, initialsOf } from '../../lib/format'
import styles from './StudentHeader.module.css'

interface StudentHeaderProps {
  fullName: string
  code: string | null
  program: string
  currentSemester: number | null
  since?: string
  risk: RiskLevel
  onViewProfile?: () => void
  onNewIntervention?: () => void
}

export function StudentHeader({
  fullName,
  code,
  program,
  currentSemester,
  since,
  risk,
  onViewProfile,
  onNewIntervention,
}: StudentHeaderProps) {
  const meta = [code ? `Cód. ${code}` : null, program, formatSemester(currentSemester), since].filter(Boolean)
  return (
    <div className={styles.header}>
      <Avatar initials={initialsOf(fullName)} size={64} tone="tint" />
      <div className={styles.info}>
        <div className={styles.nameRow}>
          <Text variant="title">{fullName}</Text>
          <RiskBadge risk={risk} />
        </div>
        <div className={styles.metaRow}>
          {meta.map((item, index) => (
            <Text variant="body" key={item} as="span">
              {index > 0 ? '· ' : ''}
              {item}
            </Text>
          ))}
        </div>
      </div>
      <div className={styles.actions}>
        {onViewProfile ? (
          <Button variant="secondary" size="lg" onClick={onViewProfile}>
            Ver perfil completo
          </Button>
        ) : null}
        {onNewIntervention ? (
          <Button size="lg" onClick={onNewIntervention}>
            <Plus size={15} />
            Nueva intervención
          </Button>
        ) : null}
      </div>
    </div>
  )
}
