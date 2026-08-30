import { useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { addReport, fetchAlert } from '../api/advisor'
import { ErrorNotice, Panel } from '../components/Panel'
import { useLoad } from '../lib/useLoad'

export function AlertDetailScreen() {
  const { id = '' } = useParams()
  const alert = useLoad(() => fetchAlert(id), [id])
  const [content, setContent] = useState('')
  const [error, setError] = useState<unknown>()
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError(undefined)
    try {
      await addReport(id, content)
      setContent('')
      alert.reload()
    } catch (failure) {
      setError(failure)
    } finally {
      setBusy(false)
    }
  }

  const signals = alert.data?.triggeringSignals

  return (
    <main>
      <header className="row">
        <h1>Alert {alert.data ? `· ${alert.data.studentId}` : ''}</h1>
        <Link to="/inbox">Back to inbox</Link>
      </header>
      <Panel title="Why it fired" loading={alert.loading} error={alert.error}>
        {alert.data && signals && (
          <>
            <p>
              <span className={`badge ${alert.data.severity.toLowerCase()}`}>{alert.data.severity}</span>{' '}
              {alert.data.status} · {alert.data.source} · {new Date(alert.data.generatedAt).toLocaleString()}
            </p>
            <ul className="conditions">
              {signals.firedConditions.map((condition) => (
                <li key={condition}>{condition}</li>
              ))}
            </ul>
            <dl>
              <dt>Wellbeing level</dt>
              <dd>{signals.wellbeingLevel}</dd>
              <dt>Days since last LMS access</dt>
              <dd>{signals.daysSinceLastAccess ?? 'unavailable'}</dd>
              <dt>On-time submission rate</dt>
              <dd>{signals.onTimeSubmissionRate === null ? 'unavailable' : `${Math.round(signals.onTimeSubmissionRate * 100)}%`}</dd>
              <dt>Courses without activity</dt>
              <dd>{signals.coursesWithoutActivity ?? 'unavailable'}</dd>
              <dt>Overdue balance</dt>
              <dd>
                {signals.overdueBalance === null ? 'unavailable' : `${signals.overdueBalance} · ${signals.daysOverdue} days`}
                {signals.financialHold ? ' · financial hold' : ''}
              </dd>
              {signals.unavailableSources.length > 0 && (
                <>
                  <dt>Evaluated without</dt>
                  <dd>{signals.unavailableSources.join(', ')}</dd>
                </>
              )}
            </dl>
          </>
        )}
      </Panel>
      {alert.data && (
        <>
          <Panel title="Suggested intervention plan">
            {alert.data.interventionPlan ? (
              <p>
                <strong>{alert.data.interventionPlan.type}</strong> ({alert.data.interventionPlan.status})
                <br />
                {alert.data.interventionPlan.description}
              </p>
            ) : (
              <p className="muted">No plan suggested.</p>
            )}
          </Panel>
          <Panel title="Support reports">
            {alert.data.reports.length === 0 && <p className="muted">No reports yet.</p>}
            <ul className="reports">
              {alert.data.reports.map((report) => (
                <li key={report.id}>
                  <span className="muted small">
                    {report.advisorId} · {new Date(report.createdAt).toLocaleString()}
                  </span>
                  <br />
                  {report.content}
                </li>
              ))}
            </ul>
            <form onSubmit={submit} className="stack">
              <label>
                Add a report
                <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={3} required maxLength={4000} />
              </label>
              <button type="submit" disabled={busy || content.trim() === ''}>
                {busy ? 'Saving…' : 'Save report'}
              </button>
              {error !== undefined && <ErrorNotice error={error} />}
            </form>
          </Panel>
        </>
      )}
    </main>
  )
}
