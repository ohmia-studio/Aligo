import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getSupabaseServer } from './lib/supabase/supabaseServer';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Llamamos a tu cliente server
  const supabase = await getSupabaseServer();

  // Supabase intentará refrescar automáticamente si el access_token expiró
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.warn('Error de sesión:', error.message);
  }

  if (!data?.user) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  console.log('Usuario autenticado:', data.user.email);

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
