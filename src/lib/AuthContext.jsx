import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [company, setCompany] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchOrCreateCompany(session.user)
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          fetchOrCreateCompany(session.user)
        } else {
          setCompany(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchOrCreateCompany = async (authUser) => {
    try {
      // Önce şirket var mı kontrol et
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', authUser.id)
        .single()

      if (data) {
        setCompany(data)
      } else if (error?.code === 'PGRST116') {
        // Şirket yok, otomatik oluştur
        const companyName = authUser.user_metadata?.company_name || authUser.email?.split('@')[0] || 'Yeni Şirket'
        const { data: newCompany, error: insertError } = await supabase
          .from('companies')
          .insert({
            user_id: authUser.id,
            name: companyName,
            slug: companyName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
            email: authUser.email,
            plan: 'free',
          })
          .select()
          .single()

        if (!insertError) {
          setCompany(newCompany)
        }
      }
    } catch (err) {
      console.error('Company fetch/create error:', err)
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    company,
    loading,
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
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

// Data Hook — Tüm verileri Supabase'den çek
export function useData() {
  const { company } = useAuth()
  const [events, setEvents] = useState([])
  const [tasks, setTasks] = useState([])
  const [gallery, setGallery] = useState([])
  const [guests, setGuests] = useState([])
  const [expenses, setExpenses] = useState([])
  const [notifs, setNotifs] = useState([])
  const [dataLoading, setDataLoading] = useState(true)

  const loadAll = useCallback(async () => {
    if (!company) return
    setDataLoading(true)
    try {
      const [evRes, taskRes, galRes, guestRes, expRes, notifRes] = await Promise.all([
        supabase.from('events').select('*').eq('company_id', company.id).order('date'),
        supabase.from('tasks').select('*').eq('company_id', company.id),
        supabase.from('gallery').select('*').eq('company_id', company.id).order('created_at', { ascending: false }),
        supabase.from('guests').select('*').eq('company_id', company.id),
        supabase.from('expenses').select('*').eq('company_id', company.id),
        supabase.from('notifications').select('*').eq('company_id', company.id).order('created_at', { ascending: false }),
      ])
      setEvents(evRes.data || [])
      setTasks(taskRes.data || [])
      setGallery(galRes.data || [])
      setGuests(guestRes.data || [])
      setExpenses(expRes.data || [])
      setNotifs(notifRes.data || [])
    } catch (err) {
      console.error('Data load error:', err)
    } finally {
      setDataLoading(false)
    }
  }, [company])

  useEffect(() => { loadAll() }, [loadAll])

  // CRUD helpers
  const addEvent = async (event) => {
    const { data, error } = await supabase.from('events').insert({ ...event, company_id: company.id }).select().single()
    if (!error && data) setEvents(prev => [...prev, data])
    return { data, error }
  }

  const updateEvent = async (id, updates) => {
    const { data, error } = await supabase.from('events').update(updates).eq('id', id).select().single()
    if (!error && data) setEvents(prev => prev.map(e => e.id === id ? data : e))
    return { data, error }
  }

  const deleteEvent = async (id) => {
    const { error } = await supabase.from('events').delete().eq('id', id)
    if (!error) setEvents(prev => prev.filter(e => e.id !== id))
    return { error }
  }

  const addTask = async (task) => {
    const { data, error } = await supabase.from('tasks').insert({ ...task, company_id: company.id }).select().single()
    if (!error && data) setTasks(prev => [...prev, data])
    return { data, error }
  }

  const updateTask = async (id, updates) => {
    const { data, error } = await supabase.from('tasks').update(updates).eq('id', id).select().single()
    if (!error && data) setTasks(prev => prev.map(t => t.id === id ? data : t))
    return { data, error }
  }

  const addGuest = async (guest) => {
    const { data, error } = await supabase.from('guests').insert({ ...guest, company_id: company.id }).select().single()
    if (!error && data) setGuests(prev => [...prev, data])
    return { data, error }
  }

  const updateGuest = async (id, updates) => {
    const { data, error } = await supabase.from('guests').update(updates).eq('id', id).select().single()
    if (!error && data) setGuests(prev => prev.map(g => g.id === id ? data : g))
    return { data, error }
  }

  const addExpense = async (expense) => {
    const { data, error } = await supabase.from('expenses').insert({ ...expense, company_id: company.id }).select().single()
    if (!error && data) setExpenses(prev => [...prev, data])
    return { data, error }
  }

  const deleteExpense = async (id) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id)
    if (!error) setExpenses(prev => prev.filter(e => e.id !== id))
    return { error }
  }

  const addNotif = async (notif) => {
    const { data, error } = await supabase.from('notifications').insert({ ...notif, company_id: company.id }).select().single()
    if (!error && data) setNotifs(prev => [data, ...prev])
    return { data, error }
  }

  const markNotifRead = async (id) => {
    await supabase.from('notifications').update({ read: true }).eq('id', id)
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  return {
    events, setEvents, addEvent, updateEvent, deleteEvent,
    tasks, setTasks, addTask, updateTask,
    gallery, setGallery,
    guests, addGuest, updateGuest,
    expenses, setExpenses, addExpense, deleteExpense,
    notifs, setNotifs, addNotif, markNotifRead,
    dataLoading, reload: loadAll,
  }
}
