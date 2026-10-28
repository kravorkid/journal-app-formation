import { api } from './api'
import { saveTokens, type Tokens } from './token-storage'

export type User = {
  id: string
  email: string
}

export type Session = {
  user: User
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export type Credentials = {
  email: string
  password: string
}

const persistSession = async ({ accessToken, refreshToken, expiresIn }: Session) => {
  const tokens: Tokens = { accessToken, refreshToken, expiresAt: Date.now() + expiresIn * 1000 }
  await saveTokens(tokens)
}

export const login = async (credentials: Credentials): Promise<User> => {
  const { data } = await api.post<Session>('/auth/login', credentials)
  await persistSession(data)
  return data.user
}

export const register = async (credentials: Credentials): Promise<User> => {
  const { data } = await api.post<Session>('/auth/register', credentials)
  await persistSession(data)
  return data.user
}

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout')
}

export const me = async (): Promise<User> => {
  const { data } = await api.get<{ user: User }>('/auth/me')
  return data.user
}
