import { getSupabaseServer } from '@/lib/supabaseServer';

// Función para generar contraseña temporal
function generarPasswordTemporal(length = 12) {
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    const special = "!@#$%^&*()_+-=[]{};':\"|<>?,./`~.";

    // Ensure at least one of each
    let password = [
        lower[Math.floor(Math.random() * lower.length)],
        upper[Math.floor(Math.random() * upper.length)],
        digits[Math.floor(Math.random() * digits.length)],
        special[Math.floor(Math.random() * special.length)]
    ];

    const allChars = lower + upper + digits + special;

    // Fill the rest
    for (let i = password.length; i < length; i++) {
        password.push(allChars[Math.floor(Math.random() * allChars.length)]);
    }

    // Shuffle the password
    password = password.sort(() => Math.random() - 0.5);

    return password.join('');
}

console.log(generarPasswordTemporal(12));

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
  const { data: userData, error: authError } = await supabase.auth.signUp(
    {
    email: email.trim(),
    password: passwordTemporal,
    options: {"data": {"name": nombre, "password": passwordTemporal}}
  },
);

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
