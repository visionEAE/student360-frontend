import type { ReactNode } from 'react'
import { Text } from '../atoms'
import styles from './DataTable.module.css'

export interface DataColumn<T> {
  key: string
  header: string
  width?: number
  render: (row: T) => ReactNode
}

interface DataTableProps<T> {
  columns: DataColumn<T>[]
  rows: T[]
  rowKey: (row: T) => string
  onRowClick?: (row: T) => void
  emptyLabel?: string
}

export function DataTable<T>({ columns, rows, rowKey, onRowClick, emptyLabel }: DataTableProps<T>) {
  return (
    <div className={styles.table}>
      <div className={styles.headerRow}>
        {columns.map((column) => (
          <div key={column.key} className={`${styles.cell} ${column.width ? '' : styles.grow}`} style={{ width: column.width }}>
            <Text variant="tiny" as="span" style={{ fontWeight: 700, color: 'var(--color-text-secondary)' }}>
              {column.header}
            </Text>
          </div>
        ))}
      </div>
      {rows.length === 0 ? (
        <div className={styles.row}>
          <Text variant="caption">{emptyLabel ?? 'Sin datos.'}</Text>
        </div>
      ) : (
        rows.map((row) => (
          <div
            key={rowKey(row)}
            className={styles.row}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
            style={onRowClick ? { cursor: 'pointer' } : undefined}
          >
            {columns.map((column) => (
              <div key={column.key} className={`${styles.cell} ${column.width ? '' : styles.grow}`} style={{ width: column.width }}>
                {column.render(row)}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  )
}
