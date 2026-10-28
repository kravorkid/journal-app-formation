import { create } from 'zustand'
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware'
import { Preferences } from '@capacitor/preferences'

const preferencesStorage: StateStorage = {
  getItem: async (name) => (await Preferences.get({ key: name })).value,
  setItem: async (name, value) => {
    await Preferences.set({ key: name, value })
  },
  removeItem: async (name) => {
    await Preferences.remove({ key: name })
  },
}

type SettingsState = {
  preciseLocation: boolean
  setPreciseLocation: (value: boolean) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      preciseLocation: true,
      setPreciseLocation: (preciseLocation) => set({ preciseLocation }),
    }),
    {
      name: 'settings',
      storage: createJSONStorage(() => preferencesStorage),
      partialize: (state) => ({ preciseLocation: state.preciseLocation }),
    },
  ),
)
