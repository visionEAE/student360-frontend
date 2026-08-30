import type { ReactNode } from 'react'
import styles from './StackLayout.module.css'

export function StackLayout({ children }: { children: ReactNode }) {
  return <div className={styles.stack}>{children}</div>
}
