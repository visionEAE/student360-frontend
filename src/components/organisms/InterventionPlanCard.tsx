import { Handshake } from 'lucide-react'
import { useState } from 'react'
import { Badge, Button, Icon, Text, TextArea } from '../atoms'
import type { InterventionPlan } from '../../api/types'
import { PLAN_STATUS_LABELS, PLAN_STATUS_TONES, PLAN_TYPE_LABELS } from '../../lib/labels'
import { Card } from './Card'
import styles from './InterventionPlanCard.module.css'

interface InterventionPlanCardProps {
  plan: InterventionPlan
  advisorName?: string
  onAccept?: () => void
  onAddNote: (content: string) => Promise<void>
  accepting?: boolean
}

export function InterventionPlanCard({ plan, advisorName, onAccept, onAddNote, accepting }: InterventionPlanCardProps) {
  const [noteOpen, setNoteOpen] = useState(false)
  const [note, setNote] = useState('')
  const [sending, setSending] = useState(false)

  return (
    <Card>
      <div className={styles.top}>
        <Text variant="cardTitle">Ruta de intervención sugerida</Text>
        <Badge tone={PLAN_STATUS_TONES[plan.status]} size="md">
          {PLAN_STATUS_LABELS[plan.status]}
        </Badge>
      </div>
      <div className={styles.typeRow}>
        <span className={styles.iconWrap}>
          <Icon icon={Handshake} size={17} />
        </span>
        <div className={styles.typeText}>
          <Text variant="label">{PLAN_TYPE_LABELS[plan.type]}</Text>
          {advisorName ? <Text variant="tiny">Asignada a {advisorName}</Text> : null}
        </div>
      </div>
      <Text variant="body">{plan.description}</Text>
      <div className={styles.actions}>
        {plan.status === 'PROPOSED' && onAccept ? (
          <Button onClick={onAccept} disabled={accepting}>
            {accepting ? 'Aceptando…' : 'Aceptar ruta'}
          </Button>
        ) : null}
        <Button variant="secondary" onClick={() => setNoteOpen((open) => !open)}>
          Agregar nota
        </Button>
      </div>
      {noteOpen ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <TextArea
            placeholder="Escribe una nota de seguimiento…"
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
          <Button
            size="sm"
            disabled={!note.trim() || sending}
            onClick={() => {
              setSending(true)
              onAddNote(note.trim())
                .then(() => {
                  setNote('')
                  setNoteOpen(false)
                })
                .finally(() => setSending(false))
            }}
          >
            {sending ? 'Guardando…' : 'Guardar nota'}
          </Button>
        </div>
      ) : null}
    </Card>
  )
}
