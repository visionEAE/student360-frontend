import { ArrowLeft, Bell, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Icon, Input } from '../atoms'
import styles from './Topbar.module.css'

interface TopbarProps {
  backLabel?: string
  onBack?: () => void
  openAlertsCount?: number
}

export function Topbar({ backLabel = 'Estudiantes', onBack, openAlertsCount = 0 }: TopbarProps) {
  const navigate = useNavigate()
  return (
    <div className={styles.topbar}>
      <button type="button" className={styles.breadcrumb} onClick={onBack ?? (() => navigate(-1))}>
        <Icon icon={ArrowLeft} size={16} />
        {backLabel}
      </button>
      <div className={styles.actions}>
        <Input leadingIcon={Search} placeholder="Buscar estudiantes..." style={{ width: 260 }} aria-label="Buscar estudiantes" />
        <span className={styles.bell}>
          <Icon icon={Bell} size={17} color="var(--color-text-secondary)" />
          {openAlertsCount > 0 ? <span className={styles.dot} /> : null}
        </span>
      </div>
    </div>
  )
}
