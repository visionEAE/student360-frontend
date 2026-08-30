import { Check } from 'lucide-react'
import { Icon, Text } from '../atoms'
import styles from './SignalRow.module.css'

export function SignalRow({ title, detail }: { title: string; detail: string }) {
  return (
    <div className={styles.row}>
      <span className={styles.dot}>
        <Icon icon={Check} size={13} />
      </span>
      <div className={styles.text}>
        <Text variant="label">{title}</Text>
        {detail ? <Text variant="caption">{detail}</Text> : null}
      </div>
    </div>
  )
}
