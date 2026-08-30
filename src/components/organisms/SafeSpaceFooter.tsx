import { Lock, Send } from 'lucide-react'
import { Button, Icon, Text } from '../atoms'
import styles from './SafeSpaceFooter.module.css'

interface SafeSpaceFooterProps {
  onSaveDraft: () => void
  onSend: () => void
  saving?: boolean
  sending?: boolean
  disabled?: boolean
}

export function SafeSpaceFooter({ onSaveDraft, onSend, saving, sending, disabled }: SafeSpaceFooterProps) {
  return (
    <div className={styles.footer}>
      <div className={styles.privacyRow}>
        <Icon icon={Lock} size={16} color="var(--color-primary)" />
        <Text variant="body" color="var(--color-primary-dark)">
          Solo tu equipo de acompañamiento asignado puede ver esta información. Puedes compartir tanto o tan
          poco como quieras, y actualizarlo cuando lo necesites.
        </Text>
      </div>
      <div className={styles.actions}>
        <Button variant="secondary" size="xl" onClick={onSaveDraft} disabled={saving || sending}>
          {saving ? 'Guardando…' : 'Guardar como borrador'}
        </Button>
        <Button size="xl" onClick={onSend} disabled={sending || disabled}>
          {sending ? 'Enviando…' : 'Enviar a mi equipo de acompañamiento'}
          <Icon icon={Send} size={15} color="#fff" />
        </Button>
      </div>
    </div>
  )
}
