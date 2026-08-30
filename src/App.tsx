import { useEffect, useState, type ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { restoreSession } from './api/auth'
import { useSession } from './auth/useSession'
import { Spinner, Text } from './components/atoms'
import { AppShell } from './components/templates'
import { homeFor } from './routes'
import { LoginPage } from './pages/LoginPage'
import { AdvisorStudentsPage } from './pages/AdvisorStudentsPage'
import { AdvisorStudentCasePage } from './pages/AdvisorStudentCasePage'
import { StudentInformationDisplayPage } from './pages/StudentInformationDisplayPage'
import { AdvisorAlertsPage } from './pages/AdvisorAlertsPage'
import { AdvisorAlertDetailPage } from './pages/AdvisorAlertDetailPage'
import { AdvisorInterventionsPage } from './pages/AdvisorInterventionsPage'
import { AdvisorReportsPage } from './pages/AdvisorReportsPage'
import { StudentOverviewPage } from './pages/StudentOverviewPage'
import { StudentSafeSpacePage } from './pages/StudentSafeSpacePage'

function RequireRole({ roles, children }: { roles: string[]; children: ReactNode }) {
  const { authenticated, profile } = useSession()
  if (!authenticated || !profile) {
    return <Navigate to="/login" replace />
  }
  if (!roles.some((role) => profile.roles.includes(role))) {
    return (
      <AppShell>
        <Text variant="label" color="var(--color-danger)">
          No tienes acceso a esta sección.
        </Text>
      </AppShell>
    )
  }
  return children
}

function Home() {
  const { authenticated, profile } = useSession()
  return <Navigate to={authenticated && profile ? homeFor(profile.roles) : '/login'} replace />
}

const ADVISOR_ROLES = ['ADVISOR', 'ADMIN']
const STUDENT_ROLES = ['STUDENT']

export default function App() {
  const [restoring, setRestoring] = useState(true)

  useEffect(() => {
    // One silent refresh on load: the HttpOnly cookie may still carry a valid refresh token.
    void restoreSession().finally(() => setRestoring(false))
  }, [])

  if (restoring) {
    return <Spinner center />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/advisor/students"
          element={
            <RequireRole roles={ADVISOR_ROLES}>
              <AdvisorStudentsPage />
            </RequireRole>
          }
        />
        <Route
          path="/advisor/students/:studentId"
          element={
            <RequireRole roles={ADVISOR_ROLES}>
              <AdvisorStudentCasePage />
            </RequireRole>
          }
        />
        <Route
          path="/advisor/students/:studentId/profile"
          element={
            <RequireRole roles={ADVISOR_ROLES}>
              <StudentInformationDisplayPage />
            </RequireRole>
          }
        />
        <Route
          path="/advisor/alerts"
          element={
            <RequireRole roles={ADVISOR_ROLES}>
              <AdvisorAlertsPage />
            </RequireRole>
          }
        />
        <Route
          path="/advisor/alerts/:alertId"
          element={
            <RequireRole roles={ADVISOR_ROLES}>
              <AdvisorAlertDetailPage />
            </RequireRole>
          }
        />
        <Route
          path="/advisor/interventions"
          element={
            <RequireRole roles={ADVISOR_ROLES}>
              <AdvisorInterventionsPage />
            </RequireRole>
          }
        />
        <Route
          path="/advisor/reports"
          element={
            <RequireRole roles={ADVISOR_ROLES}>
              <AdvisorReportsPage />
            </RequireRole>
          }
        />

        <Route
          path="/me/overview"
          element={
            <RequireRole roles={STUDENT_ROLES}>
              <StudentOverviewPage />
            </RequireRole>
          }
        />
        <Route
          path="/me/safe-space"
          element={
            <RequireRole roles={STUDENT_ROLES}>
              <StudentSafeSpacePage />
            </RequireRole>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
