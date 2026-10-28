import { create } from 'zustand'
import { me, login, logout, register, type User } from '../services/auth'
import { getErrorMessage } from '../services/errors'
import { httpStatus } from '../services/api'
import { useEntriesStore } from './entries-store'
import { clearTokens, getTokens, onTokensChange, type Tokens } from '../services/token-storage'

type Status = 'idle' | 'loading' | 'success' | 'error'

type AuthState = {
  user: User | null
  tokens: Tokens | null
  status: Status
  error: string | null
  restored: boolean
  signIn: (email: string, password: string) => Promise<boolean>
  signUp: (email: string, password: string) => Promise<boolean>
  signOut: () => Promise<void>
  restoreSession: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>()((set) => {
  const authenticate = async (action: () => Promise<User>) => {
    set({ status: 'loading', error: null })
    try {
      const user = await action()
      set({ status: 'success', user })
      return true
    } catch (error) {
      set({ status: 'error', error: getErrorMessage(error) })
      return false
    }
  }

  return {
    user: null,
    tokens: null,
    status: 'idle',
    error: null,
    restored: false,
    signIn: (email, password) => authenticate(() => login({ email, password })),
    signUp: (email, password) => authenticate(() => register({ email, password })),
    signOut: async () => {
      try {
        await logout()
      } catch {
        await clearTokens()
      }
      await clearTokens()
      set({ user: null, status: 'idle', error: null })
    },
    restoreSession: async () => {
      const tokens = await getTokens()
      set({ tokens })
      if (!tokens) {
        set({ restored: true })
        return
      }
      try {
        const user = await me()
        set({ user, restored: true })
      } catch (error) {
        const status = httpStatus(error)
        if (status === 400 || status === 401) await clearTokens()
        set({ restored: true })
      }
    },
    clearError: () => set({ status: 'idle', error: null }),
  }
})

onTokensChange((tokens) => {
  if (tokens) {
    useAuthStore.setState({ tokens })
    return
  }
  useAuthStore.setState({ tokens, user: null })
  useEntriesStore.getState().reset()
})

export const selectIsAuthenticated = (state: AuthState) => state.tokens !== null
