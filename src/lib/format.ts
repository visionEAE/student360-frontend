const MONTHS = ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sept.', 'oct.', 'nov.', 'dic.']

function toDate(value: string | Date): Date {
  return value instanceof Date ? value : new Date(value)
}

/** `$1.240.000 COP` — Colombian thousands separator, no decimals. */
export function formatCop(amount: number | null | undefined, withCurrency = true): string {
  if (amount === null || amount === undefined || Number.isNaN(amount)) {
    return '—'
  }
  const digits = Math.round(Math.abs(amount)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  const sign = amount < 0 ? '-' : ''
  return `${sign}$${digits}${withCurrency ? ' COP' : ''}`
}

/** `28 ago. 2026` */
export function formatDate(value: string | Date | null | undefined): string {
  if (!value) {
    return '—'
  }
  const date = toDate(value)
  if (Number.isNaN(date.getTime())) {
    return '—'
  }
  return `${date.getDate().toString().padStart(2, '0')} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`
}

/** `28 ago. 2026 · 09:14 a. m.` */
export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) {
    return '—'
  }
  const date = toDate(value)
  if (Number.isNaN(date.getTime())) {
    return '—'
  }
  const hours = date.getHours()
  const suffix = hours < 12 ? 'a. m.' : 'p. m.'
  const twelve = hours % 12 === 0 ? 12 : hours % 12
  return `${formatDate(date)} · ${twelve.toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')} ${suffix}`
}

/** `Hace 2 h`, `Hace 1 d`, `Hace 1 sem` — the granularity the design uses. */
export function formatRelative(value: string | Date | null | undefined, now: Date = new Date()): string {
  if (!value) {
    return '—'
  }
  const date = toDate(value)
  const seconds = Math.max(0, Math.round((now.getTime() - date.getTime()) / 1000))
  if (seconds < 60) {
    return 'Ahora'
  }
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) {
    return `Hace ${minutes} min`
  }
  const hours = Math.round(minutes / 60)
  if (hours < 24) {
    return `Hace ${hours} h`
  }
  const days = Math.round(hours / 24)
  if (days < 7) {
    return `Hace ${days} d`
  }
  const weeks = Math.round(days / 7)
  if (weeks < 5) {
    return `Hace ${weeks} sem`
  }
  const months = Math.round(days / 30)
  return `Hace ${months} mes${months === 1 ? '' : 'es'}`
}

/** `Hace 3 días` for a day count (per-course activity table). */
export function formatDaysAgo(days: number | null | undefined): string {
  if (days === null || days === undefined) {
    return 'Sin ingresos'
  }
  if (days === 0) {
    return 'Hoy'
  }
  return `Hace ${days} día${days === 1 ? '' : 's'}`
}

/** `7.º de 10` */
export function formatSemesterOf(current: number | null | undefined, total: number | null | undefined): string {
  if (!current) {
    return '—'
  }
  return total ? `${current}.º de ${total}` : `${current}.º`
}

/** `7.º semestre` */
export function formatSemester(current: number | null | undefined): string {
  return current ? `${current}.º semestre` : '—'
}

export function formatGpa(value: number | null | undefined): string {
  return value === null || value === undefined ? '—' : `${value.toFixed(1)} / 5.0`
}

export function formatGrade(value: number | null | undefined): string {
  return value === null || value === undefined ? '—' : value.toFixed(1)
}

/** `62%` from a 0..1 rate. */
export function formatPercent(rate: number | null | undefined): string {
  return rate === null || rate === undefined ? '—' : `${Math.round(rate * 100)}%`
}

/** First letter of the first and last words: `María José Restrepo` → `MR`. */
export function initialsOf(fullName: string | null | undefined): string {
  // Only words that start with a letter count — a trailing annotation like "(madre)" must not
  // win the last-initial over "Rojas", and a name with no letters at all falls back to "?".
  const words = (fullName ?? '')
    .trim()
    .split(/\s+/)
    .filter((word) => /^\p{L}/u.test(word))
  if (words.length === 0) {
    return '?'
  }
  const first = words[0][0] ?? ''
  const last = words.length > 1 ? (words[words.length - 1][0] ?? '') : ''
  return `${first}${last}`.toUpperCase()
}

export function firstName(fullName: string | null | undefined): string {
  const words = (fullName ?? '').trim().split(/\s+/).filter(Boolean)
  // Compound first names ("María José") keep both parts, as the design's greeting does.
  if (words.length >= 3) {
    return `${words[0]} ${words[1]}`
  }
  return words[0] ?? ''
}
