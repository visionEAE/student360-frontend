import type { CSSProperties, ElementType, ReactNode } from 'react'
import styles from './Text.module.css'

type Variant =
  | 'pageTitle'
  | 'title'
  | 'sectionTitle'
  | 'cardTitle'
  | 'smallTitle'
  | 'label'
  | 'body'
  | 'caption'
  | 'tiny'

interface TextProps {
  variant?: Variant
  as?: ElementType
  color?: string
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export function Text({ variant = 'body', as: Tag = 'p', color, children, className, style }: TextProps) {
  return (
    <Tag
      className={`${styles.text} ${styles[variant]} ${className ?? ''}`}
      style={color ? { ...style, color } : style}
    >
      {children}
    </Tag>
  )
}
