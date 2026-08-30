import { useSyncExternalStore } from 'react'
import { session } from './session'

export function useSession() {
  const profile = useSyncExternalStore(session.subscribe, session.profile, session.profile)
  const authenticated = useSyncExternalStore(
    session.subscribe,
    session.isAuthenticated,
    session.isAuthenticated,
  )
  return { profile, authenticated, hasRole: (role: string) => profile?.roles.includes(role) ?? false }
}
