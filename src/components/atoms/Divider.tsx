export function Divider({ tint }: { tint?: string }) {
  return <hr style={{ border: 0, borderTop: `1px solid ${tint ?? 'var(--color-border)'}`, margin: 0, width: '100%' }} />
}
