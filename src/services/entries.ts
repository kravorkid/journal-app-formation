import { api } from './api'

export type Entry = {
  id: string
  title: string
  note: string
  lat: number | null
  lng: number | null
  createdAt: string
  photoUrl: string | null
}

export type EntryInput = {
  title: string
  note: string
  lat: number | null
  lng: number | null
}

export type EntryPatch = Partial<EntryInput>

export const getEntries = async (): Promise<Entry[]> => {
  const { data } = await api.get<Entry[]>('/entries')
  return data
}

export const createEntry = async (input: EntryInput): Promise<Entry> => {
  const { data } = await api.post<Entry>('/entries', input)
  return data
}

export const updateEntry = async (id: string, patch: EntryPatch): Promise<Entry> => {
  const { data } = await api.patch<Entry>(`/entries/${id}`, patch)
  return data
}

export const deleteEntry = async (id: string): Promise<void> => {
  await api.delete(`/entries/${id}`)
}

export const uploadPhoto = async (id: string, base64: string): Promise<void> => {
  await api.put(`/entries/${id}/photo`, { base64 })
}
