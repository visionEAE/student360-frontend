import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/auth'
import { AuthLayout } from '../components/templates'
import { LoginForm } from '../components/organisms'
import { ApiError } from '../api/http'
import { homeFor } from '../routes'

export function LoginPage() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(email: string, password: string) {
    setSubmitting(true)
    setError(null)
    try {
      const profile = await login(email, password)
      navigate(homeFor(profile.roles), { replace: true })
    } catch (cause) {
      setError(cause instanceof ApiError ? (cause.problem.detail ?? 'Credenciales inválidas') : 'No se pudo iniciar sesión')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <LoginForm onSubmit={handleSubmit} submitting={submitting} error={error} />
    </AuthLayout>
  )
}
