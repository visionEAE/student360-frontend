import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Badge, Button, Text } from '../atoms'
import { Card } from './Card'
import { FormField } from '../molecules'
import type {
  ConnectionDetail,
  ConnectionView,
  RaterType,
  RelationshipLabel,
  UpsertConnectionRequest,
} from '../../api/types'
import { PERSON_KIND_LABELS, RELATIONSHIP_LABEL_LABELS, raterLabel } from '../../lib/labels'
import { formatDate } from '../../lib/format'
import { useLoad } from '../../lib/useLoad'
import { ContactCard } from './ContactCard'
import styles from './ConnectionDetailPanel.module.css'

const RELATIONSHIP_OPTIONS = Object.keys(RELATIONSHIP_LABEL_LABELS) as RelationshipLabel[]

interface Props {
  connection: ConnectionView
  /** Which rater identity the current viewer edits under: the student rates as SELF, any advisor as SUPPORT_TEAM. */
  viewerRaterType: RaterType
  /**
   * Fetches the person's contact card. Passed in rather than called here because the student and
   * the advisor read the same card through different endpoints, and only the page knows which.
   */
  loadDetail: () => Promise<ConnectionDetail>
  onSave: (body: UpsertConnectionRequest) => Promise<void>
  onDelete: () => Promise<void>
  onClose: () => void
}

/** The person's card: everyone's rating is shown, but only the viewer's own edge is editable. */
export function ConnectionDetailPanel({
  connection,
  viewerRaterType,
  loadDetail,
  onSave,
  onDelete,
  onClose,
}: Props) {
  // Re-fetched whenever a different person is opened; a failure just leaves the card without
  // contact details rather than taking the ratings down with it.
  const { data: detail, loading: loadingDetail } = useLoad(loadDetail, [connection.person.reference])
  const ownEdge = connection.edges.find((edge) => edge.ratedBy === viewerRaterType) ?? null
  const otherEdges = connection.edges.filter((edge) => edge.ratedBy !== viewerRaterType)

  const [relationshipLabel, setRelationshipLabel] = useState<RelationshipLabel>(
    ownEdge?.relationshipLabel ?? connection.edges[0]?.relationshipLabel ?? 'OTHER',
  )
  const [weight, setWeight] = useState(ownEdge?.weight ?? 5)
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const submit = async () => {
    setSaving(true)
    try {
      await onSave({
        person: { reference: connection.person.reference, kind: connection.person.kind },
        relationshipLabel,
        weight,
        note: note || undefined,
      })
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    if (!window.confirm(`¿Quitar tu valoración de ${connection.person.displayName ?? connection.person.reference}?`)) {
      return
    }
    setDeleting(true)
    try {
      await onDelete()
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Text variant="cardTitle">
            {detail?.person.displayName ?? connection.person.displayName ?? connection.person.reference}
          </Text>
          <Text variant="caption" color="var(--color-text-muted)">
            {PERSON_KIND_LABELS[connection.person.kind]}
          </Text>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Cerrar
        </Button>
      </div>

      <ContactCard contact={detail?.contact ?? null} loading={loadingDetail} />

      {otherEdges.length > 0 ? (
        <div className={styles.section}>
          <Text variant="label">{raterLabel(otherEdges[0].ratedBy)} también la valoró</Text>
          {otherEdges.map((edge) => (
            <div key={edge.ratedBy} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Badge tone="neutral">{RELATIONSHIP_LABEL_LABELS[edge.relationshipLabel]}</Badge>
              <Text variant="body">{edge.weight}/10</Text>
              <Text variant="caption" color="var(--color-text-muted)">
                {formatDate(edge.updatedAt)}
              </Text>
            </div>
          ))}
        </div>
      ) : null}

      <div className={styles.section}>
        <FormField label={`Tu valoración (${raterLabel(viewerRaterType)})`}>
          <select
            value={relationshipLabel}
            onChange={(event) => setRelationshipLabel(event.target.value as RelationshipLabel)}
          >
            {RELATIONSHIP_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {RELATIONSHIP_LABEL_LABELS[option]}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label={`Peso: ${weight}/10`}>
          <input
            type="range"
            min={1}
            max={10}
            value={weight}
            onChange={(event) => setWeight(Number(event.target.value))}
          />
        </FormField>
        <FormField label="Nota (opcional)">
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Nunca se muestra a nadie más que a quien la escribe…"
            rows={2}
          />
        </FormField>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button onClick={submit} disabled={saving}>
            {ownEdge ? 'Guardar' : 'Agregar mi valoración'}
          </Button>
          {ownEdge ? (
            <Button variant="danger" onClick={remove} disabled={deleting}>
              <Trash2 size={14} /> Eliminar
            </Button>
          ) : null}
        </div>
      </div>
    </Card>
  )
}
