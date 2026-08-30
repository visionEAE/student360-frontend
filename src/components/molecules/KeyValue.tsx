import { Divider } from '../atoms'
import styles from './KeyValue.module.css'

export interface KeyValueItem {
  label: string
  value: React.ReactNode
}

export function KeyValueList({ items }: { items: KeyValueItem[] }) {
  return (
    <div className={styles.list}>
      {items.map((item, index) => (
        <div key={item.label}>
          <div className={styles.row}>
            <span className={styles.label}>{item.label}</span>
            <span className={styles.value}>{item.value}</span>
          </div>
          {index < items.length - 1 ? <Divider /> : null}
        </div>
      ))}
    </div>
  )
}
