import { getUserByEmail } from '@/features/auth/userRepository';
import { getSupabaseServer } from '@/lib/supabase/supabaseServer';
import { NextResponse } from 'next/server';

type RequireResult =
  | { ok: true; user: any; appUser?: any }
  | { ok: false; response: ReturnType<typeof NextResponse.json> };

export async function requireServerAuth({
  allowedRoles,
}: {
  allowedRoles?: string[] | string;
} = {}): Promise<RequireResult> {
  try {
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error('Supabase getUser error:', error);
      return {
        ok: false,
        response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
      };
    }

    if (!data?.user) {
      return {
        ok: false,
        response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
      };
    }

    // If no role check required, return user
    if (!allowedRoles) {
      return { ok: true, user: data.user };
    }

    // Normalize allowedRoles to array
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    // Fetch application user (to read role stored in DB)
    const appUser = await getUserByEmail(data.user.email || '');
    if (!appUser || !appUser.rol) {
      return {
        ok: false,
        response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
      };
    }

    if (!roles.includes(appUser.rol)) {
      return {
        ok: false,
        response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
      };
    }

    return { ok: true, user: data.user, appUser };
  } catch (err: any) {
    console.error('requireServerAuth error:', err);
    return {
      ok: false,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }
}
