import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Icon } from './Icon'
import styles from './Input.module.css'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leadingIcon?: LucideIcon
  trailing?: ReactNode
  surface?: boolean
}

export function Input({ leadingIcon, trailing, surface, className, ...rest }: InputProps) {
  return (
    <span className={`${styles.wrap} ${surface ? styles.surface : ''} ${className ?? ''}`}>
      {leadingIcon ? <Icon icon={leadingIcon} size={16} /> : null}
      <input {...rest} className={styles.input} />
      {trailing}
    </span>
  )
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${styles.textarea} ${props.className ?? ''}`} />
}
