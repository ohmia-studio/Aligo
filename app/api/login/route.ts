// /app/api/login/route.ts
import { loginUser } from '@/features/auth/login';
import { NextRequest, NextResponse } from 'next/server';
// Calculamos el tiempo equivalente a 1 día:
const DURATION_ACCESS_COOKIE = 60 * 60 * 1000;

// Calculamos el tiempo equivalente a 1 semana:
const DURATION_REFRESH_COOKIE = 7 * 24 * 60 * 60 * 1000;

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const result = await loginUser({ email, password });

  if (result.status !== 200) {
    return NextResponse.json(
      { message: result.message },
      { status: result.status }
    );
  }

  const response = NextResponse.json(
    { message: 'Login exitoso', role: result.role },
    { status: 200 }
  );

  // Pone cookies HTTP-only
  response.cookies.set('session_token', result.session_token!, {
    httpOnly: true,
    secure: false,
    path: '/',
    maxAge: DURATION_ACCESS_COOKIE,
  });

  response.cookies.set('refresh_token', result.refresh_token!, {
    httpOnly: true,
    secure: false,
    path: '/',
    maxAge: DURATION_REFRESH_COOKIE,
  });

  return response;
}
