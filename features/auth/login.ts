import { supabaseClient } from '../../lib/supabaseClient';

interface LoginResult {
  status: number;
  message: string;
  role?: string;
  session_token?: string;
  refresh_token?: string;
}

interface LoginParams {
  email: string;
  password: string;
}

export async function loginUser({
  email,
  password,
}: LoginParams): Promise<LoginResult> {
  try {
    const { data: userData, error: userError } = await supabaseClient
      .from('Persona')
      .select('email, rol, nombre')
      .eq('email', email.trim())
      .maybeSingle();

    if (userError || !userData) {
      return { status: 401, message: 'Credenciales incorrectas' };
    }

    const { data: authData, error: authError } =
      await supabaseClient.auth.signInWithPassword({ email, password });

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
    return { status: 500, message: 'Error interno del servidor' };
  }
}
