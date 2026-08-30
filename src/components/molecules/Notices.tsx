import { CloudOff } from 'lucide-react'
import { ApiError } from '../../api/http'
import { Icon, Text } from '../atoms'
import styles from './Notices.module.css'

export function ErrorNotice({ error }: { error: unknown }) {
  const problem = error instanceof ApiError ? error.problem : undefined
  return (
    <div className={styles.error} role="alert">
      <Text variant="label" color="var(--color-danger)">
        {problem?.title ?? 'No se pudo cargar la información'}
      </Text>
      <Text variant="caption" color="var(--color-danger)">
        {problem?.detail ?? 'Intenta de nuevo en unos minutos.'}
        {error instanceof ApiError && error.requestId ? ` · ${error.requestId}` : ''}
      </Text>
    </div>
  )
}

export function EmptyState({ label }: { label: string }) {
  return (
    <div className={styles.empty}>
      <Text variant="caption">{label}</Text>
    </div>
  )
}

/** What a card shows when its source answers 503 — the gateway's observable degradation. */
export function UnavailablePanel({ section }: { section?: string }) {
  return (
    <div className={styles.unavailable}>
      <Icon icon={CloudOff} size={22} color="var(--color-text-muted)" />
      <Text variant="label">Información no disponible por ahora</Text>
      <Text variant="caption">
        {section ? `La fuente de "${section}" no responde en este momento.` : 'Vuelve a intentarlo en unos minutos.'}
      </Text>
    </div>
  )
}
