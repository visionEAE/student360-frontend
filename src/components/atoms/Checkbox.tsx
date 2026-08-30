import { Check } from 'lucide-react'
import type { InputHTMLAttributes } from 'react'
import { Icon } from './Icon'
import styles from './Checkbox.module.css'

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function Checkbox({ label, ...rest }: CheckboxProps) {
  return (
    <label className={styles.label}>
      <input type="checkbox" {...rest} className={styles.input} />
      <span className={styles.box}>{rest.checked ? <Icon icon={Check} size={12} /> : null}</span>
      {label}
    </label>
  )
}
