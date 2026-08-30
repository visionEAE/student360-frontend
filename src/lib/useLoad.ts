import { useCallback, useEffect, useState } from 'react'

export interface LoadState<T> {
  data?: T
  error?: unknown
  loading: boolean
}

/** Each panel owns its loading state, error and data, so sections degrade independently. */
export function useLoad<T>(loader: () => Promise<T>, deps: unknown[]) {
  const [state, setState] = useState<LoadState<T>>({ loading: true })
  const [version, setVersion] = useState(0)
  const reload = useCallback(() => setVersion((value) => value + 1), [])

  useEffect(() => {
    let cancelled = false
    setState((previous) => ({ ...previous, loading: true, error: undefined }))
    loader().then(
      (data) => !cancelled && setState({ data, loading: false }),
      (error: unknown) => !cancelled && setState({ error, loading: false }),
    )
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, version])

  return { ...state, reload }
}
