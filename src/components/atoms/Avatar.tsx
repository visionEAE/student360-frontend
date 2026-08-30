import styles from './Avatar.module.css'

interface AvatarProps {
  initials: string
  size?: 32 | 34 | 36 | 60 | 64
  tone?: 'solid' | 'tint'
}

const FONT_SIZES: Record<number, number> = { 32: 11, 34: 12, 36: 13, 60: 20, 64: 22 }

export function Avatar({ initials, size = 36, tone = 'solid' }: AvatarProps) {
  return (
    <span
      className={`${styles.avatar} ${styles[tone]}`}
      style={{ width: size, height: size, fontSize: FONT_SIZES[size] }}
      aria-hidden
    >
      {initials}
    </span>
  )
}
