'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { User } from '@/types'

interface AuthContextType {
  user: User | null
  session: any
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (
    email: string,
    password: string,
    fullName: string,
    roleId: string,
    departmentId?: string
  ) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
  resetError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          setSession(session)
          // Fetch user data from users table
          const { data, error } = await supabase
            .from('users')
            .select(
              `
              *,
              role:roles(*),
              department:departments(*)
            `
            )
            .eq('id', session.user.id)
            .single()

          if (error) throw error
          setUser(data as User)
        }
      } catch (err) {
        console.error('Auth initialization error:', err)
        setError(err instanceof Error ? err.message : 'Auth error')
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setSession(session)
        const { data } = await supabase
          .from('users')
          .select(
            `
            *,
            role:roles(*),
            department:departments(*)
          `
          )
          .eq('id', session.user.id)
          .single()

        setUser(data as User)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setSession(null)
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setError(null)
      setLoading(true)

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signup = async (
    email: string,
    password: string,
    fullName: string,
    roleId: string,
    departmentId?: string
  ) => {
    try {
      setError(null)
      setLoading(true)

      // Create auth user
      const { data: authData, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password,
        })

      if (signUpError) throw signUpError

      if (!authData.user) throw new Error('User creation failed')

      // Create user record in users table
      const { error: userError } = await supabase.from('users').insert({
        id: authData.user.id,
        email,
        full_name: fullName,
        role_id: roleId,
        department_id: departmentId,
        is_active: true,
      })

      if (userError) throw userError
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Signup failed'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setError(null)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      setSession(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Logout failed'
      setError(message)
      throw err
    }
  }

  const updateProfile = async (data: Partial<User>) => {
    try {
      setError(null)
      if (!user) throw new Error('No user logged in')

      const { error } = await supabase
        .from('users')
        .update(data)
        .eq('id', user.id)

      if (error) throw error

      setUser({ ...user, ...data })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Update failed'
      setError(message)
      throw err
    }
  }

  const resetError = () => setError(null)

  const value: AuthContextType = {
    user,
    session,
    loading,
    error,
    login,
    signup,
    logout,
    updateProfile,
    resetError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
