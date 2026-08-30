import type { Dimension, Mood, WellbeingDimensionInput, WellbeingEntryRequest } from '../api/types'
import { MOOD_LEVEL } from './labels'

export const DIMENSIONS: Dimension[] = ['ECONOMIC', 'ACADEMIC', 'EMOTIONAL']

export interface DimensionFormState {
  mood: Mood | null
  needs: string[]
  note: string
}

export type SafeSpaceFormState = Record<Dimension, DimensionFormState>

export function emptyForm(): SafeSpaceFormState {
  return {
    ECONOMIC: { mood: null, needs: [], note: '' },
    ACADEMIC: { mood: null, needs: [], note: '' },
    EMOTIONAL: { mood: null, needs: [], note: '' },
  }
}

export function formFromDraft(dimensions: WellbeingDimensionInput[] | undefined): SafeSpaceFormState {
  const form = emptyForm()
  for (const dimension of dimensions ?? []) {
    form[dimension.dimension] = {
      mood: dimension.mood,
      needs: [...dimension.needs],
      note: dimension.note ?? '',
    }
  }
  return form
}

/** Selecting "Nada por ahora" clears the other needs, and any other need clears it. */
export function toggleNeed(needs: string[], code: string): string[] {
  if (needs.includes(code)) {
    return needs.filter((need) => need !== code)
  }
  if (code === 'NOTHING') {
    return ['NOTHING']
  }
  return [...needs.filter((need) => need !== 'NOTHING'), code]
}

/** The entry level the backend will compute: the lowest mood of the answered dimensions. */
export function levelFromForm(form: SafeSpaceFormState): number | null {
  const levels = DIMENSIONS.map((key) => form[key].mood)
    .filter((mood): mood is Mood => mood !== null)
    .map((mood) => MOOD_LEVEL[mood])
  return levels.length === 0 ? null : Math.min(...levels)
}

export function missingDimensions(form: SafeSpaceFormState): Dimension[] {
  return DIMENSIONS.filter((key) => form[key].mood === null)
}

export function hasAnyAnswer(form: SafeSpaceFormState): boolean {
  return DIMENSIONS.some((key) => form[key].mood !== null || form[key].needs.length > 0 || form[key].note.trim() !== '')
}

/** Drafts carry whatever was answered; sending requires the three moods. */
export function toEntryRequest(form: SafeSpaceFormState, status: 'DRAFT' | 'SENT'): WellbeingEntryRequest {
  if (status === 'SENT' && missingDimensions(form).length > 0) {
    throw new Error('Every dimension needs a mood before sending')
  }
  const dimensions = DIMENSIONS.filter((key) => form[key].mood !== null).map((key) => {
    const state = form[key]
    return {
      dimension: key,
      mood: state.mood as Mood,
      needs: state.needs,
      note: state.note.trim() === '' ? null : state.note.trim(),
    }
  })
  return { status, dimensions }
}
