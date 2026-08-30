import { describe, expect, it } from 'vitest'
import { describeSignals } from './signals'

describe('describeSignals', () => {
  const signals = {
    wellbeingLevel: 1,
    daysSinceLastAccess: 18,
    onTimeSubmissionRate: 0.62,
    coursesWithoutActivity: 2,
    overdueBalance: 1240000,
    daysOverdue: 15,
    financialHold: true,
    firedConditions: ['LOW_WELLBEING', 'NO_RECENT_LMS_ACCESS', 'OVERDUE_BALANCE'],
    unavailableSources: [],
  }

  it('turns fired conditions into the sentences of the alert card', () => {
    const sentences = describeSignals(signals, '2026-08-28T14:14:00Z')
    expect(sentences.map((s) => s.title)).toEqual([
      'Registro de bienestar bajo',
      'Sin acceso a la plataforma en 18 días',
      'Saldo vencido',
    ])
    expect(sentences[0].detail).toBe('Nivel autorreportado: Bajo · 28 ago. 2026')
    expect(sentences[2].detail).toBe('$1.240.000 COP vencidos desde hace 15 días')
  })

  it('explains manual alerts with the advisor reason', () => {
    const [sentence] = describeSignals(
      { ...signals, firedConditions: ['ADVISOR_JUDGEMENT'], reason: 'Faltó a tres citas seguidas' },
      null,
    )
    expect(sentence.detail).toBe('Faltó a tres citas seguidas')
  })

  it('returns nothing without signals', () => {
    expect(describeSignals(null, null)).toEqual([])
  })
})
