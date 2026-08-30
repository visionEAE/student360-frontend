import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './Button.module.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  block?: boolean
  children: ReactNode
}

export function Button({ variant = 'primary', size = 'md', block, className, children, ...rest }: ButtonProps) {
  const classes = [styles.button, styles[variant], styles[size], block ? styles.block : '', className ?? '']
  return (
    <button type="button" {...rest} className={classes.join(' ').trim()}>
      {children}
    </button>
  )
}
