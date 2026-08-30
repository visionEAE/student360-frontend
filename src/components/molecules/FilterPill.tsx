import { ChevronDown } from 'lucide-react'
import { Icon } from '../atoms'
import styles from './FilterPill.module.css'

interface FilterPillProps {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}

export function FilterPill({ value, onChange, options }: FilterPillProps) {
  return (
    <label className={styles.pill}>
      <select className={styles.select} value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Icon icon={ChevronDown} size={14} color="var(--color-text-muted)" />
    </label>
  )
}
