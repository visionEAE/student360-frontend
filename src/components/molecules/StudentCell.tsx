import { Avatar, Text } from '../atoms'

export function StudentCell({ fullName, code, size = 32 }: { fullName: string; code: string | null; size?: 32 | 36 }) {
  const initials = fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
      <Avatar initials={initials} size={size} tone="tint" />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Text variant="label">{fullName}</Text>
        <Text variant="tiny">{code ? `Código ${code}` : 'Sin código'}</Text>
      </div>
    </div>
  )
}
