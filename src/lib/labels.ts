import type {
  AlertStatus,
  Dimension,
  Mood,
  Participation,
  PersonKind,
  PlanStatus,
  PlanType,
  RaterType,
  RelationshipLabel,
  RequestStatus,
  RequestType,
  RiskLevel,
  Severity,
  StatusLevel,
} from '../api/types'

export type Tone = 'danger' | 'warning' | 'success' | 'info' | 'neutral' | 'primary'

/** Wellbeing level 1–4 → the three labels the design uses. */
export function levelLabel(level: number | null | undefined): string {
  if (level === null || level === undefined) {
    return 'Sin registro'
  }
  if (level <= 1) {
    return 'Bajo'
  }
  if (level === 2) {
    return 'Medio'
  }
  return 'Bien'
}

export function levelTone(level: number | null | undefined): Tone {
  if (level === null || level === undefined) {
    return 'neutral'
  }
  if (level <= 1) {
    return 'danger'
  }
  if (level === 2) {
    return 'warning'
  }
  return 'success'
}

/** Short label for chart bars: `Bien`, `Reg`, `Bajo`. */
export function levelShortLabel(level: number | null | undefined): string {
  if (level === null || level === undefined) {
    return '—'
  }
  if (level <= 1) {
    return 'Bajo'
  }
  if (level === 2) {
    return 'Reg'
  }
  return 'Bien'
}

export const MOOD_LABELS: Record<Mood, string> = {
  DIFFICULT: 'Difícil',
  FAIR: 'Regular',
  GOOD: 'Bien',
  VERY_GOOD: 'Muy bien',
}

export const MOOD_LEVEL: Record<Mood, number> = { DIFFICULT: 1, FAIR: 2, GOOD: 3, VERY_GOOD: 4 }

export const DIMENSION_LABELS: Record<Dimension, { title: string; caption: string }> = {
  ECONOMIC: { title: 'Económico', caption: 'Cómo va tu situación financiera' },
  ACADEMIC: { title: 'Académico', caption: 'Cómo vas con tus materias y carga académica' },
  EMOTIONAL: { title: 'Emocional', caption: 'Cómo te sientes en general estos días' },
}

export const NEEDS_BY_DIMENSION: Record<Dimension, { code: string; label: string }[]> = {
  ECONOMIC: [
    { code: 'SCHOLARSHIP_INFO', label: 'Info sobre becas' },
    { code: 'PAYMENT_PLAN', label: 'Plan de pagos' },
    { code: 'TALK_FINANCIAL_WELLBEING', label: 'Hablar con Bienestar Financiero' },
    { code: 'NOTHING', label: 'Nada por ahora' },
  ],
  ACADEMIC: [
    { code: 'TUTORING', label: 'Tutoría' },
    { code: 'ADJUST_WORKLOAD', label: 'Ajustar carga académica' },
    { code: 'TALK_TO_PROFESSOR', label: 'Hablar con un profesor' },
    { code: 'NOTHING', label: 'Nada por ahora' },
  ],
  EMOTIONAL: [
    { code: 'TALK_TO_SOMEONE', label: 'Hablar con alguien' },
    { code: 'PSYCHOLOGICAL_SUPPORT', label: 'Apoyo psicológico' },
    { code: 'JUST_SHARING', label: 'Solo quería contarlo' },
    { code: 'NOTHING', label: 'Nada por ahora' },
  ],
}

export function needLabel(code: string): string {
  for (const needs of Object.values(NEEDS_BY_DIMENSION)) {
    const found = needs.find((need) => need.code === code)
    if (found) {
      return found.label
    }
  }
  return code
}

export const STATUS_LABELS: Record<StatusLevel, string> = {
  ON_TRACK: 'Al día',
  WATCH: 'Vigilar',
  AT_RISK: 'En riesgo',
  UNKNOWN: 'Sin datos',
}

export const STATUS_TONES: Record<StatusLevel, Tone> = {
  ON_TRACK: 'success',
  WATCH: 'warning',
  AT_RISK: 'danger',
  UNKNOWN: 'neutral',
}

export const RISK_LABELS: Record<RiskLevel, string> = {
  LOW: 'Riesgo bajo',
  MEDIUM: 'Riesgo medio',
  HIGH: 'Riesgo alto',
}

export const RISK_TONES: Record<RiskLevel, Tone> = { LOW: 'success', MEDIUM: 'warning', HIGH: 'danger' }

export const SEVERITY_TITLES: Record<Severity, string> = {
  HIGH: 'Alerta de severidad alta',
  MEDIUM: 'Alerta de severidad media',
}

export const ALERT_STATUS_LABELS: Record<AlertStatus, string> = {
  OPEN: 'Abierta',
  ACKNOWLEDGED: 'En seguimiento',
  CLOSED: 'Cerrada',
}

export const PLAN_TYPE_LABELS: Record<PlanType, string> = {
  INTEGRAL_SUPPORT: 'Seguimiento combinado económico y emocional',
  ACADEMIC_FOLLOW_UP: 'Seguimiento académico',
}

export const PLAN_STATUS_LABELS: Record<PlanStatus, string> = {
  PROPOSED: 'Pendiente de revisión',
  ACTIVE: 'En curso',
  COMPLETED: 'Completada',
}

export const PLAN_STATUS_TONES: Record<PlanStatus, Tone> = { PROPOSED: 'info', ACTIVE: 'primary', COMPLETED: 'success' }

export const REQUEST_TYPE_LABELS: Record<RequestType, string> = {
  FINANCIAL_WELLBEING_REFERRAL: 'Remisión a Bienestar Financiero',
  PSYCHOLOGICAL_SUPPORT_REFERRAL: 'Remisión a apoyo psicológico',
  TUTORING: 'Tutoría',
  WORKLOAD_ADJUSTMENT: 'Ajuste de carga académica',
  PROFESSOR_MEETING: 'Reunión con profesor',
  OTHER: 'Otra',
}

export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  OPEN: 'Abierta',
  IN_PROGRESS: 'En proceso',
  RESOLVED: 'Resuelta',
}

export const REQUEST_STATUS_TONES: Record<RequestStatus, Tone> = { OPEN: 'warning', IN_PROGRESS: 'info', RESOLVED: 'success' }

export const PARTICIPATION_LABELS: Record<Participation, string> = {
  ACTIVE: 'Activa',
  MODERATE: 'Moderada',
  LOW: 'Baja',
  INACTIVE: 'Inactiva',
}

export const PARTICIPATION_TONES: Record<Participation, Tone> = {
  ACTIVE: 'success',
  MODERATE: 'warning',
  LOW: 'danger',
  INACTIVE: 'danger',
}

export function academicStandingLabel(standing: string | null | undefined): string {
  switch (standing) {
    case 'GOOD':
      return 'Al día'
    case 'PROBATION':
      return 'Vigilar'
    case 'AT_RISK':
      return 'En riesgo'
    default:
      return 'Sin datos'
  }
}

export function enrollmentLabel(status: string | null | undefined): string {
  switch (status) {
    case 'ACTIVE':
      return 'Matrícula activa'
    case 'ON_LEAVE':
      return 'En licencia'
    case 'WITHDRAWN':
      return 'Retirada'
    default:
      return 'Sin datos'
  }
}

export function roleLabel(roles: string[]): string {
  if (roles.includes('ADMIN')) {
    return 'Administración'
  }
  if (roles.includes('ADVISOR')) {
    return 'Acompañante académica'
  }
  return 'Estudiante'
}

export function trendLabel(trend: 'UP' | 'DOWN' | 'STABLE' | null | undefined): { label: string; tone: Tone } {
  switch (trend) {
    case 'UP':
      return { label: 'Mejorando', tone: 'success' }
    case 'DOWN':
      return { label: 'En descenso', tone: 'warning' }
    case 'STABLE':
      return { label: 'Estable', tone: 'neutral' }
    default:
      return { label: 'Sin datos', tone: 'neutral' }
  }
}

export const PERSON_KIND_LABELS: Record<PersonKind, string> = {
  STUDENT: 'Estudiante',
  ADVISOR: 'Acompañante',
  PROFESSOR: 'Profesor(a)',
  FAMILY: 'Familia',
  PEER: 'Amigo(a)',
  COUNSELOR: 'Consejero(a)',
  OTHER: 'Otro',
}

export const RELATIONSHIP_LABEL_LABELS: Record<RelationshipLabel, string> = {
  FAMILY: 'Familia',
  FRIEND: 'Amistad',
  ADVISOR: 'Acompañamiento',
  MENTOR: 'Mentoría',
  COUNSELOR: 'Consejería',
  PROFESSOR: 'Docencia',
  PEER: 'Entre pares',
  OTHER: 'Otro',
}

export function raterLabel(rater: RaterType): string {
  return rater === 'SELF' ? 'Tú' : 'Equipo de acompañamiento'
}
