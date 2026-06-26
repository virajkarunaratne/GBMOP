'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: string[]
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
}) => {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    } else if (
      !loading &&
      user &&
      requiredRoles &&
      !requiredRoles.includes(user.role?.name || '')
    ) {
      router.push('/dashboard')
    }
  }, [user, loading, router, requiredRoles])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-neutral-200 border-t-primary-600 rounded-full"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (
    requiredRoles &&
    !requiredRoles.includes(user.role?.name || '')
  ) {
    return null
  }

  return <>{children}</>
}

export const useRequireAuth = (requiredRoles?: string[]) => {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    } else if (
      !loading &&
      user &&
      requiredRoles &&
      !requiredRoles.includes(user.role?.name || '')
    ) {
      router.push('/dashboard')
    }
  }, [user, loading, router, requiredRoles])

  return { user, loading }
}
