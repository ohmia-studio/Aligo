import { getSupabaseServer } from '@/lib/supabaseServer';
import { getUserByEmail } from '@/lib/userService';
// Resultado del login
interface LoginResult {
  status: number;
  message: string;
  role?: string;
  session_token?: string;
  refresh_token?: string;
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
      session_token: authData.session.access_token,
      refresh_token: authData.session.refresh_token,
    };
  } catch (err) {
    console.log(err);
    return { status: 500, message: 'Error interno del servidor' };
  }
}
