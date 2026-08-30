import type { TriggeringSignals } from '../api/types'
import { formatCop, formatDate, formatPercent } from './format'
import { levelLabel } from './labels'

export interface SignalSentence {
  code: string
  title: string
  detail: string
}

/**
 * Turns the machine-readable `triggeringSignals` of an alert into the sentences the design
 * shows under "Por qué se generó esta alerta". The alert stays explainable to a human.
 */
export function describeSignals(
  signals: TriggeringSignals | null | undefined,
  generatedAt: string | null | undefined,
): SignalSentence[] {
  if (!signals) {
    return []
  }
  const when = formatDate(generatedAt)
  return signals.firedConditions.map((code) => {
    switch (code) {
      case 'LOW_WELLBEING':
        return {
          code,
          title: 'Registro de bienestar bajo',
          detail: `Nivel autorreportado: ${levelLabel(signals.wellbeingLevel)} · ${when}`,
        }
      case 'NO_RECENT_LMS_ACCESS':
        return {
          code,
          title:
            signals.daysSinceLastAccess === null || signals.daysSinceLastAccess === undefined
              ? 'Sin acceso a la plataforma'
              : `Sin acceso a la plataforma en ${signals.daysSinceLastAccess} días`,
          detail:
            signals.coursesWithoutActivity !== null && signals.coursesWithoutActivity !== undefined
              ? `${signals.coursesWithoutActivity} curso${signals.coursesWithoutActivity === 1 ? '' : 's'} sin actividad reciente`
              : 'Sin actividad reciente en sus cursos',
        }
      case 'LOW_ON_TIME_SUBMISSION_RATE':
        return {
          code,
          title: 'Entregas a tiempo por debajo del umbral',
          detail: `Entregas a tiempo: ${formatPercent(signals.onTimeSubmissionRate)}`,
        }
      case 'OVERDUE_BALANCE':
        return {
          code,
          title: 'Saldo vencido',
          detail:
            signals.daysOverdue !== null && signals.daysOverdue !== undefined
              ? `${formatCop(signals.overdueBalance)} vencidos desde hace ${signals.daysOverdue} días`
              : `${formatCop(signals.overdueBalance)} vencidos`,
        }
      case 'ADVISOR_JUDGEMENT':
        return { code, title: 'Registrada por la acompañante', detail: signals.reason ?? 'Criterio profesional' }
      default:
        return { code, title: code, detail: '' }
    }
  })
}
