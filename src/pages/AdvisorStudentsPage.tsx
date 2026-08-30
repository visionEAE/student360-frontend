import { useMemo } from 'react'
import { Avatar, Text } from '../components/atoms'
import { EmptyState, ErrorNotice } from '../components/molecules'
import { AppShell, StackLayout } from '../components/templates'
import { StudentsTable, SummaryChips } from '../components/organisms'
import { useSession } from '../auth/useSession'
import { supportApi } from '../api/support'
import { useLoad } from '../lib/useLoad'
import { countByRisk } from '../lib/students'
import { initialsOf } from '../lib/format'
import { Spinner } from '../components/atoms'

export function AdvisorStudentsPage() {
  const { profile } = useSession()
  const { data, loading, error } = useLoad(() => supportApi.studentsOverview(), [])
  const counts = useMemo(() => countByRisk(data?.students ?? []), [data])

  return (
    <AppShell>
      <StackLayout>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Text variant="pageTitle">Mis estudiantes</Text>
            <Text variant="body">Vista rápida del estado académico, financiero y emocional de todos tus estudiantes a cargo</Text>
          </div>
          {profile ? (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 10, background: 'var(--color-surface)' }}>
              <Avatar initials={initialsOf(profile.fullName)} size={32} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Text variant="label">{profile.fullName}</Text>
                <Text variant="tiny">{data ? `${data.students.length} estudiantes a cargo` : '…'}</Text>
              </div>
            </div>
          ) : null}
        </div>
        {loading ? <Spinner center /> : null}
        {error ? <ErrorNotice error={error} /> : null}
        {data ? (
          data.students.length === 0 ? (
            <EmptyState label="Todavía no tienes estudiantes asignados." />
          ) : (
            <>
              <SummaryChips counts={counts} />
              <StudentsTable rows={data.students} />
            </>
          )
        ) : null}
      </StackLayout>
    </AppShell>
  )
}
