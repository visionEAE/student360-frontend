import type { ReactNode } from 'react'
import { BrandPanel } from '../organisms'
import styles from './AuthLayout.module.css'

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.layout}>
      <BrandPanel />
      <div className={styles.formPanel}>{children}</div>
    </div>
  )
}
