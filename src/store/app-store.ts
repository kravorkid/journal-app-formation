import { create } from 'zustand'

type BundleStatus = 'idle' | 'downloading' | 'ready' | 'failed'

type AppState = {
  bundleVersion: string | null
  bundleStatus: BundleStatus
  pendingBundleVersion: string | null
  downloadPercent: number
  nativeVersion: string | null
  nativeBuild: string | null
  setBundleVersion: (version: string) => void
  setBundleIdle: () => void
  setBundleDownloading: (version: string, percent: number) => void
  setBundleReady: (version: string) => void
  setBundleFailed: (version: string) => void
  setNativeInfo: (info: { version: string; build: string }) => void
}

export const useAppStore = create<AppState>()((set) => ({
  bundleVersion: null,
  bundleStatus: 'idle',
  pendingBundleVersion: null,
  downloadPercent: 0,
  nativeVersion: null,
  nativeBuild: null,
  setBundleVersion: (bundleVersion) => set({ bundleVersion }),
  setBundleIdle: () => set({ bundleStatus: 'idle', pendingBundleVersion: null, downloadPercent: 0 }),
  setBundleDownloading: (version, percent) =>
    set({ bundleStatus: 'downloading', pendingBundleVersion: version, downloadPercent: percent }),
  setBundleReady: (version) => set({ bundleStatus: 'ready', pendingBundleVersion: version, downloadPercent: 100 }),
  setBundleFailed: (version) => set({ bundleStatus: 'failed', pendingBundleVersion: version, downloadPercent: 0 }),
  setNativeInfo: ({ version, build }) => set({ nativeVersion: version, nativeBuild: build }),
}))

export const selectIsBundleDownloading = (state: AppState) => state.bundleStatus === 'downloading'
export const selectIsBundleReady = (state: AppState) => state.bundleStatus === 'ready'
export const selectIsBundleFailed = (state: AppState) => state.bundleStatus === 'failed'

// Format : v1.4.0 b27 o1.4.2
// v = version native (release du store, App.getInfo().version)
// b = numéro de build du binaire (App.getInfo().build)
// o = version du bundle OTA Capgo, soit le code web réellement exécuté ("obuiltin" = code livré dans le binaire)
// Une partie encore inconnue est omise.
export const selectVersionLabel = (state: AppState) =>
  [
    state.nativeVersion && `v${state.nativeVersion}`,
    state.nativeBuild && `b${state.nativeBuild}`,
    state.bundleVersion && `o${state.bundleVersion}`,
  ]
    .filter(Boolean)
    .join(' ')
