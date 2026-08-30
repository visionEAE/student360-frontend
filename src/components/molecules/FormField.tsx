import type { ReactNode } from 'react'
import { Text } from '../atoms'

export function FormField({ label, action, children }: { label: string; action?: ReactNode; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text variant="label">{label}</Text>
        {action}
      </div>
      {children}
    </div>
  )
}
