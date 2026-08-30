import { useState } from 'react'
import { Spinner } from '../components/atoms'
import { ErrorNotice } from '../components/molecules'
import { AppShell, StackLayout } from '../components/templates'
import { DimensionCard, SafeSpaceBanner, SafeSpaceFooter } from '../components/organisms'
import { useSession } from '../auth/useSession'
import { supportApi } from '../api/support'
import { useLoad } from '../lib/useLoad'
import { DIMENSIONS, formFromDraft, hasAnyAnswer, missingDimensions, toEntryRequest } from '../lib/wellbeing'
import type { SafeSpaceFormState } from '../lib/wellbeing'

export function StudentSafeSpacePage() {
  const { profile } = useSession()
  const reference = profile?.externalReference ?? ''
  const { data: draft, loading, error } = useLoad(() => supportApi.wellbeingDraft(reference), [reference])
  const [form, setForm] = useState<SafeSpaceFormState | null>(null)
  const [saving, setSaving] = useState(false)
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ alertGenerated: boolean } | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)

  const activeForm = form ?? formFromDraft(draft?.dimensions)

  if (loading) {
    return (
      <AppShell>
        <Spinner center />
      </AppShell>
    )
  }
  if (error) {
    return (
      <AppShell>
        <ErrorNotice error={error} />
      </AppShell>
    )
  }

  function update(next: SafeSpaceFormState) {
    setForm(next)
    setValidationError(null)
    setResult(null)
  }

  async function handleSaveDraft() {
    if (!hasAnyAnswer(activeForm)) {
      return
    }
    setSaving(true)
    try {
      if (draft?.entryId) {
        await supportApi.updateWellbeingEntry(reference, draft.entryId, toEntryRequest(activeForm, 'DRAFT'))
      } else {
        await supportApi.createWellbeingEntry(reference, toEntryRequest(activeForm, 'DRAFT'))
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleSend() {
    const missing = missingDimensions(activeForm)
    if (missing.length > 0) {
      setValidationError('Cuéntanos cómo te sientes en las tres áreas antes de enviar.')
      return
    }
    setSending(true)
    setValidationError(null)
    try {
      const outcome = draft?.entryId
        ? await supportApi.updateWellbeingEntry(reference, draft.entryId, toEntryRequest(activeForm, 'SENT'))
        : await supportApi.createWellbeingEntry(reference, toEntryRequest(activeForm, 'SENT'))
      setResult({ alertGenerated: outcome.alertGenerated })
    } finally {
      setSending(false)
    }
  }

  return (
    <AppShell>
      <StackLayout>
        <SafeSpaceBanner fullName={profile?.fullName ?? ''} />
        {validationError ? <ErrorNotice error={new Error(validationError)} /> : null}
        {result ? (
          <div style={{ padding: 16, borderRadius: 12, background: 'var(--color-success-tint)', color: 'var(--color-success)', fontWeight: 700 }}>
            {result.alertGenerated
              ? 'Enviado. Tu equipo de acompañamiento fue notificado y revisará tu caso pronto.'
              : 'Enviado. Gracias por contarnos cómo estás.'}
          </div>
        ) : null}
        {DIMENSIONS.map((dimension) => (
          <DimensionCard key={dimension} dimension={dimension} state={activeForm[dimension]} onChange={(next) => update({ ...activeForm, [dimension]: next })} />
        ))}
        <SafeSpaceFooter onSaveDraft={() => void handleSaveDraft()} onSend={() => void handleSend()} saving={saving} sending={sending} />
      </StackLayout>
    </AppShell>
  )
}
