import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore, selectIsAuthenticated } from '../store/auth-store'

export default function RequireAuth({ children }: { children: ReactNode }) {
  const restored = useAuthStore((state) => state.restored)
  const isAuthenticated = useAuthStore(selectIsAuthenticated)

  if (!restored) return null
  if (!isAuthenticated) return <Navigate to="/auth" replace />
  return <>{children}</>
}
