import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Comic } from './types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const hasCredentials = supabaseUrl && supabaseAnonKey

if (!hasCredentials) {
  console.warn('Supabase credentials not configured. Save/load features will be disabled.')
}

export const supabase: SupabaseClient | null = hasCredentials
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export interface SavedComic {
  id: string
  title: string
  script: string
  data?: Comic  // Full comic data with generated images
  created_at: string
  updated_at: string
}

export async function saveComic(title: string, script: string, comicData?: Comic): Promise<{ data: SavedComic | null; error: string | null }> {
  if (!supabase) {
    return { data: null, error: 'Supabase not configured' }
  }

  const { data, error } = await supabase
    .from('comics')
    .insert({ title, script, data: comicData })
    .select()
    .single()

  if (error) {
    return { data: null, error: error.message }
  }
  return { data: data as SavedComic, error: null }
}

export async function loadComics(): Promise<{ data: SavedComic[] | null; error: string | null }> {
  if (!supabase) {
    return { data: null, error: 'Supabase not configured' }
  }

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
  if (!supabase) {
    return { data: null, error: 'Supabase not configured' }
  }

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

export async function updateComic(id: string, title: string, script: string, comicData?: Comic): Promise<{ data: SavedComic | null; error: string | null }> {
  if (!supabase) {
    return { data: null, error: 'Supabase not configured' }
  }

  const { data, error } = await supabase
    .from('comics')
    .update({ title, script, data: comicData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { data: null, error: error.message }
  }
  return { data: data as SavedComic, error: null }
}

export async function deleteComic(id: string): Promise<{ error: string | null }> {
  if (!supabase) {
    return { error: 'Supabase not configured' }
  }

  const { error } = await supabase
    .from('comics')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }
  return { error: null }
}
