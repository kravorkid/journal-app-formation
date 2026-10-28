import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { getTokens, saveTokens, clearTokens, isAccessTokenExpired, type Tokens } from './token-storage'

const BASE_URL = 'https://journal-api-0lke.onrender.com'

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
})

const bareApi = axios.create({ baseURL: BASE_URL, timeout: 30_000 })

export const httpStatus = (error: unknown) => (axios.isAxiosError(error) ? error.response?.status : undefined)

const isAuthRoute = (url?: string) => /^\/?auth\/(login|register|refresh)/.test(url ?? '')

let refreshing: Promise<Tokens> | undefined

async function refresh(): Promise<Tokens> {
  const current = await getTokens()
  if (!current) throw new Error('Aucune session')
  try {
    const { data } = await bareApi.post('/auth/refresh', { refreshToken: current.refreshToken })
    const tokens: Tokens = {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresAt: Date.now() + data.expiresIn * 1000,
    }
    await saveTokens(tokens)
    return tokens
  } catch (error) {
    const status = httpStatus(error)
    if (status === 400 || status === 401) await clearTokens()
    throw error
  }
}

function refreshTokens(): Promise<Tokens> {
  refreshing ??= refresh().finally(() => {
    refreshing = undefined
  })
  return refreshing
}

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  if (isAuthRoute(config.url)) return config
  let tokens = await getTokens()
  if (tokens && isAccessTokenExpired(tokens)) {
    tokens = await refreshTokens()
  }
  if (tokens) config.headers.Authorization = `Bearer ${tokens.accessToken}`
  return config
})

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean }

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetriableConfig | undefined
    if (error.response?.status !== 401 || !config || config._retry || isAuthRoute(config.url)) {
      return Promise.reject(error)
    }
    config._retry = true
    const tokens = await refreshTokens()
    config.headers.Authorization = `Bearer ${tokens.accessToken}`
    return api(config)
  },
)
