import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Icon, Text } from '../atoms'
import styles from './CardHeader.module.css'

interface CardHeaderProps {
  icon?: LucideIcon
  title: string
  caption?: string
  right?: ReactNode
}

/** Section header of a card: icon in a tinted square, title, and a badge/caption on the right. */
export function CardHeader({ icon, title, caption, right }: CardHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.titleRow}>
        {icon ? (
          <span className={styles.iconWrap}>
            <Icon icon={icon} size={17} />
          </span>
        ) : null}
        <Text variant="sectionTitle">{title}</Text>
      </div>
      {right ?? (caption ? <Text variant="caption">{caption}</Text> : null)}
    </div>
  )
}
