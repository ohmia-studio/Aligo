import { getSupabaseServer } from '@/lib/supabase/supabaseServer';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getUserByEmail } from './features/auth/userRepository';

// Mapa de rutas y roles permitidos
const routeRoles: Record<string, string[]> = {
  '/dashboard/admin': ['admin'],
  '/dashboard/empleado': ['admin', 'empleado'],
  '/dashboard': ['admin', 'empleado', 'usuario'],
};
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = await getSupabaseServer();
  // Supabase intentará refrescar automáticamente si el access_token expiró
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.warn('Error de sesión:', error.message);
  }

  if (!data?.user) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  const response = await getUserByEmail(data.user.email || '');
  if (!response) {
    console.warn('No se pudo obtener el rol del usuario');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const userRole = response.rol;

  // Verificar permisos según ruta
  const path = req.nextUrl.pathname;
  const matchedRoute = Object.keys(routeRoles).find((route) =>
    path.startsWith(route)
  );
  const allowedRoles = matchedRoute ? routeRoles[matchedRoute] : [];

  if (!allowedRoles.includes(userRole)) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  console.log('Usuario autenticado:', data.user.email);

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
