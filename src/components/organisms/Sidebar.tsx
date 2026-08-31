import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart3, Bell, HeartHandshake, LayoutDashboard, LogOut, Share2, ShieldCheck, Users } from 'lucide-react'
import { logout } from '../../api/auth'
import { Avatar, Text } from '../atoms'
import { NavItem } from '../molecules'
import { useSession } from '../../auth/useSession'
import { initialsOf } from '../../lib/format'
import { roleLabel } from '../../lib/labels'
import styles from './Sidebar.module.css'

const ADVISOR_ITEMS = [
  { to: '/advisor/students', icon: LayoutDashboard, label: 'Panel' },
  { to: '/advisor/students', icon: Users, label: 'Estudiantes' },
  { to: '/advisor/alerts', icon: Bell, label: 'Alertas' },
  { to: '/advisor/interventions', icon: HeartHandshake, label: 'Intervenciones' },
  { to: '/advisor/reports', icon: BarChart3, label: 'Reportes' },
]

const STUDENT_ITEMS = [
  { to: '/me/overview', icon: LayoutDashboard, label: 'Mi vista 360°' },
  { to: '/me/safe-space', icon: ShieldCheck, label: 'Mi espacio seguro' },
  { to: '/me/support-network', icon: Share2, label: 'Mi red de apoyo' },
]

/** Left navigation shared by every authenticated screen; items depend on the caller's role. */
export function Sidebar() {
  const { profile } = useSession()
  const navigate = useNavigate()
  const [leaving, setLeaving] = useState(false)
  const isAdvisor = profile?.roles.some((role) => role === 'ADVISOR' || role === 'ADMIN') ?? false
  const items = isAdvisor ? ADVISOR_ITEMS : STUDENT_ITEMS

  async function handleLogout() {
    setLeaving(true)
    try {
      await logout()
    } finally {
      navigate('/login', { replace: true })
    }
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoBlock}>
        <span className={styles.wordmark}>icesi</span>
        <Text variant="tiny">Vista 360° del Estudiante</Text>
      </div>
      <nav className={styles.nav}>
        {items.map((item) => (
          <NavItem key={item.label} {...item} />
        ))}
      </nav>
      <div className={styles.spacer} />
      {profile ? (
        <div className={styles.profile}>
          <Avatar initials={initialsOf(profile.fullName)} size={36} />
          <div className={styles.profileText}>
            <Text variant="label">{profile.fullName}</Text>
            <Text variant="tiny">{roleLabel(profile.roles)}</Text>
          </div>
          <button
            type="button"
            className={styles.logout}
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
            onClick={handleLogout}
            disabled={leaving}
          >
            <LogOut size={16} />
          </button>
        </div>
      ) : null}
    </aside>
  )
}
