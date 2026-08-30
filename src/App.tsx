import { useEffect, useState, type ReactNode } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { logout, restoreSession } from './api/auth'
import { useSession } from './auth/useSession'
import { homeFor } from './routes'
import { AlertDetailScreen } from './screens/AlertDetailScreen'
import { InboxScreen } from './screens/InboxScreen'
import { LoginScreen } from './screens/LoginScreen'
import { StudentViewScreen } from './screens/StudentViewScreen'
import { WellbeingScreen } from './screens/WellbeingScreen'

function RequireRole({ roles, children }: { roles: string[]; children: ReactNode }) {
  const { authenticated, profile } = useSession()
  if (!authenticated || !profile) {
    return <Navigate to="/login" replace />
  }
  if (!roles.some((role) => profile.roles.includes(role))) {
    return (
      <main className="narrow">
        <p className="notice error">
          <strong>Not allowed</strong> — this screen is not available for your role.
        </p>
        <Link to={homeFor(profile.roles)}>Go to my home</Link>
      </main>
    )
  }
  return children
}

function TopBar() {
  const { authenticated, profile } = useSession()
  const navigate = useNavigate()
  if (!authenticated || !profile) {
    return null
  }
  return (
    <nav className="topbar">
      <Link to={homeFor(profile.roles)} className="brand">
        Student 360°
      </Link>
      <span className="muted">
        {profile.fullName} · {profile.roles.join(', ')}
      </span>
      <button
        className="link"
        onClick={() => {
          void logout().finally(() => navigate('/login', { replace: true }))
        }}
      >
        Sign out
      </button>
    </nav>
  )
}

function Home() {
  const { authenticated, profile } = useSession()
  return <Navigate to={authenticated && profile ? homeFor(profile.roles) : '/login'} replace />
}

export default function App() {
  const [restoring, setRestoring] = useState(true)

  useEffect(() => {
    // One silent refresh on load: the HttpOnly cookie may still carry a valid refresh token.
    void restoreSession().finally(() => setRestoring(false))
  }, [])

  if (restoring) {
    return <p className="muted centered">Restoring session…</p>
  }

  return (
    <BrowserRouter>
      <TopBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route
          path="/me"
          element={
            <RequireRole roles={['STUDENT']}>
              <StudentViewScreen />
            </RequireRole>
          }
        />
        <Route
          path="/wellbeing"
          element={
            <RequireRole roles={['STUDENT']}>
              <WellbeingScreen />
            </RequireRole>
          }
        />
        <Route
          path="/inbox"
          element={
            <RequireRole roles={['ADVISOR', 'ADMIN']}>
              <InboxScreen />
            </RequireRole>
          }
        />
        <Route
          path="/alerts/:id"
          element={
            <RequireRole roles={['ADVISOR', 'ADMIN']}>
              <AlertDetailScreen />
            </RequireRole>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
