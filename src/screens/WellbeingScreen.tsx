import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { recordWellbeingEntry, type WellbeingEntryResult } from '../api/student'
import { useSession } from '../auth/useSession'
import { ErrorNotice } from '../components/Panel'

const LEVELS = [
  [1, 'Very low'],
  [2, 'Low'],
  [3, 'Okay'],
  [4, 'Good'],
  [5, 'Very good'],
] as const

export function WellbeingScreen() {
  const { profile } = useSession()
  const ref = profile?.externalReference ?? ''
  const [level, setLevel] = useState<number>(3)
  const [comment, setComment] = useState('')
  const [result, setResult] = useState<WellbeingEntryResult>()
  const [error, setError] = useState<unknown>()
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError(undefined)
    setResult(undefined)
    try {
      setResult(await recordWellbeingEntry(ref, level, comment))
      setComment('')
    } catch (failure) {
      setError(failure)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="narrow">
      <header className="row">
        <h1>How are you feeling today?</h1>
        <Link to="/me">Back to my 360° view</Link>
      </header>
      <form onSubmit={submit} className="stack">
        <fieldset className="levels">
          <legend>Wellbeing level</legend>
          {LEVELS.map(([value, label]) => (
            <label key={value} className={level === value ? 'selected' : ''}>
              <input type="radio" name="level" value={value} checked={level === value} onChange={() => setLevel(value)} />
              {value} · {label}
            </label>
          ))}
        </fieldset>
        <label>
          Anything you want to add (optional)
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={4} maxLength={2000} />
        </label>
        <button type="submit" disabled={busy}>
          {busy ? 'Saving…' : 'Save entry'}
        </button>
        {error !== undefined && <ErrorNotice error={error} />}
        {result && (
          <p className={result.alertGenerated ? 'notice warn' : 'notice ok'}>
            Entry saved (level {result.level}).{' '}
            {result.alertGenerated
              ? 'Your advisor has been alerted and will reach out to you.'
              : 'Thank you for sharing.'}
          </p>
        )}
      </form>
      <p className="muted small">
        Your entry is stored under a pseudonym; only your assigned advisor is notified if the platform
        detects a risk situation.
      </p>
    </main>
  )
}
