import { useNavigate, useParams } from 'react-router-dom'
import { Avatar, Badge, Spinner, Text } from '../components/atoms'
import { ErrorNotice, UnavailablePanel } from '../components/molecules'
import { AppShell, StackLayout } from '../components/templates'
import { AcademicSection, EngagementSection, FinancialSection, WellbeingSection } from '../components/organisms'
import { supportApi } from '../api/support'
import { coreApi } from '../api/core'
import { lmsApi } from '../api/lms'
import { useLoad } from '../lib/useLoad'
import { initialsOf } from '../lib/format'
import type { AcademicStatus, EngagementActivity, FinancialStatus, StudentProfile, WellbeingSummary } from '../api/types'
import { ApiError } from '../api/http'

interface FullStudentInformation {
  profile: StudentProfile
  academic: AcademicStatus | null
  financial: FinancialStatus | null
  activity: EngagementActivity | null
  wellbeing: WellbeingSummary | null
}

async function settle<T>(promise: Promise<T>): Promise<T | null> {
  try {
    return await promise
  } catch (error) {
    if (error instanceof ApiError && error.status === 503) {
      return null
    }
    throw error
  }
}

async function loadFullInformation(reference: string): Promise<FullStudentInformation> {
  const [profile, academic, financial, activity, wellbeing] = await Promise.all([
    coreApi.student(reference),
    settle(coreApi.academicStatus(reference)),
    settle(coreApi.financialStatus(reference)),
    settle(lmsApi.activity(reference, 30)),
    settle(supportApi.wellbeingSummary(reference)),
  ])
  return { profile, academic, financial, activity, wellbeing }
}

/**
 * "Student Information Display": the full four-section 360 view. An advisor opens it from a
 * student's case ("Ver perfil completo"); a student opens the same component for themself at
 * `/me/overview`, which is the minimum requirement that everything lives in one place.
 */
export function StudentInformationDisplayPage({ ownReference }: { ownReference?: string }) {
  const params = useParams()
  const navigate = useNavigate()
  const reference = ownReference ?? params.studentId ?? ''
  const { data, loading, error } = useLoad(() => loadFullInformation(reference), [reference])

  if (loading) {
    return (
      <AppShell>
        <Spinner center />
      </AppShell>
    )
  }
  if (error || !data) {
    return (
      <AppShell>
        <ErrorNotice error={error} />
      </AppShell>
    )
  }

  return (
    <AppShell>
      <StackLayout>
        {!ownReference ? (
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{ alignSelf: 'flex-start', background: 'none', border: 0, color: 'var(--color-text-secondary)', fontWeight: 600, cursor: 'pointer' }}
          >
            ← Volver
          </button>
        ) : null}
        <div
          style={{
            display: 'flex',
            gap: 20,
            padding: 24,
            alignItems: 'center',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 14,
          }}
        >
          <Avatar initials={initialsOf(data.profile.fullName)} size={60} tone="tint" />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Text variant="title">{data.profile.fullName}</Text>
            <Text variant="body">
              {data.profile.code ? `Código ${data.profile.code}` : 'Sin código'} · {data.profile.program.name} · {data.profile.currentSemester}.º semestre
            </Text>
          </div>
          <Badge tone={data.profile.status === 'ACTIVE' ? 'success' : 'neutral'} size="md">
            {data.profile.status === 'ACTIVE' ? 'Matrícula activa' : data.profile.status}
          </Badge>
        </div>
        {data.academic ? (
          <AcademicSection status={data.academic} programName={data.profile.program.name} />
        ) : (
          <UnavailablePanel section="académico" />
        )}
        {data.financial ? <FinancialSection status={data.financial} /> : <UnavailablePanel section="financiero" />}
        {data.activity ? <EngagementSection activity={data.activity} /> : <UnavailablePanel section="engagement" />}
        {data.wellbeing ? <WellbeingSection summary={data.wellbeing} /> : <UnavailablePanel section="bienestar" />}
      </StackLayout>
    </AppShell>
  )
}
