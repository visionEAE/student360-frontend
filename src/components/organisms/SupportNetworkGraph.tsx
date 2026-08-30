import { useEffect, useMemo, useRef, useState } from 'react'
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
 * A force-directed graph: the student is a center node, every connection is a node around it,
 * every rated edge a line whose thickness/opacity scales with its weight.
 *
 * d3-force owns only the physics: it mutates `node.x/y` (and `link.source/target`, replacing the
 * raw string ids with the actual node objects) in place on every tick. React owns every DOM
 * element it renders. The two are kept strictly separate: nothing here calls d3's `selectAll(...)
 * .data(...)` against elements React created — doing so was the original bug, since a d3 keyed
 * join calls its key function against each element's already-bound datum too, and an element
 * React rendered has none (`undefined`), so `undefined.id` threw and crashed the whole page.
 * Position updates instead go through a `tick` counter that forces a re-render, so JSX simply
 * reads the latest mutated `x`/`y` off the same node objects the simulation is animating.
 */
export function SupportNetworkGraph({ studentDisplayName, network, selectedId, onSelect, height = 460 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const zoomLayerRef = useRef<SVGGElement>(null)
  const simulationRef = useRef<Simulation<GraphNode, GraphLink> | null>(null)
  const zoomBehaviorRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null)
  const nodeElementsRef = useRef(new Map<string, SVGGElement>())

  const { nodes, links } = useMemo(() => buildGraphData(studentDisplayName, network), [studentDisplayName, network])
  // Bumped on every simulation tick so React re-renders with the positions d3 just mutated —
  // the only channel through which the simulation's output reaches the DOM.
  const [, forceRender] = useState(0)

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
      .on('tick', () => forceRender((tick) => tick + 1))
    simulationRef.current = simulation

    const svg = select(svgEl)
    const zoomLayer = select(zoomLayerRef.current!)
    const zoomBehavior = d3zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.4, 2.5])
      .on('zoom', (event) => zoomLayer.attr('transform', event.transform.toString()))
    svg.call(zoomBehavior)
    zoomBehaviorRef.current = zoomBehavior

    return () => {
      simulation.stop()
    }
    // Rebuilding the whole simulation when the data changes keeps this simple; the graph is small
    // enough that a full re-layout on every mutation is not noticeable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, links, height])

  // Drag, attached per node once its DOM element exists. Each element's datum is bound
  // explicitly via `.datum(node)` right before the call — never inferred from the DOM the way a
  // `selectAll(...).data(...)` join would, which is what made the crash this replaces possible.
  useEffect(() => {
    const simulation = simulationRef.current
    if (!simulation) {
      return
    }
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
    for (const node of nodes) {
      const element = nodeElementsRef.current.get(node.id)
      if (element) {
        select(element).datum(node).call(dragBehavior)
      }
    }
  }, [nodes])

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

  const nodesById = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes])

  return (
    <div ref={containerRef} className={styles.wrap} style={{ height }}>
      <svg ref={svgRef} className={styles.svg} role="img" aria-label="Red de apoyo">
        <g ref={zoomLayerRef}>
          {links.map((link) => {
            const source = resolveEndpoint(link.source, nodesById)
            const target = resolveEndpoint(link.target, nodesById)
            if (!source || !target) {
              return null
            }
            const { x1, y1, x2, y2 } = perpendicularPoints(source, target, link.offset)
            return (
              <line
                key={link.id}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={link.ratedBy === 'SELF' ? 'var(--color-primary)' : 'var(--color-text-muted)'}
                strokeWidth={1 + link.weight * 0.9}
                strokeOpacity={0.25 + link.weight * 0.065}
                strokeDasharray={link.ratedBy === 'SUPPORT_TEAM' ? '4 3' : undefined}
              />
            )
          })}
          {nodes.map((node) => (
            <g
              key={node.id}
              ref={(element) => {
                if (element) {
                  nodeElementsRef.current.set(node.id, element)
                } else {
                  nodeElementsRef.current.delete(node.id)
                }
              }}
              className={styles.node}
              transform={`translate(${node.x ?? 0},${node.y ?? 0})`}
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

/**
 * `link.source`/`link.target` start as plain string ids (see `buildGraphData`); d3-force's link
 * force replaces them with the actual node object in place once the simulation initializes. Both
 * shapes are handled here since React can render a tick before that replacement has happened.
 */
function resolveEndpoint(endpoint: GraphLink['source'] | GraphLink['target'], nodesById: Map<string, GraphNode>): GraphNode | undefined {
  if (typeof endpoint === 'string') {
    return nodesById.get(endpoint)
  }
  return endpoint as GraphNode | undefined
}

/** Offsets a link's endpoints perpendicular to its direction, so parallel edges never overlap. */
function perpendicularPoints(source: GraphNode, target: GraphNode, offset: number) {
  const x1 = source.x ?? 0
  const y1 = source.y ?? 0
  const x2 = target.x ?? 0
  const y2 = target.y ?? 0
  const dx = x2 - x1
  const dy = y2 - y1
  const length = Math.hypot(dx, dy) || 1
  const nx = (-dy / length) * offset * 10
  const ny = (dx / length) * offset * 10
  return { x1: x1 + nx, y1: y1 + ny, x2: x2 + nx, y2: y2 + ny }
}
