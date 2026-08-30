import { session } from '../auth/session'

export const GATEWAY_URL: string =
  (import.meta.env?.VITE_GATEWAY_URL as string | undefined) ?? 'http://localhost:8080'

/** RFC 7807 body every service answers with; requestId lets a user quote the failure. */
export interface Problem {
  title?: string
  status: number
  detail?: string
  requestId?: string
  section?: string
}

export class ApiError extends Error {
  readonly status: number
  readonly problem: Problem
  readonly requestId: string

  constructor(status: number, problem: Problem, requestId: string) {
    super(problem.detail ?? problem.title ?? `HTTP ${status}`)
    this.status = status
    this.problem = problem
    this.requestId = requestId
  }
}

interface TokenResponse {
  accessToken: string
}

export type RequestOptions = Omit<RequestInit, 'body' | 'headers'> & {
  body?: unknown
  auth?: boolean
}

/**
 * All refreshes share ONE in-flight promise. Two requests failing with 401 at the same moment
 * must not each call /api/auth/refresh: the second would present a refresh token the first one
 * just consumed, and the SSO would read that as reuse and revoke the whole session.
 */
let refreshInFlight: Promise<boolean> | null = null

export function refreshSession(): Promise<boolean> {
  if (!refreshInFlight) {
    refreshInFlight = doRefresh().finally(() => {
      refreshInFlight = null
    })
  }
  return refreshInFlight
}

async function doRefresh(): Promise<boolean> {
  try {
    const response = await fetch(`${GATEWAY_URL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'X-Request-Id': newRequestId() },
    })
    if (!response.ok) {
      session.clear()
      return false
    }
    const body = (await response.json()) as TokenResponse
    session.setAccessToken(body.accessToken)
    return true
  } catch {
    session.clear()
    return false
  }
}

export function newRequestId(): string {
  const random = globalThis.crypto?.randomUUID?.() ?? Math.random().toString(16).slice(2)
  return `spa-${random}`
}

/** One request, at most one refresh, at most one retry. */
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, auth = true, ...init } = options
  const attempt = () => send(path, body, auth, init)

  let response = await attempt()
  if (response.status === 401 && auth && session.isAuthenticated()) {
    const refreshed = await refreshSession()
    if (!refreshed) {
      throw new ApiError(401, { status: 401, title: 'Session expired' }, '')
    }
    response = await attempt()
  }
  if (response.status === 204) {
    return undefined as T
  }
  const requestId = response.headers.get('X-Request-Id') ?? ''
  const text = await response.text()
  const parsed = text ? (JSON.parse(text) as unknown) : undefined
  if (!response.ok) {
    const problem = (parsed as Problem | undefined) ?? { status: response.status }
    throw new ApiError(response.status, problem, requestId)
  }
  return parsed as T
}

function send(path: string, body: unknown, auth: boolean, init: RequestInit): Promise<Response> {
  const headers: Record<string, string> = { 'X-Request-Id': newRequestId() }
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }
  const token = session.accessToken()
  if (auth && token) {
    headers.Authorization = `Bearer ${token}`
  }
  return fetch(`${GATEWAY_URL}${path}`, {
    ...init,
    method: init.method ?? (body !== undefined ? 'POST' : 'GET'),
    credentials: 'include',
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
}
