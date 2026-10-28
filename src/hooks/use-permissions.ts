import { useCallback, useEffect, useState } from 'react'
import { App } from '@capacitor/app'
import {
  checkPermission,
  openAppSettings,
  requestPermission,
  type PermissionKind,
  type PermissionState,
} from '../services/permissions'

type PermissionStates = Record<PermissionKind, PermissionState>

const KINDS: PermissionKind[] = ['camera', 'location']

export function usePermissions() {
  const [states, setStates] = useState<PermissionStates>({ camera: 'prompt', location: 'prompt' })

  const refresh = useCallback(async () => {
    const [camera, location] = await Promise.all(KINDS.map(checkPermission))
    setStates({ camera, location })
  }, [])

  useEffect(() => {
    const listener = App.addListener('appStateChange', ({ isActive }) => {
      if (isActive) void refresh()
    })
    return () => {
      void listener.then((handle) => handle.remove())
    }
  }, [refresh])

  const enable = useCallback(
    async (kind: PermissionKind) => {
      const current = await checkPermission(kind)
      if (current === 'denied') {
        await openAppSettings()
        return
      }
      const next = await requestPermission(kind)
      setStates((previous) => ({ ...previous, [kind]: next }))
    },
    [],
  )

  return { states, refresh, enable }
}
