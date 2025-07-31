import { createClient } from '@supabase/supabase-js'
import { createBrowserClient, createServerClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client
export const createClientComponentClient = () => {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Server-side Supabase client
export const createServerComponentClient = async () => {
  const { cookies } = await import('next/headers')
  const cookieStore = cookies()
  
  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}

// Route handler Supabase client
export const createRouteHandlerClient = (request: Request) => {
  const response = new Response()
  
  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return request.headers.get('cookie')?.split(';')
            .find(c => c.trim().startsWith(`${name}=`))
            ?.split('=')?.[1]
        },
        set(name: string, value: string, options: any) {
          response.headers.append('Set-Cookie', `${name}=${value}; ${Object.entries(options).map(([k, v]) => `${k}=${v}`).join('; ')}`)
        },
        remove(name: string, options: any) {
          response.headers.append('Set-Cookie', `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; ${Object.entries(options).map(([k, v]) => `${k}=${v}`).join('; ')}`)
        },
      },
    }
  )
}

// Database types
export interface NewsArticle {
  id: string
  original_title: string
  rewritten_title: string
  summary: string
  content: string
  source: string
  published_date: string
  approved: boolean
  categories: string[]
  created_at: string
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      news_articles: {
        Row: NewsArticle
        Insert: Omit<NewsArticle, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<NewsArticle, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}