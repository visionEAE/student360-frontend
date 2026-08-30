import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button, Text } from '../atoms'
import { Card } from './Card'
import { FormField, PersonPicker, type PickedPerson } from '../molecules'
import type { PersonKind, RelationshipLabel, UpsertConnectionRequest } from '../../api/types'
import { PERSON_KIND_LABELS, RELATIONSHIP_LABEL_LABELS } from '../../lib/labels'
import styles from './ConnectionDetailPanel.module.css'

const KIND_OPTIONS = Object.keys(PERSON_KIND_LABELS) as PersonKind[]
const RELATIONSHIP_OPTIONS = Object.keys(RELATIONSHIP_LABEL_LABELS) as RelationshipLabel[]

/** Professors and peers are real SIS people (student360-core-service); everyone else — family,
 * counselors, the advisor, "other" — has no institutional record, so they stay a free-typed name. */
function directoryKindFor(kind: PersonKind): 'STUDENT' | 'PROFESSOR' | null {
  if (kind === 'PROFESSOR') {
    return 'PROFESSOR'
  }
  if (kind === 'PEER') {
    return 'STUDENT'
  }
  return null
}

/** "+ Nueva conexión": name a new person and rate them — the common path, no reference lookup. */
export function NewConnectionForm({ onSubmit }: { onSubmit: (body: UpsertConnectionRequest) => Promise<void> }) {
  const [open, setOpen] = useState(false)
  const [kind, setKind] = useState<PersonKind>('FAMILY')
  const [displayName, setDisplayName] = useState('')
  const [pickedPerson, setPickedPerson] = useState<PickedPerson | null>(null)
  const [relationshipLabel, setRelationshipLabel] = useState<RelationshipLabel>('FAMILY')
  const [weight, setWeight] = useState(5)
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  if (!open) {
    return (
      <Button variant="secondary" block onClick={() => setOpen(true)}>
        <Plus size={15} /> Nueva conexión
      </Button>
    )
  }

  const directoryKind = directoryKindFor(kind)

  const changeKind = (nextKind: PersonKind) => {
    setKind(nextKind)
    setPickedPerson(null)
    setDisplayName('')
  }

  const submit = async () => {
    let person: { kind: PersonKind; reference?: string; displayName?: string }
    if (directoryKind) {
      if (!pickedPerson) {
        setValidationError('Busca y selecciona a la persona.')
        return
      }
      person = { kind, reference: pickedPerson.reference, displayName: pickedPerson.displayName }
    } else {
      if (!displayName.trim()) {
        setValidationError('El nombre es obligatorio.')
        return
      }
      person = { kind, displayName: displayName.trim() }
    }
    setValidationError(null)
    setSubmitting(true)
    try {
      await onSubmit({ person, relationshipLabel, weight, note: note || undefined })
      setOpen(false)
      setDisplayName('')
      setPickedPerson(null)
      setNote('')
      setWeight(5)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      <Text variant="cardTitle">Nueva conexión</Text>
      <div className={styles.section} style={{ borderTop: 'none', paddingTop: 0, marginTop: 'var(--space-5)' }}>
        <FormField label="Tipo de persona">
          <select value={kind} onChange={(event) => changeKind(event.target.value as PersonKind)}>
            {KIND_OPTIONS.filter((option) => option !== 'STUDENT').map((option) => (
              <option key={option} value={option}>
                {PERSON_KIND_LABELS[option]}
              </option>
            ))}
          </select>
        </FormField>
        {directoryKind ? (
          <FormField label={directoryKind === 'PROFESSOR' ? 'Profesor(a)' : 'Estudiante'}>
            <PersonPicker
              directoryKind={directoryKind}
              value={pickedPerson}
              onChange={setPickedPerson}
              placeholder={directoryKind === 'PROFESSOR' ? 'Busca por nombre del profesor' : 'Busca por nombre del estudiante'}
            />
          </FormField>
        ) : (
          <FormField label="Nombre">
            <input
              type="text"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="¿Cómo se llama?"
            />
          </FormField>
        )}
        <FormField label="Tipo de relación">
          <select value={relationshipLabel} onChange={(event) => setRelationshipLabel(event.target.value as RelationshipLabel)}>
            {RELATIONSHIP_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {RELATIONSHIP_LABEL_LABELS[option]}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label={`Peso: ${weight}/10`}>
          <input type="range" min={1} max={10} value={weight} onChange={(event) => setWeight(Number(event.target.value))} />
        </FormField>
        <FormField label="Nota (opcional)">
          <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={2} />
        </FormField>
        {validationError ? (
          <Text variant="caption" color="var(--color-danger)">
            {validationError}
          </Text>
        ) : null}
        <div style={{ display: 'flex', gap: 10 }}>
          <Button onClick={submit} disabled={submitting}>
            Guardar
          </Button>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={submitting}>
            Cancelar
          </Button>
        </div>
      </div>
    </Card>
  )
}
