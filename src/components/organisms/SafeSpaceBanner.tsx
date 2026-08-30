import { HeartHandshake, ShieldCheck } from 'lucide-react'
import { Icon, Text } from '../atoms'
import { firstName } from '../../lib/format'
import styles from './SafeSpaceBanner.module.css'

export function SafeSpaceBanner({ fullName }: { fullName: string }) {
  return (
    <div className={styles.banner}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
        <span className={styles.eyebrow}>
          <Icon icon={ShieldCheck} size={14} color="#fff" />
          <Text variant="label" color="#fff">
            Tu espacio seguro
          </Text>
        </span>
        <Text variant="title" color="#fff" style={{ fontSize: 26 }}>
          Hola, {firstName(fullName)}
        </Text>
        <Text variant="body" color="rgba(255,255,255,0.9)">
          Este espacio es solo tuyo. Cuéntanos cómo estás y qué necesitas: tu equipo de acompañamiento lo
          revisará con cuidado y confidencialidad.
        </Text>
      </div>
      <span className={styles.illustration}>
        <Icon icon={HeartHandshake} size={48} color="#fff" />
      </span>
    </div>
  )
}
