import { AtSign, BadgeCheck, Phone, ShieldQuestion, UserPen } from 'lucide-react'
import { Badge, Icon, Spinner, Text } from '../atoms'
import type { ContactSource, ContactView } from '../../api/types'
import styles from './ConnectionDetailPanel.module.css'

/** Where the details came from, said plainly — a professor's email is the institution's, a mother's is not. */
const SOURCE_LABEL: Record<ContactSource, { label: string; icon: typeof BadgeCheck; tone: 'success' | 'info' | 'neutral' }> = {
  DIRECTORY: { label: 'Directorio Icesi', icon: BadgeCheck, tone: 'success' },
  SELF_REPORTED: { label: 'Registrado manualmente', icon: UserPen, tone: 'info' },
  NONE: { label: 'Sin datos de contacto', icon: ShieldQuestion, tone: 'neutral' },
}

/** The contact block of an opened person: how to reach them, and one line about who they are. */
export function ContactCard({ contact, loading }: { contact: ContactView | null; loading: boolean }) {
  if (loading) {
    return (
      <div className={styles.contact}>
        <Spinner />
      </div>
    )
  }
  if (!contact) {
    return null
  }
  const source = SOURCE_LABEL[contact.source] ?? SOURCE_LABEL.NONE

  return (
    <div className={styles.contact}>
      <div className={styles.contactHead}>
        <Text variant="label">Datos de contacto</Text>
        <Badge tone={source.tone} icon={source.icon}>
          {source.label}
        </Badge>
      </div>

      {contact.headline ? (
        <Text variant="caption" color="var(--color-text-secondary)">
          {contact.headline}
        </Text>
      ) : null}

      {contact.email ? (
        <div className={styles.contactRow}>
          <Icon icon={AtSign} size={15} color="var(--color-text-muted)" />
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </div>
      ) : null}

      {contact.phone ? (
        <div className={styles.contactRow}>
          <Icon icon={Phone} size={15} color="var(--color-text-muted)" />
          <a href={`tel:${contact.phone.replace(/\s+/g, '')}`}>{contact.phone}</a>
        </div>
      ) : null}

      {contact.summary ? (
        <Text variant="body" color="var(--color-text-secondary)">
          {contact.summary}
        </Text>
      ) : null}

      {contact.source === 'NONE' ? (
        <Text variant="caption" color="var(--color-text-muted)">
          Aún no hay datos de contacto para esta persona.
        </Text>
      ) : null}
    </div>
  )
}
