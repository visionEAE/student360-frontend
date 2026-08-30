import styles from './Spinner.module.css'

export function Spinner({ center }: { center?: boolean }) {
  const spinner = <span className={styles.spinner} role="status" aria-label="Cargando" />
  return center ? <div className={styles.center}>{spinner}</div> : spinner
}
