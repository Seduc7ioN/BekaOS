import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from './supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [company, setCompany] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchCompany(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          fetchCompany(session.user.id)
        } else {
          setCompany(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchCompany = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        // Company might not exist yet (new user)
        setCompany(null)
      } else {
        setCompany(data)
      }
    } catch (err) {
      console.error('Error fetching company:', err)
    } finally {
      setLoading(false)
    }
  }

  const createCompany = async (companyData) => {
    const { data, error } = await supabase
      .from('companies')
      .insert({
        ...companyData,
        user_id: user.id,
        plan: 'free',
      })
      .select()
      .single()

    if (!error) {
      setCompany(data)
    }
    return { data, error }
  }

  const value = {
    user,
    company,
    loading,
    createCompany,
    isAuthenticated: !!user,
    isPro: company?.plan === 'pro' || company?.plan === 'enterprise',
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
