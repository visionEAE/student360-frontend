import styles from './ProgressBar.module.css'

/** The paid/pending tuition bar: green fill over a danger-tinted track. */
export function ProgressBar({ ratio }: { ratio: number }) {
  const percent = Math.max(0, Math.min(1, ratio)) * 100
  return (
    <div className={styles.track} role="progressbar" aria-valuenow={Math.round(percent)} aria-valuemin={0} aria-valuemax={100}>
      <div className={styles.fill} style={{ width: `${percent}%` }} />
    </div>
  )
}
