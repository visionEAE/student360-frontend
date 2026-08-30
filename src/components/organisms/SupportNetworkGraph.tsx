import { useEffect, useMemo, useRef } from 'react'
import { forceCenter, forceCollide, forceLink, forceManyBody, forceSimulation, type Simulation } from 'd3-force'
import { drag as d3drag } from 'd3-drag'
import { select } from 'd3-selection'
import { zoom as d3zoom, zoomIdentity, type ZoomBehavior } from 'd3-zoom'
import type { SupportNetworkView } from '../../api/types'
import { buildGraphData, STUDENT_NODE_ID, type GraphLink, type GraphNode } from '../../lib/networkGraph'
import { initialsOf } from '../../lib/format'
import styles from './SupportNetworkGraph.module.css'

const KIND_COLOR: Record<string, string> = {
  STUDENT_CENTER: 'var(--color-primary)',
  FAMILY: 'var(--color-danger)',
  PEER: 'var(--color-info)',
  ADVISOR: 'var(--color-primary)',
  PROFESSOR: 'var(--color-success)',
  COUNSELOR: 'var(--color-warning)',
  OTHER: 'var(--color-text-muted)',
}

const NODE_RADIUS = 26
const CENTER_RADIUS = 34

interface Props {
  studentDisplayName: string
  network: SupportNetworkView
  selectedId: string | null
  onSelect: (id: string | null) => void
  height?: number
}

/**
 * A force-directed graph: the student is a fixed-ish center node, every connection is a node
 * around it, and every rated edge is a line whose thickness/opacity scales with its weight.
 * Positions are driven entirely by the d3-force simulation via its own React-independent tick
 * loop, mutating a ref'd node/link array and re-rendering through a version counter — cheap at
 * this graph's scale (a person's support network rarely exceeds a couple dozen people).
 */
export function SupportNetworkGraph({ studentDisplayName, network, selectedId, onSelect, height = 460 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const zoomLayerRef = useRef<SVGGElement>(null)
  const simulationRef = useRef<Simulation<GraphNode, GraphLink> | null>(null)
  const zoomBehaviorRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null)

  const { nodes, links } = useMemo(() => buildGraphData(studentDisplayName, network), [studentDisplayName, network]);

  useEffect(() => {
    const svgEl = svgRef.current
    const container = containerRef.current
    if (!svgEl || !container) {
      return
    }
    const width = container.clientWidth || 640

    const simulation = forceSimulation<GraphNode>(nodes)
      .force(
        'link',
        forceLink<GraphNode, GraphLink>(links)
          .id((node) => node.id)
          .distance((link) => 90 + (10 - link.weight) * 6),
      )
      .force('charge', forceManyBody().strength(-260))
      .force('center', forceCenter(width / 2, height / 2))
      .force('collide', forceCollide((node) => (node.isCenter ? CENTER_RADIUS : NODE_RADIUS) + 14))
    simulationRef.current = simulation

    const svg = select(svgEl)
    const zoomLayer = select(zoomLayerRef.current!)
    const zoomBehavior = d3zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.4, 2.5])
      .on('zoom', (event) => zoomLayer.attr('transform', event.transform.toString()))
    svg.call(zoomBehavior)
    zoomBehaviorRef.current = zoomBehavior

    const nodeSelection = zoomLayer.selectAll<SVGGElement, GraphNode>('.support-network-node').data(nodes, (node) => node.id)
    const dragBehavior = d3drag<SVGGElement, GraphNode>()
      .on('start', (event, node) => {
        if (!event.active) {
          simulation.alphaTarget(0.3).restart()
        }
        node.fx = node.x
        node.fy = node.y
      })
      .on('drag', (event, node) => {
        node.fx = event.x
        node.fy = event.y
      })
      .on('end', (event, node) => {
        if (!event.active) {
          simulation.alphaTarget(0)
        }
        node.fx = null
        node.fy = null
      })
    nodeSelection.call(dragBehavior)

    simulation.on('tick', () => {
      zoomLayer
        .selectAll<SVGLineElement, GraphLink>('.support-network-link')
        .attr('x1', (link) => perpendicular(link, 'x1'))
        .attr('y1', (link) => perpendicular(link, 'y1'))
        .attr('x2', (link) => perpendicular(link, 'x2'))
        .attr('y2', (link) => perpendicular(link, 'y2'))
      zoomLayer.selectAll<SVGGElement, GraphNode>('.support-network-node').attr('transform', (node) => `translate(${node.x ?? 0},${node.y ?? 0})`)
    })

    return () => {
      simulation.stop()
    }
    // Rebuilding the whole simulation when the data changes keeps this simple; the graph is small
    // enough that a full re-layout on every mutation is not noticeable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, links, height])

  const zoomBy = (factor: number) => {
    const svg = svgRef.current
    const zoomBehavior = zoomBehaviorRef.current
    if (svg && zoomBehavior) {
      select(svg).call(zoomBehavior.scaleBy, factor)
    }
  }
  const resetZoom = () => {
    const svg = svgRef.current
    const zoomBehavior = zoomBehaviorRef.current
    if (svg && zoomBehavior) {
      select(svg).call(zoomBehavior.transform, zoomIdentity)
    }
  }

  return (
    <div ref={containerRef} className={styles.wrap} style={{ height }}>
      <svg ref={svgRef} className={styles.svg} role="img" aria-label="Red de apoyo">
        <g ref={zoomLayerRef}>
          {links.map((link) => (
            <line
              key={link.id}
              className="support-network-link"
              stroke={link.ratedBy === 'SELF' ? 'var(--color-primary)' : 'var(--color-text-muted)'}
              strokeWidth={1 + link.weight * 0.9}
              strokeOpacity={0.25 + link.weight * 0.065}
              strokeDasharray={link.ratedBy === 'SUPPORT_TEAM' ? '4 3' : undefined}
            />
          ))}
          {nodes.map((node) => (
            <g
              key={node.id}
              className={`support-network-node ${styles.node}`}
              onClick={() => onSelect(node.id === STUDENT_NODE_ID ? null : node.id)}
            >
              {node.isPrimary ? (
                <circle
                  r={(node.isCenter ? CENTER_RADIUS : NODE_RADIUS) + 6}
                  className={styles.primaryBadge}
                  strokeDasharray="3 3"
                />
              ) : null}
              <circle
                r={node.isCenter ? CENTER_RADIUS : NODE_RADIUS}
                fill={KIND_COLOR[node.kind] ?? 'var(--color-text-muted)'}
                className={`${styles.nodeCircle} ${node.id === selectedId ? styles.selected : ''}`}
              />
              <text textAnchor="middle" dy="0.35em" className={styles.nodeLabel} fill="var(--color-on-primary)">
                {initialsOf(node.displayName)}
              </text>
              <text textAnchor="middle" y={(node.isCenter ? CENTER_RADIUS : NODE_RADIUS) + 16} className={styles.nodeLabel}>
                {node.displayName.length > 16 ? `${node.displayName.slice(0, 15)}…` : node.displayName}
              </text>
            </g>
          ))}
        </g>
      </svg>
      <div className={styles.zoomControls}>
        <button type="button" className={styles.zoomButton} onClick={() => zoomBy(1.3)} aria-label="Acercar">
          +
        </button>
        <button type="button" className={styles.zoomButton} onClick={() => zoomBy(1 / 1.3)} aria-label="Alejar">
          −
        </button>
        <button type="button" className={styles.zoomButton} onClick={resetZoom} aria-label="Restablecer vista">
          ⟲
        </button>
      </div>
    </div>
  )
}

/** Offsets a link's endpoint perpendicular to its direction, so parallel edges never overlap. */
function perpendicular(link: GraphLink, attr: 'x1' | 'y1' | 'x2' | 'y2'): number {
  const source = link.source as GraphNode
  const target = link.target as GraphNode
  const x1 = source.x ?? 0
  const y1 = source.y ?? 0
  const x2 = target.x ?? 0
  const y2 = target.y ?? 0
  const dx = x2 - x1
  const dy = y2 - y1
  const length = Math.hypot(dx, dy) || 1
  const nx = (-dy / length) * link.offset * 10
  const ny = (dx / length) * link.offset * 10
  switch (attr) {
    case 'x1':
      return x1 + nx
    case 'y1':
      return y1 + ny
    case 'x2':
      return x2 + nx
    case 'y2':
      return y2 + ny
  }
}
