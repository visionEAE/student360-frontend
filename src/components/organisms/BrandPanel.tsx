import { HeartHandshake } from 'lucide-react'
import { Icon, Text } from '../atoms'
import styles from './BrandPanel.module.css'

export function BrandPanel() {
  return (
    <aside className={styles.panel}>
      <div className={styles.logo}>
        <Text variant="title" color="#fff" style={{ fontSize: 26 }}>
          icesi
        </Text>
        <Text variant="caption" color="rgba(255,255,255,0.8)">
          Vista 360° del Estudiante
        </Text>
      </div>
      <div className={styles.message}>
        <span className={styles.iconWrap}>
          <Icon icon={HeartHandshake} size={26} color="#fff" />
        </span>
        <Text variant="title" color="#fff" style={{ fontSize: 24, lineHeight: 1.25 }}>
          Intervención temprana, a tiempo.
        </Text>
        <Text variant="body" color="rgba(255,255,255,0.8)">
          Una vista única del bienestar académico, financiero y emocional de cada estudiante, para que tu
          equipo de acompañamiento pueda actuar a tiempo.
        </Text>
      </div>
      <Text variant="caption" color="rgba(255,255,255,0.6)">
        © 2026 Universidad Icesi
      </Text>
    </aside>
  )
}
