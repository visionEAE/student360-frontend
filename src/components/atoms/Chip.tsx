import { Check } from 'lucide-react'
import { Icon } from './Icon'
import styles from './Chip.module.css'

interface ChipProps {
  label: string
  selected?: boolean
  onToggle?: () => void
}

/** The "¿Qué necesitas ahora?" pills: selectable, with a check when active. */
export function Chip({ label, selected, onToggle }: ChipProps) {
  if (!onToggle) {
    return <span className={`${styles.chip} ${selected ? styles.selected : ''}`}>{label}</span>
  }
  return (
    <button type="button" className={`${styles.chip} ${selected ? styles.selected : ''}`} onClick={onToggle} aria-pressed={selected}>
      {selected ? <Icon icon={Check} size={12} /> : null}
      {label}
    </button>
  )
}
