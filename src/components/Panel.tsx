import type { ReactNode } from 'react'
import { ApiError } from '../api/http'

/** A section of a screen that loads and fails on its own: one source down never hides the rest. */
export function Panel({
  title,
  loading,
  error,
  children,
}: {
  title: string
  loading?: boolean
  error?: unknown
  children?: ReactNode
}) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      {loading && <p className="muted">Loading…</p>}
      {!loading && error !== undefined && error !== null && <ErrorNotice error={error} />}
      {!loading && !error && children}
    </section>
  )
}

export function ErrorNotice({ error }: { error: unknown }) {
  if (error instanceof ApiError) {
    const unavailable = error.status === 503
    return (
      <p className={unavailable ? 'notice warn' : 'notice error'}>
        <strong>{unavailable ? 'Temporarily unavailable' : error.status === 403 ? 'Not allowed' : error.problem.title ?? 'Error'}</strong>
        {error.problem.detail ? ` — ${error.problem.detail}` : ''}
        {error.problem.section ? ` (section: ${error.problem.section})` : ''}
        {error.requestId || error.problem.requestId ? (
          <span className="request-id"> request id {error.problem.requestId ?? error.requestId}</span>
        ) : null}
      </p>
    )
  }
  return <p className="notice error">{String(error)}</p>
}
