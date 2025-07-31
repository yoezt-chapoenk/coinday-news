import { createRouteHandlerClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient(request)
  
  await supabase.auth.signOut()
  
  return NextResponse.redirect(new URL('/admin/login', request.url))
}