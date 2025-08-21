import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
      }
      deities: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
      }
      recitation_counts: {
        Row: {
          id: string
          count_value: number
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          count_value: number
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          count_value?: number
          description?: string | null
          created_at?: string
        }
      }
      recitation_times: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
      }
      kalams: {
        Row: {
          id: string
          name: string
          planet: string | null
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          planet?: string | null
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          planet?: string | null
          description?: string | null
          created_at?: string
        }
      }
      time_ranges: {
        Row: {
          id: string
          start_time: string
          end_time: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          start_time: string
          end_time: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          start_time?: string
          end_time?: string
          description?: string | null
          created_at?: string
        }
      }
      mantras: {
        Row: {
          id: string
          title: string
          text: string
          category_id: string | null
          deity_id: string | null
          count_id: string | null
          time_id: string | null
          kalam_id: string | null
          range_id: string | null
          view_count: number
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          text: string
          category_id?: string | null
          deity_id?: string | null
          count_id?: string | null
          time_id?: string | null
          kalam_id?: string | null
          range_id?: string | null
          view_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          text?: string
          category_id?: string | null
          deity_id?: string | null
          count_id?: string | null
          time_id?: string | null
          kalam_id?: string | null
          range_id?: string | null
          view_count?: number
          created_at?: string
        }
      }
    }
  }
}