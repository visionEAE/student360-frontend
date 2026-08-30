import { describe, expect, it } from 'vitest'
import { emptyForm, formFromDraft, levelFromForm, missingDimensions, toEntryRequest, toggleNeed } from './wellbeing'

describe('safe space form logic', () => {
  it('derives the entry level from the lowest mood', () => {
    const form = emptyForm()
    form.ECONOMIC.mood = 'DIFFICULT'
    form.ACADEMIC.mood = 'FAIR'
    form.EMOTIONAL.mood = 'VERY_GOOD'
    expect(levelFromForm(form)).toBe(1)
    expect(levelFromForm(emptyForm())).toBeNull()
  })

  it('requires the three moods to send but not to draft', () => {
    const form = emptyForm()
    form.ECONOMIC.mood = 'GOOD'
    expect(missingDimensions(form)).toEqual(['ACADEMIC', 'EMOTIONAL'])
    expect(() => toEntryRequest(form, 'SENT')).toThrow()
    expect(toEntryRequest(form, 'DRAFT').dimensions).toHaveLength(1)
  })

  it('makes "Nada por ahora" exclusive', () => {
    expect(toggleNeed(['TUTORING'], 'NOTHING')).toEqual(['NOTHING'])
    expect(toggleNeed(['NOTHING'], 'TUTORING')).toEqual(['TUTORING'])
    expect(toggleNeed(['TUTORING'], 'TUTORING')).toEqual([])
  })

  it('round-trips a draft into the form and back', () => {
    const form = formFromDraft([{ dimension: 'ACADEMIC', mood: 'FAIR', needs: ['TUTORING'], note: ' revisar carga ' }])
    expect(form.ACADEMIC.mood).toBe('FAIR')
    const request = toEntryRequest(form, 'DRAFT')
    expect(request.dimensions).toEqual([{ dimension: 'ACADEMIC', mood: 'FAIR', needs: ['TUTORING'], note: 'revisar carga' }])
  })
})
