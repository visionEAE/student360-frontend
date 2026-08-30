import type { ReactNode } from 'react'
import styles from './Card.module.css'

export function Card({ tint, children }: { tint?: boolean; children: ReactNode }) {
  return <div className={`${styles.card} ${tint ? styles.tint : ''}`}>{children}</div>
}
