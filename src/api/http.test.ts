import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { session } from '../auth/session'
import { ApiError, request } from './http'

function json(status: number, body: unknown, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'X-Request-Id': 'test-id', ...headers },
  })
}

describe('http client refresh behaviour', () => {
  const fetchMock = vi.fn<typeof fetch>()

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock)
    session.clear()
    session.setAccessToken('expired-token')
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    fetchMock.mockReset()
  })

  it('shares a single in-flight refresh between concurrent 401s and retries both requests', async () => {
    fetchMock.mockImplementation(async (input, init) => {
      const url = String(input)
      if (url.endsWith('/api/auth/refresh')) {
        await new Promise((resolve) => setTimeout(resolve, 20))
        return json(200, { accessToken: 'fresh-token' })
      }
      const authorization = (init?.headers as Record<string, string> | undefined)?.Authorization
      if (authorization === 'Bearer expired-token') {
        return json(401, { status: 401, title: 'Authentication failed' })
      }
      return json(200, { path: url.replace(/^.*\/api/, '/api'), authorization })
    })

    const [first, second] = await Promise.all([
      request<{ path: string; authorization: string }>('/api/core/students/S-1001'),
      request<{ path: string; authorization: string }>('/api/lms/students/S-1001/signals'),
    ])

    const refreshCalls = fetchMock.mock.calls.filter(([input]) => String(input).endsWith('/api/auth/refresh'))
    expect(refreshCalls).toHaveLength(1)
    expect(first).toEqual({ path: '/api/core/students/S-1001', authorization: 'Bearer fresh-token' })
    expect(second).toEqual({ path: '/api/lms/students/S-1001/signals', authorization: 'Bearer fresh-token' })
    expect(session.accessToken()).toBe('fresh-token')
    // two originals + one refresh + two retries
    expect(fetchMock).toHaveBeenCalledTimes(5)
  })

  it('clears the session and fails when the refresh is rejected', async () => {
    fetchMock.mockImplementation(async (input) => {
      if (String(input).endsWith('/api/auth/refresh')) {
        return json(401, { status: 401, title: 'Authentication failed' })
      }
      return json(401, { status: 401, title: 'Authentication failed' })
    })

    await expect(request('/api/core/students/S-1001')).rejects.toBeInstanceOf(ApiError)
    expect(session.isAuthenticated()).toBe(false)
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('surfaces problem details and the request id on errors', async () => {
    fetchMock.mockResolvedValue(
      json(403, { status: 403, title: 'Access denied', detail: 'No relationship', requestId: 'abc-123' }),
    )

    const error = await request('/api/core/students/S-1003').catch((e: unknown) => e)
    expect(error).toBeInstanceOf(ApiError)
    expect((error as ApiError).status).toBe(403)
    expect((error as ApiError).problem.requestId).toBe('abc-123')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
