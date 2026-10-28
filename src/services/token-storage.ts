import { Preferences } from '@capacitor/preferences'

const KEY = 'auth-tokens'

export type Tokens = {
  accessToken: string
  refreshToken: string
  expiresAt: number
}

type Listener = (tokens: Tokens | null) => void

const EXPIRY_MARGIN_MS = 30_000

const listeners = new Set<Listener>()
let cache: Tokens | null | undefined

const notify = (tokens: Tokens | null) => listeners.forEach((listener) => listener(tokens))

export const onTokensChange = (listener: Listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const isAccessTokenExpired = (tokens: Tokens) => tokens.expiresAt - EXPIRY_MARGIN_MS <= Date.now()

export async function getTokens(): Promise<Tokens | null> {
  if (cache !== undefined) return cache
  const { value } = await Preferences.get({ key: KEY })
  try {
    cache = value ? (JSON.parse(value) as Tokens) : null
  } catch {
    cache = null
  }
  return cache
}

export async function saveTokens(tokens: Tokens): Promise<void> {
  cache = tokens
  await Preferences.set({ key: KEY, value: JSON.stringify(tokens) })
  notify(tokens)
}

export async function clearTokens(): Promise<void> {
  cache = null
  await Preferences.remove({ key: KEY })
  notify(null)
}
