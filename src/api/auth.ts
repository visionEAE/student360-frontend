import { session } from '../auth/session'
import type { UserProfile } from './types'
import { request } from './http'

interface TokenResponse {
  accessToken: string
  expiresIn: number
  sessionId: string
}

export async function login(email: string, password: string): Promise<UserProfile> {
  const tokens = await request<TokenResponse>('/api/auth/login', {
    body: { email, password },
    auth: false,
  })
  session.setAccessToken(tokens.accessToken)
  const profile = await request<UserProfile>('/api/auth/me')
  session.setProfile(profile)
  return profile
}

export async function logout(): Promise<void> {
  try {
    await request<void>('/api/auth/logout', { method: 'POST', auth: false })
  } finally {
    session.clear()
  }
}

/** Silent restore on page load: the HttpOnly cookie may still hold a valid refresh token. */
export async function restoreSession(): Promise<UserProfile | null> {
  const { refreshSession } = await import('./http')
  const refreshed = await refreshSession()
  if (!refreshed) {
    return null
  }
  const profile = await request<UserProfile>('/api/auth/me')
  session.setProfile(profile)
  return profile
}
