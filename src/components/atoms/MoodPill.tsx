import { CloudRain, Meh, Smile, Sparkles } from 'lucide-react'
import type { Mood } from '../../api/types'
import { MOOD_LABELS } from '../../lib/labels'
import { Icon } from './Icon'
import styles from './MoodPill.module.css'

const MOOD_ICONS = { DIFFICULT: CloudRain, FAIR: Meh, GOOD: Smile, VERY_GOOD: Sparkles } as const
const MOOD_TONES = { DIFFICULT: 'danger', FAIR: 'warning', GOOD: 'success', VERY_GOOD: 'primary' } as const

interface MoodPillProps {
  mood: Mood
  selected: boolean
  onSelect: () => void
}

/** One of the four "¿Cómo te sientes con esto?" options; selection takes the mood's own tone. */
export function MoodPill({ mood, selected, onSelect }: MoodPillProps) {
  return (
    <button
      type="button"
      className={`${styles.pill} ${selected ? styles[MOOD_TONES[mood]] : ''}`}
      onClick={onSelect}
      aria-pressed={selected}
    >
      <Icon icon={MOOD_ICONS[mood]} size={20} />
      {MOOD_LABELS[mood]}
    </button>
  )
}
