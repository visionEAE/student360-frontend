import type { LucideIcon } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { Icon } from '../atoms'
import styles from './NavItem.module.css'

export function NavItem({ to, icon, label }: { to: string; icon: LucideIcon; label: string }) {
  return (
    <NavLink to={to} className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ''}`}>
      <Icon icon={icon} size={18} />
      {label}
    </NavLink>
  )
}
