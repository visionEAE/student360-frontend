import { useState } from 'react'
import { Button, Text } from '../atoms'
import { WellbeingEntryRow } from '../molecules'
import { Card } from './Card'
import type { WellbeingEntrySummary } from '../../api/types'

export function WellbeingTimelineCard({ entries }: { entries: WellbeingEntrySummary[] }) {
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? entries : entries.slice(0, 4)
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text variant="cardTitle">Registros de bienestar</Text>
        {entries.length > 4 ? (
          <Button variant="ghost" onClick={() => setExpanded((value) => !value)}>
            {expanded ? 'Ver menos' : 'Ver todos'}
          </Button>
        ) : null}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {visible.length === 0 ? (
          <Text variant="caption">Todavía no hay registros de bienestar.</Text>
        ) : (
          visible.map((entry) => (
            <WellbeingEntryRow key={entry.entryId} level={entry.level} note={entry.summaryNote} recordedAt={entry.recordedAt} />
          ))
        )}
      </div>
    </Card>
  )
}
