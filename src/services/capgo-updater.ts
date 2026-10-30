import { App } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'
import { CapacitorUpdater } from '@capgo/capacitor-updater'
import { useAppStore } from '../store/app-store'

export function initCapgoUpdater() {
  if (!Capacitor.isNativePlatform()) return

  const store = useAppStore.getState()

  void CapacitorUpdater.notifyAppReady()

  void CapacitorUpdater.addListener('updaterEvent', (event) => {
    switch (event.type) {
      case 'download':
        store.setBundleDownloading(event.data.bundle.version, event.data.percent)
        break
      case 'downloadComplete':
      case 'updateAvailable':
        store.setBundleReady(event.data.bundle.version)
        break
      case 'noNeedUpdate':
        store.setBundleIdle()
        break
      case 'downloadFailed':
        store.setBundleFailed(event.data.version)
        break
      case 'updateFailed':
        store.setBundleFailed(event.data.bundle.version)
        break
    }
  })

  void App.getInfo()
    .then(({ version, build }) => store.setNativeInfo({ version, build }))
    .catch(() => undefined)

  void CapacitorUpdater.current()
    .then(({ bundle }) => store.setBundleVersion(bundle.version))
    .catch(() => undefined)

  void CapacitorUpdater.getNextBundle()
    .then((next) => {
      if (next && next.id !== 'builtin' && next.status !== 'downloading') store.setBundleReady(next.version)
    })
    .catch(() => undefined)
}
