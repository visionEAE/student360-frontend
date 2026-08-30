import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Spinner, Text } from '../components/atoms'
import { EmptyState, ErrorNotice, UnavailablePanel } from '../components/molecules'
import { AppShell, TwoColumnLayout } from '../components/templates'
import {
  AcademicStatusCard,
  ActiveAlertCard,
  AssignmentCard,
  ConnectionDetailPanel,
  EngagementCard,
  FinancialStatusCard,
  InterventionPlanCard,
  NewConnectionForm,
  StudentHeader,
  SupportNetworkGraph,
  Topbar,
  WellbeingTimelineCard,
} from '../components/organisms'
import { supportApi } from '../api/support'
import { networkApi } from '../api/network'
import { useLoad } from '../lib/useLoad'

/** "Advisor - Student 360 View": the working view an advisor opens from the students table. */
export function AdvisorStudentCasePage() {
  const { studentId = '' } = useParams()
  const navigate = useNavigate()
  const { data, loading, error, reload } = useLoad(() => supportApi.studentCase(studentId), [studentId])
  const [accepting, setAccepting] = useState(false)
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null)
  const {
    data: network,
    error: networkError,
    reload: reloadNetwork,
  } = useLoad(() => networkApi.supportNetworkAsAdvisor(studentId), [studentId])

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

  const overallRisk = data.activeAlert
    ? data.activeAlert.severity === 'HIGH'
      ? 'HIGH'
      : 'MEDIUM'
    : 'LOW'

  return (
    <AppShell>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Topbar openAlertsCount={data.activeAlert ? 1 : 0} onBack={() => navigate('/advisor/students')} />
        <StudentHeader
          fullName={data.student.fullName}
          code={data.student.code}
          program={data.student.program.name}
          currentSemester={data.student.currentSemester}
          since={data.assignment ? `Acompañada desde ${new Date(data.assignment.validFrom ?? '').toLocaleDateString('es-CO', { month: 'short', year: 'numeric' })}` : undefined}
          risk={overallRisk}
          onViewProfile={() => navigate(`/advisor/students/${studentId}/profile`)}
        />
        <TwoColumnLayout
          main={
            <>
              {data.activeAlert ? (
                <>
                  <ActiveAlertCard alert={data.activeAlert} />
                  {data.activeAlert.interventionPlan ? (
                    <InterventionPlanCard
                      plan={data.activeAlert.interventionPlan}
                      onAccept={
                        data.activeAlert.interventionPlan.status === 'PROPOSED'
                          ? () => {
                              setAccepting(true)
                              supportApi
                                .updateInterventionPlanStatus(data.activeAlert!.interventionPlan!.id, 'ACTIVE')
                                .then(reload)
                                .finally(() => setAccepting(false))
                            }
                          : undefined
                      }
                      accepting={accepting}
                      onAddNote={(content) => supportApi.addReport(data.activeAlert!.id, content).then(() => reload())}
                    />
                  ) : null}
                </>
              ) : (
                <Text variant="body">Sin alertas activas para este estudiante.</Text>
              )}
              {data.wellbeing ? (
                <WellbeingTimelineCard entries={data.wellbeing.recent} />
              ) : (
                <UnavailablePanel section="bienestar" />
              )}
            </>
          }
          side={
            <>
              {data.academic ? (
                <AcademicStatusCard status={data.academic} programName={data.student.program.name} />
              ) : (
                <UnavailablePanel section="académico" />
              )}
              {data.financial ? <FinancialStatusCard status={data.financial} /> : <UnavailablePanel section="financiero" />}
              {data.engagement ? <EngagementCard signals={data.engagement} /> : <UnavailablePanel section="engagement" />}
              {data.assignment ? (
                <AssignmentCard advisorName={data.assignment.advisorReference} since={data.assignment.validFrom} />
              ) : null}
            </>
          }
        />
        <div>
          <Text variant="cardTitle">Red de apoyo</Text>
          {networkError ? (
            <ErrorNotice error={networkError} />
          ) : !network ? (
            <Spinner center />
          ) : network.connections.length === 0 ? (
            <EmptyState label="Esta estudiante aún no tiene una red de apoyo registrada." />
          ) : (
            <SupportNetworkGraph
              studentDisplayName={data.student.fullName}
              network={network}
              selectedId={selectedPersonId}
              onSelect={setSelectedPersonId}
            />
          )}
          {network && selectedPersonId ? (
            (() => {
              const selectedConnection = network.connections.find(
                (connection) => connection.person.reference === selectedPersonId,
              )
              return selectedConnection ? (
                <ConnectionDetailPanel
                  connection={selectedConnection}
                  viewerRaterType="SUPPORT_TEAM"
                  onSave={(body) =>
                    networkApi.updateConnection(studentId, selectedConnection.person.reference, body).then(() => reloadNetwork())
                  }
                  onDelete={() =>
                    networkApi.removeConnection(studentId, selectedConnection.person.reference).then(() => reloadNetwork())
                  }
                  onClose={() => setSelectedPersonId(null)}
                />
              ) : null
            })()
          ) : null}
          {network ? (
            <NewConnectionForm onSubmit={(body) => networkApi.createConnection(studentId, body).then(() => reloadNetwork())} />
          ) : null}
        </div>
      </div>
    </AppShell>
  )
}

