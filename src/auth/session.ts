/**
 * The access token lives here and nowhere else: a module-level variable, never localStorage or
 * sessionStorage, so a script injected into the page has no persisted credential to read. The
 * refresh token is an HttpOnly cookie the browser sends on its own.
 */
import type { UserProfile } from '../api/types'

export type { UserProfile }

type Listener = () => void

let accessToken: string | null = null
let profile: UserProfile | null = null
const listeners = new Set<Listener>()

function notify() {
  listeners.forEach((listener) => listener())
}

export const session = {
  accessToken: () => accessToken,
  profile: () => profile,
  isAuthenticated: () => accessToken !== null,
  hasRole: (role: string) => profile?.roles.includes(role) ?? false,
  setAccessToken(token: string | null) {
    accessToken = token
    notify()
  },
  setProfile(value: UserProfile | null) {
    profile = value
    notify()
  },
  clear() {
    accessToken = null
    profile = null
    notify()
  },
  subscribe(listener: Listener) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
}
