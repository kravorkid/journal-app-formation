import { beforeEach, describe, expect, it, vi } from 'vitest'

const storage = new Map<string, string>()

vi.mock('@capacitor/preferences', () => ({
  Preferences: {
    get: async ({ key }: { key: string }) => ({ value: storage.get(key) ?? null }),
    set: async ({ key, value }: { key: string; value: string }) => void storage.set(key, value),
    remove: async ({ key }: { key: string }) => void storage.delete(key),
  },
}))

type Handler = (config: { url: string; method: string; headers: Record<string, string> }) => { status: number; data: unknown }

const calls: { url: string; auth?: string }[] = []
let handler: Handler = () => ({ status: 200, data: {} })

vi.mock('axios', async (importOriginal) => {
  const actual = await importOriginal<typeof import('axios')>()
  const adapter = async (config: import('axios').InternalAxiosRequestConfig) => {
    const auth = config.headers.Authorization as string | undefined
    calls.push({ url: config.url ?? '', auth })
    const { status, data } = handler({ url: config.url ?? '', method: config.method ?? '', headers: { Authorization: auth ?? '' } })
    const response = { status, data, statusText: '', headers: {}, config }
    if (status >= 400) throw new actual.AxiosError('fail', undefined, config, undefined, response)
    return response
  }
  const create = actual.default.create.bind(actual.default)
  return { ...actual, default: Object.assign(actual.default, { create: (cfg: object) => create({ ...cfg, adapter }) }) }
})

describe('session', () => {
  beforeEach(() => {
    vi.resetModules()
    storage.clear()
    calls.length = 0
  })

  it('persists tokens after login and restores authenticated state on reload', async () => {
    handler = ({ url }) =>
      url === '/auth/login'
        ? { status: 200, data: { user: { id: '1', email: 'a@b.c' }, accessToken: 'A1', refreshToken: 'R1', expiresIn: 3600 } }
        : { status: 200, data: { user: { id: '1', email: 'a@b.c' } } }

    let { useAuthStore, selectIsAuthenticated } = await import('../store/auth-store')
    expect(await useAuthStore.getState().signIn('a@b.c', 'secret1')).toBe(true)
    expect(selectIsAuthenticated(useAuthStore.getState())).toBe(true)
    expect(storage.get('auth-tokens')).toContain('R1')

    vi.resetModules()
    ;({ useAuthStore, selectIsAuthenticated } = await import('../store/auth-store'))
    expect(selectIsAuthenticated(useAuthStore.getState())).toBe(false)
    await useAuthStore.getState().restoreSession()
    expect(useAuthStore.getState().restored).toBe(true)
    expect(selectIsAuthenticated(useAuthStore.getState())).toBe(true)
    expect(useAuthStore.getState().user?.email).toBe('a@b.c')
    expect(calls.at(-1)).toEqual({ url: '/auth/me', auth: 'Bearer A1' })
  })

  it('refreshes an expired access token before the request', async () => {
    storage.set('auth-tokens', JSON.stringify({ accessToken: 'OLD', refreshToken: 'R1', expiresAt: Date.now() - 1000 }))
    handler = ({ url }) =>
      url === '/auth/refresh'
        ? { status: 200, data: { accessToken: 'NEW', refreshToken: 'R2', expiresIn: 3600 } }
        : { status: 200, data: [] }
    const { getEntries } = await import('./entries')
    await getEntries()
    expect(calls.map((c) => c.url)).toEqual(['/auth/refresh', '/entries'])
    expect(calls[1].auth).toBe('Bearer NEW')
    expect(storage.get('auth-tokens')).toContain('R2')
  })

  it('refreshes once on 401 and retries, then clears the session if refresh is rejected', async () => {
    storage.set('auth-tokens', JSON.stringify({ accessToken: 'A', refreshToken: 'R1', expiresAt: Date.now() + 3_600_000 }))
    handler = ({ url, headers }) => {
      if (url === '/auth/refresh') return { status: 200, data: { accessToken: 'B', refreshToken: 'R2', expiresIn: 3600 } }
      return headers.Authorization === 'Bearer B' ? { status: 200, data: [] } : { status: 401, data: { error: 'unauthenticated' } }
    }
    const { getEntries } = await import('./entries')
    await expect(getEntries()).resolves.toEqual([])
    expect(calls.map((c) => c.url)).toEqual(['/entries', '/auth/refresh', '/entries'])

    handler = ({ url }) => ({ status: 401, data: { error: url === '/auth/refresh' ? 'invalid_refresh_token' : 'unauthenticated' } })
    storage.set('auth-tokens', JSON.stringify({ accessToken: 'A', refreshToken: 'R1', expiresAt: Date.now() + 3_600_000 }))
    vi.resetModules()
    const entries = await import('./entries')
    const { useAuthStore } = await import('../store/auth-store')
    await useAuthStore.getState().restoreSession()
    await expect(entries.getEntries()).rejects.toBeDefined()
    expect(storage.has('auth-tokens')).toBe(false)
    expect(useAuthStore.getState().tokens).toBeNull()
  })
})
