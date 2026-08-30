import type { LucideIcon } from 'lucide-react'

interface IconProps {
  icon: LucideIcon
  size?: number
  color?: string
  className?: string
}

/** Every pictogram in the design is a lucide icon; stroke inherits currentColor by default. */
export function Icon({ icon: Lucide, size = 16, color, className }: IconProps) {
  return <Lucide size={size} className={className} style={color ? { color } : undefined} aria-hidden />
}
