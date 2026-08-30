import { Text } from '../atoms'
import styles from './BarChart.module.css'

export interface BarDatum {
  label: string
  valueLabel: string
  ratio: number
  color: string
}

/** The simple coloured-bar charts (GPA evolution, weekly wellbeing). */
export function BarChart({ data, maxHeight = 70, barWidth = 36 }: { data: BarDatum[]; maxHeight?: number; barWidth?: number }) {
  return (
    <div className={styles.chart} style={{ height: maxHeight + 34 }}>
      {data.map((point, index) => (
        <div className={styles.col} key={`${point.label}-${index}`} style={{ width: barWidth }}>
          <Text variant="tiny" color={point.color}>
            {point.valueLabel}
          </Text>
          <span
            className={styles.bar}
            style={{ width: barWidth, height: Math.max(4, point.ratio * maxHeight), background: point.color }}
          />
          <Text variant="tiny">{point.label}</Text>
        </div>
      ))}
    </div>
  )
}
