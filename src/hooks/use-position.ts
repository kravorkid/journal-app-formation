import { useCallback, useState } from 'react'
import { getPosition, type Position } from '../services/location'
import { useSettingsStore } from '../store/settings-store'

export function usePosition() {
  const precise = useSettingsStore((state) => state.preciseLocation)
  const [position, setPosition] = useState<Position | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setPosition(await getPosition(precise))
    } catch (err) {
      setPosition(null)
      setError(err instanceof Error ? err.message : 'Position indisponible.')
    } finally {
      setLoading(false)
    }
  }, [precise])

  return { position, loading, error, refresh }
}
