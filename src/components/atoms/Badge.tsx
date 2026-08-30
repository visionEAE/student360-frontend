import type { LucideIcon } from 'lucide-react'
import type { Tone } from '../../lib/labels'
import { Icon } from './Icon'
import styles from './Badge.module.css'

interface BadgeProps {
  tone?: Tone
  icon?: LucideIcon
  size?: 'sm' | 'md'
  /** White pill over a tinted card (the "Abierta" pill of the alert card). */
  onTint?: boolean
  children: React.ReactNode
}

export function Badge({ tone = 'neutral', icon, size = 'sm', onTint, children }: BadgeProps) {
  const classes = [styles.badge, styles[tone], size === 'md' ? styles.md : '', onTint ? styles.onTint : '']
  return (
    <span className={classes.join(' ').trim()}>
      {icon ? <Icon icon={icon} size={size === 'md' ? 13 : 12} /> : null}
      {children}
    </span>
  )
}
