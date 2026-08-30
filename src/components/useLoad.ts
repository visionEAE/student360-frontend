import { useCallback, useEffect, useState } from 'react'

/** Minimal loader hook: each panel owns its loading state, error and data. */
export function useLoad<T>(loader: () => Promise<T>, deps: unknown[]) {
  const [state, setState] = useState<{ data?: T; error?: unknown; loading: boolean }>({ loading: true })
  const load = useCallback(() => {
    let cancelled = false
    setState({ loading: true })
    loader().then(
      (data) => !cancelled && setState({ data, loading: false }),
      (error: unknown) => !cancelled && setState({ error, loading: false }),
    )
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  useEffect(load, [load])
  return { ...state, reload: load }
}
