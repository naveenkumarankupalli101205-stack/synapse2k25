import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase, isDemoMode } from '@/utils/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, fullName: string, role: 'teacher' | 'student') => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  isDemoMode: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isDemoMode) {
      // In demo mode, simulate no user session
      setSession(null)
      setUser(null)
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, fullName: string, role: 'teacher' | 'student') => {
    if (isDemoMode) {
      return { 
        error: { 
          message: 'Demo mode: Please set up Supabase to enable authentication',
          name: 'DemoModeError',
          status: 400
        } as AuthError 
      }
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        },
      },
    })
    return { error }
  }

  const signIn = async (email: string, password: string) => {
    if (isDemoMode) {
      return { 
        error: { 
          message: 'Demo mode: Please set up Supabase to enable authentication',
          name: 'DemoModeError',
          status: 400
        } as AuthError 
      }
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signOut = async () => {
    if (!isDemoMode) {
      await supabase.auth.signOut()
    }
  }

  const resetPassword = async (email: string) => {
    if (isDemoMode) {
      return { 
        error: { 
          message: 'Demo mode: Please set up Supabase to enable password reset',
          name: 'DemoModeError',
          status: 400
        } as AuthError 
      }
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { error }
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    isDemoMode,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}