import { getSupabaseServer } from '@/lib/supabaseServer';

// Función para generar contraseña temporal
function generarPasswordTemporal(length = 12) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export async function registrarEmpleadoPersona({
  dni,
  email,
  apellido,
  nombre,
}: {
  dni: string;
  email: string;
  apellido: string;
  nombre: string;
}) {
  const supabase = await getSupabaseServer();

  // Generar contraseña temporal
  const passwordTemporal = generarPasswordTemporal();

  // Crear usuario en Auth con contraseña generada
  const { data: userData, error: authError } = await supabase.auth.signUp({
    email: email.trim(),
    password: passwordTemporal,
  });

  if (authError)
    throw new Error(`Error al crear usuario en Auth: ${authError.message}`);

  const authId = userData?.user?.id;
  if (!authId)
    throw new Error('No se pudo obtener el auth_id del usuario creado');

  // Insertar persona vinculada con auth_id
  const { data, error } = await supabase
    .from('Persona')
    .insert([
      {
        dni,
        email,
        apellido,
        nombre,
        rol: 'empleado',
        auth_id: authId,
      },
    ])
    .select()
    .single();

  if (error) throw new Error(`Error al insertar persona: ${error.message}`);

  // Opcional: podrías devolver también la contraseña temporal para enviar por mail luego
  return { ...data, passwordTemporal };
}
