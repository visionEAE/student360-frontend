import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/auth'
import { ErrorNotice } from '../components/Panel'
import { homeFor } from '../routes'

export function LoginScreen() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('maria.rojas@u.icesi.edu.co')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<unknown>()
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError(undefined)
    try {
      const profile = await login(email, password)
      navigate(homeFor(profile.roles), { replace: true })
    } catch (failure) {
      setError(failure)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="narrow">
      <h1>Student 360°</h1>
      <p className="muted">Sign in with your institutional account.</p>
      <form onSubmit={submit} className="stack">
        <label>
          E-mail
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button type="submit" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
        {error !== undefined && <ErrorNotice error={error} />}
      </form>
      <p className="muted small">
        Demo accounts (password <code>student360</code>): maria.rojas@u.icesi.edu.co (student at risk),
        ana.torres@u.icesi.edu.co (student), carlos.mejia@icesi.edu.co (advisor), diana.perez@icesi.edu.co
        (advisor).
      </p>
    </main>
  )
}
