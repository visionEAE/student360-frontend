import type { ReactNode } from 'react'
import styles from './TwoColumnLayout.module.css'

export function TwoColumnLayout({ main, side }: { main: ReactNode; side: ReactNode }) {
  return (
    <div className={styles.grid}>
      <div className={styles.main}>{main}</div>
      <div className={styles.side}>{side}</div>
    </div>
  )
}
