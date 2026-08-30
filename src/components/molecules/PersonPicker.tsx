import { useEffect, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import { coreApi } from '../../api/core'
import type { DirectoryEntry } from '../../api/types'
import { Icon, Input, Text } from '../atoms'
import styles from './PersonPicker.module.css'

export interface PickedPerson {
  reference: string
  displayName: string
}

interface PersonPickerProps {
  directoryKind: 'STUDENT' | 'PROFESSOR'
  value: PickedPerson | null
  onChange: (person: PickedPerson | null) => void
  placeholder: string
}

/**
 * A person must be a real record in core-service's SIS, not a freely typed name — this is what
 * lets professor/peer nodes in the support-network graph be traced back to who they actually are.
 * Debounced search against `GET /api/core/directory/search`; picking a result locks the field.
 */
export function PersonPicker({ directoryKind, value, onChange, placeholder }: PersonPickerProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<DirectoryEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const requestToken = useRef(0)

  useEffect(() => {
    const text = query.trim()
    if (text.length < 2) {
      return
    }
    setLoading(true)
    const token = ++requestToken.current
    const timeout = window.setTimeout(() => {
      coreApi
        .searchDirectory(text, directoryKind)
        .then((entries) => {
          if (requestToken.current === token) {
            setResults(entries)
            setLoading(false)
          }
        })
        .catch(() => {
          if (requestToken.current === token) {
            setResults([])
            setLoading(false)
          }
        })
    }, 300)
    return () => window.clearTimeout(timeout)
  }, [query, directoryKind])

  if (value) {
    return (
      <div className={styles.selected}>
        <Text variant="body">{value.displayName}</Text>
        <button
          type="button"
          className={styles.clear}
          onClick={() => onChange(null)}
          aria-label="Cambiar persona"
        >
          <Icon icon={X} size={16} />
        </button>
      </div>
    )
  }

  return (
    <div className={styles.wrap}>
      <Input
        leadingIcon={Search}
        placeholder={placeholder}
        value={query}
        onChange={(event) => {
          const next = event.target.value
          setQuery(next)
          if (next.trim().length < 2) {
            setResults([])
          }
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 150)}
      />
      {open && query.trim().length >= 2 ? (
        <div className={styles.results}>
          {loading ? (
            <Text variant="caption" className={styles.empty}>
              Buscando…
            </Text>
          ) : results.length === 0 ? (
            <Text variant="caption" color="var(--color-text-secondary)" className={styles.empty}>
              Sin resultados en el sistema académico.
            </Text>
          ) : (
            results.map((entry) => (
              <button
                key={entry.reference}
                type="button"
                className={styles.result}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  onChange({ reference: entry.reference, displayName: entry.displayName })
                  setQuery('')
                  setOpen(false)
                }}
              >
                <Text variant="body">{entry.displayName}</Text>
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  )
}
