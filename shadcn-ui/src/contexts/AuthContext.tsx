import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase, isDemoMode } from '@/utils/supabase'
import { Profile } from '@/types/database'

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  profileLoading: boolean
  signUp: (email: string, password: string, fullName: string, role: 'teacher' | 'student') => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  isDemoMode: boolean
  refreshProfile: () => Promise<void>
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
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)

  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      setProfileLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Profile fetch error:', error)
      return null
    } finally {
      setProfileLoading(false)
    }
  }

  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id)
      setProfile(profileData)
    }
  }

  useEffect(() => {
    if (isDemoMode) {
      // In demo mode, simulate no user session
      setSession(null)
      setUser(null)
      setProfile(null)
      setLoading(false)
      return
    }

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Session error:', error)
          setSession(null)
          setUser(null)
          setProfile(null)
        } else {
          setSession(session)
          setUser(session?.user ?? null)
          
          // Fetch profile if user exists and is verified
          if (session?.user && session.user.email_confirmed_at) {
            const profileData = await fetchProfile(session.user.id)
            setProfile(profileData)
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        setSession(null)
        setUser(null)
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email)
      
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user && session.user.email_confirmed_at) {
        // User is authenticated and verified, fetch profile
        const profileData = await fetchProfile(session.user.id)
        setProfile(profileData)
      } else {
        // No user or unverified, clear profile
        setProfile(null)
      }
      
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
    setProfile(null)
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
    profile,
    loading,
    profileLoading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    isDemoMode,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}