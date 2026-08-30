import { Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Button, Checkbox, Icon, Input, Text } from '../atoms'
import styles from './LoginForm.module.css'

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>
  submitting: boolean
  error: string | null
}

export function LoginForm({ onSubmit, submitting, error }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [reveal, setReveal] = useState(false)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    void onSubmit(email, password)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.heading}>
        <Text variant="title">Bienvenido de nuevo</Text>
        <Text variant="body">Inicia sesión con tu cuenta institucional Icesi</Text>
      </div>
      {error ? (
        <Text variant="label" color="var(--color-danger)">
          {error}
        </Text>
      ) : null}
      <div className={styles.fields}>
        <div className={styles.field}>
          <Text variant="label">Correo institucional</Text>
          <Input
            type="email"
            required
            leadingIcon={Mail}
            placeholder="nombre.apellido@icesi.edu.co"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="username"
          />
        </div>
        <div className={styles.field}>
          <div className={styles.labelRow}>
            <Text variant="label">Contraseña</Text>
            <Text variant="label" as="a" color="var(--color-primary)">
              ¿Olvidaste tu contraseña?
            </Text>
          </div>
          <Input
            type={reveal ? 'text' : 'password'}
            required
            leadingIcon={Lock}
            placeholder="••••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            trailing={
              <button type="button" onClick={() => setReveal((value) => !value)} aria-label="Mostrar contraseña" style={{ background: 'none', border: 0, display: 'flex', color: 'var(--color-text-muted)' }}>
                <Icon icon={reveal ? Eye : EyeOff} size={16} />
              </button>
            }
          />
        </div>
      </div>
      <div className={styles.rememberRow}>
        <Checkbox label="Mantener sesión iniciada" checked={remember} onChange={(event) => setRemember(event.target.checked)} />
      </div>
      <Button type="submit" size="xl" block disabled={submitting}>
        {submitting ? 'Ingresando…' : 'Iniciar sesión'}
      </Button>
      <div className={styles.dividerRow}>
        <span className={styles.line} />
        <Text variant="caption">o</Text>
        <span className={styles.line} />
      </div>
      <Button type="button" variant="secondary" size="xl" block disabled>
        <Icon icon={ShieldCheck} size={16} color="var(--color-ink)" />
        Continuar con SSO Icesi
      </Button>
      <Text variant="caption" style={{ textAlign: 'center' }}>
        ¿Problemas para ingresar? Escribe a soporte@icesi.edu.co
      </Text>
    </form>
  )
}
