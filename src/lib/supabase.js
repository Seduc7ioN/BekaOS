import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const signUp = async (email, password, companyName) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        company_name: companyName,
      }
    }
  })
  return { data, error }
}

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

// Database helpers
export const getEvents = async (companyId) => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('company_id', companyId)
    .order('date', { ascending: true })
  return { data, error }
}

export const createEvent = async (event) => {
  const { data, error } = await supabase
    .from('events')
    .insert(event)
    .select()
  return { data, error }
}

export const updateEvent = async (id, updates) => {
  const { data, error } = await supabase
    .from('events')
    .update(updates)
    .eq('id', id)
    .select()
  return { data, error }
}

export const deleteEvent = async (id) => {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)
  return { error }
}

export const getGallery = async (companyId) => {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })
  return { data, error }
}

export const getGuests = async (eventId) => {
  const { data, error } = await supabase
    .from('guests')
    .select('*')
    .eq('event_id', eventId)
  return { data, error }
}

export const getTasks = async (companyId) => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('company_id', companyId)
    .order('date', { ascending: true })
  return { data, error }
}

export const getExpenses = async (companyId) => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('company_id', companyId)
  return { data, error }
}

// Storage helpers
export const uploadFile = async (bucket, path, file) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file)
  return { data, error }
}

export const getPublicUrl = (bucket, path) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)
  return data.publicUrl
}
