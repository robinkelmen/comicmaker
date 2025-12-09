import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Save/load features will be disabled.')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

export interface SavedComic {
  id: string
  title: string
  script: string
  created_at: string
  updated_at: string
}

export async function saveComic(title: string, script: string): Promise<{ data: SavedComic | null; error: string | null }> {
  const { data, error } = await supabase
    .from('comics')
    .insert({ title, script })
    .select()
    .single()

  if (error) {
    return { data: null, error: error.message }
  }
  return { data: data as SavedComic, error: null }
}

export async function loadComics(): Promise<{ data: SavedComic[] | null; error: string | null }> {
  const { data, error } = await supabase
    .from('comics')
    .select('*')
    .order('updated_at', { ascending: false })

  if (error) {
    return { data: null, error: error.message }
  }
  return { data: data as SavedComic[], error: null }
}

export async function loadComic(id: string): Promise<{ data: SavedComic | null; error: string | null }> {
  const { data, error } = await supabase
    .from('comics')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return { data: null, error: error.message }
  }
  return { data: data as SavedComic, error: null }
}

export async function updateComic(id: string, title: string, script: string): Promise<{ data: SavedComic | null; error: string | null }> {
  const { data, error } = await supabase
    .from('comics')
    .update({ title, script, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { data: null, error: error.message }
  }
  return { data: data as SavedComic, error: null }
}

export async function deleteComic(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('comics')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }
  return { error: null }
}
