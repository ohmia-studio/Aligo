'use server';
import { getUserByEmail } from '@/features/auth/userService';
import { getSupabaseServer } from '@/lib/supabaseServer';
// Resultado del login
interface LoginResult {
  status: number;
  message: string;
  role?: string;
  email?: string;
}

// Parámetros de login
interface LoginParams {
  email: string;
  password: string;
}

export async function loginUser({
  email,
  password,
}: LoginParams): Promise<LoginResult> {
  // si es función, ejecutarla para obtener el cliente
  try {
    const userData = await getUserByEmail(email);
    if (!userData) {
      return { status: 401, message: 'Credenciales incorrectas' };
    }
    const supabase = await getSupabaseServer();
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({ email, password });

    if (authError || !authData.session) {
      return { status: 401, message: 'Credenciales incorrectas' };
    }

    return {
      status: 200,
      message: 'Login exitoso',
      role: userData.rol,
      email,
    };
  } catch (err) {
    console.log(err);
    return { status: 500, message: 'Error interno del servidor' };
  }
}
