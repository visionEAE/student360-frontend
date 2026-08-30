import type { SimulationLinkDatum, SimulationNodeDatum } from 'd3-force'
import type { PersonKind, RaterType, RelationshipLabel, SupportNetworkView } from '../api/types'

export const STUDENT_NODE_ID = '__student__'

export interface GraphNode extends SimulationNodeDatum {
  id: string
  kind: PersonKind | 'STUDENT_CENTER'
  displayName: string
  isCenter: boolean
  isPrimary: boolean
}

export interface GraphLink extends SimulationLinkDatum<GraphNode> {
  id: string
  weight: number
  relationshipLabel: RelationshipLabel
  ratedBy: RaterType
  updatedAt: string
  /** Parallel-edge separation for a person with two raters: -1, 0 or 1. */
  offset: number
}

export interface GraphData {
  nodes: GraphNode[]
  links: GraphLink[]
}

/**
 * Turns one student's support network into force-graph input: a fixed center node for the
 * student, one node per connection, and one link per edge — two edges on the same person (a
 * SELF rating and a SUPPORT_TEAM rating) become two parallel links via `offset`, never merged
 * into one, so neither rater's number is ever silently averaged away.
 */
export function buildGraphData(studentDisplayName: string, network: SupportNetworkView): GraphData {
  const nodes: GraphNode[] = [
    {
      id: STUDENT_NODE_ID,
      kind: 'STUDENT_CENTER',
      displayName: studentDisplayName,
      isCenter: true,
      isPrimary: false,
    },
  ]
  const links: GraphLink[] = []
  const primaryReference = network.primarySupport?.person.reference ?? null

  for (const connection of network.connections) {
    const { person, edges } = connection
    nodes.push({
      id: person.reference,
      kind: person.kind,
      displayName: person.displayName ?? person.reference,
      isCenter: false,
      isPrimary: person.reference === primaryReference,
    })
    const offsets = edgeOffsets(edges.length)
    edges.forEach((edge, index) => {
      links.push({
        id: `${person.reference}:${edge.ratedBy}`,
        source: STUDENT_NODE_ID,
        target: person.reference,
        weight: edge.weight,
        relationshipLabel: edge.relationshipLabel,
        ratedBy: edge.ratedBy,
        updatedAt: edge.updatedAt,
        offset: offsets[index],
      })
    })
  }
  return { nodes, links }
}

function edgeOffsets(count: number): number[] {
  if (count <= 1) {
    return [0]
  }
  // Evenly spread around 0 so parallel lines never overlap: 2 edges -> [-0.5, 0.5]; 3 -> [-1, 0, 1].
  const span = count - 1
  return Array.from({ length: count }, (_, index) => index - span / 2)
}
