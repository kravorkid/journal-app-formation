import { create } from 'zustand'
import {
  createEntry,
  deleteEntry,
  getEntries,
  updateEntry,
  uploadPhoto,
  type Entry,
  type EntryInput,
  type EntryPatch,
} from '../services/entries'
import { getErrorMessage } from '../services/errors'

type EntriesState = {
  entries: Entry[]
  loaded: boolean
  loading: boolean
  error: string | null
  fetchEntries: () => Promise<void>
  addEntry: (input: EntryInput, photoBase64: string | null) => Promise<Entry>
  editEntry: (id: string, patch: EntryPatch) => Promise<void>
  changePhoto: (id: string, photoBase64: string) => Promise<void>
  removeEntry: (id: string) => Promise<void>
  reset: () => void
}

const initialState = { entries: [], loaded: false, loading: false, error: null }

export const useEntriesStore = create<EntriesState>()((set, get) => ({
  ...initialState,
  fetchEntries: async () => {
    set({ loading: true, error: null })
    try {
      const entries = await getEntries()
      set({ entries, loaded: true, loading: false })
    } catch (error) {
      set({ loading: false, error: getErrorMessage(error) })
    }
  },
  addEntry: async (input, photoBase64) => {
    let entry = await createEntry(input)
    if (photoBase64) {
      await uploadPhoto(entry.id, photoBase64)
      await get().fetchEntries()
      entry = get().entries.find((item) => item.id === entry.id) ?? entry
    } else {
      set({ entries: [entry, ...get().entries] })
    }
    return entry
  },
  editEntry: async (id, patch) => {
    const updated = await updateEntry(id, patch)
    set({ entries: get().entries.map((entry) => (entry.id === id ? updated : entry)) })
  },
  changePhoto: async (id, photoBase64) => {
    await uploadPhoto(id, photoBase64)
    await get().fetchEntries()
  },
  removeEntry: async (id) => {
    await deleteEntry(id)
    set({ entries: get().entries.filter((entry) => entry.id !== id) })
  },
  reset: () => set(initialState),
}))

export const selectEntryById = (id: string) => (state: EntriesState) =>
  state.entries.find((entry) => entry.id === id)
