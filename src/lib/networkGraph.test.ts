import { describe, expect, it } from 'vitest'
import { buildGraphData, STUDENT_NODE_ID } from './networkGraph'
import type { SupportNetworkView } from '../api/types'

const network: SupportNetworkView = {
  studentId: 'S-1003',
  connections: [
    {
      person: { reference: 'P-mother', kind: 'FAMILY', displayName: 'Marta Rojas (madre)' },
      edges: [
        { weight: 9, relationshipLabel: 'FAMILY', ratedBy: 'SELF', updatedAt: '2026-08-30T00:00:00Z' },
      ],
    },
    {
      person: { reference: 'A-2001', kind: 'ADVISOR', displayName: 'Carlos Mejía' },
      edges: [
        { weight: 8, relationshipLabel: 'ADVISOR', ratedBy: 'SELF', updatedAt: '2026-08-30T00:00:00Z' },
        { weight: 6, relationshipLabel: 'MENTOR', ratedBy: 'SUPPORT_TEAM', updatedAt: '2026-08-30T00:00:00Z' },
      ],
    },
  ],
  primarySupport: {
    person: { reference: 'P-mother', kind: 'FAMILY', displayName: 'Marta Rojas (madre)' },
    edges: [{ weight: 9, relationshipLabel: 'FAMILY', ratedBy: 'SELF', updatedAt: '2026-08-30T00:00:00Z' }],
  },
  averageWeight: 7.67,
}

describe('buildGraphData', () => {
  it('creates a center node for the student plus one node per connection', () => {
    const { nodes } = buildGraphData('María Rojas', network)

    expect(nodes).toHaveLength(3)
    expect(nodes[0]).toMatchObject({ id: STUDENT_NODE_ID, isCenter: true, displayName: 'María Rojas' })
    expect(nodes.find((node) => node.id === 'P-mother')).toMatchObject({
      kind: 'FAMILY',
      displayName: 'Marta Rojas (madre)',
      isPrimary: true,
    })
    expect(nodes.find((node) => node.id === 'A-2001')).toMatchObject({ kind: 'ADVISOR', isPrimary: false })
  })

  it('creates one link per edge, offset so two raters on the same person never overlap', () => {
    const { links } = buildGraphData('María Rojas', network)

    expect(links).toHaveLength(3)
    const motherLinks = links.filter((link) => link.target === 'P-mother' || link.id.startsWith('P-mother'))
    expect(motherLinks).toHaveLength(1)
    expect(motherLinks[0]).toMatchObject({ source: STUDENT_NODE_ID, weight: 9, offset: 0 })

    const advisorLinks = links.filter((link) => link.id.startsWith('A-2001'))
    expect(advisorLinks).toHaveLength(2)
    const offsets = advisorLinks.map((link) => link.offset).sort((a, b) => a - b)
    expect(offsets).toEqual([-0.5, 0.5])
    expect(offsets[0]).not.toEqual(offsets[1])
    expect(advisorLinks.find((link) => link.ratedBy === 'SELF')).toMatchObject({ weight: 8 })
    expect(advisorLinks.find((link) => link.ratedBy === 'SUPPORT_TEAM')).toMatchObject({ weight: 6 })
  })

  it('falls back to the reference as the display name when none is given', () => {
    const withoutName: SupportNetworkView = {
      ...network,
      connections: [{ person: { reference: 'S-1007', kind: 'STUDENT', displayName: null }, edges: [] }],
      primarySupport: null,
    }

    const { nodes } = buildGraphData('María Rojas', withoutName)

    expect(nodes.find((node) => node.id === 'S-1007')).toMatchObject({ displayName: 'S-1007' })
  })

  it('produces only the center node when the network is empty', () => {
    const empty: SupportNetworkView = { studentId: 'S-1001', connections: [], primarySupport: null, averageWeight: null }

    const { nodes, links } = buildGraphData('Ana Torres', empty)

    expect(nodes).toEqual([
      { id: STUDENT_NODE_ID, kind: 'STUDENT_CENTER', displayName: 'Ana Torres', isCenter: true, isPrimary: false },
    ])
    expect(links).toEqual([])
  })
})
