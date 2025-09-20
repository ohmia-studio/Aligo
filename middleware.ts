import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Llamamos a tu cliente server
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
      },
    }
  );
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
