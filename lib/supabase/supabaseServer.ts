import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { NextRequest, NextResponse } from 'next/server';

export async function getSupabaseServer(req?: NextRequest, res?: NextResponse) {
  const cookieStore = req ? req.cookies : await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          if (res) {
            res.cookies.set(name, value, options);
          }
        },
        remove(name: string, options: CookieOptions) {
          if (res) {
            res.cookies.set(name, '', { ...options, maxAge: 0 });
          }
        },
      },
    }
  );
}
