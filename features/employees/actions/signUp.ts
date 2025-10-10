'use server';

import { supabaseAdmin } from '@/lib/supabase/supabaseAdmin';
import { Result } from '@/interfaces/server-response-interfaces';

type AltaEmpleadoParams = {
  dni: string;
  nombre: string;
  apellido: string;
  email: string;
};

export async function altaEmpleadoAction(formData: FormData): Promise<Result> {
  const dni = formData.get('dni')?.toString().trim();
  const nombre = formData.get('nombre')?.toString().trim();
  const apellido = formData.get('apellido')?.toString().trim();
  const email = formData.get('email')?.toString().trim();

  if (!dni || !nombre || !apellido || !email) {
    return {
      status: 400,
      message: 'Todos los campos son obligatorios',
      data: null,
    };
  }

  // 🔐 Generar contraseña temporal segura
  const passwordTemporal = generarPasswordTemporal();

  try {
    // 1️⃣ Crear usuario en Auth
    const { data: userData, error: createError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password: passwordTemporal,
        email_confirm: false, // el email se envía igual
        user_metadata: { nombre, apellido, dni },
      });

    if (createError || !userData?.user?.id) {
      console.error('Error creando usuario en Auth:', createError);
      return {
        status: 500,
        message: 'Error al crear el usuario en Auth',
        data: null,
      };
    }

    const authId = userData.user.id;

    // 2️⃣ Insertar en tabla Persona
    const { error: insertError } = await supabaseAdmin.from('Persona').insert([
      {
        dni,
        nombre,
        apellido,
        email,
        rol: 'empleado',
        auth_id: authId,
      },
    ]);

    if (insertError) {
      console.error('Error insertando en Persona:', insertError);
      // rollback: eliminar el usuario creado
      await supabaseAdmin.auth.admin.deleteUser(authId);
      return {
        status: 500,
        message: 'Error al guardar los datos del empleado',
        data: null,
      };
    }

    // 3️⃣ Enviar mail de confirmación (opcional)
    const { error: mailError } = await supabaseAdmin.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: process.env.SUPABASE_CONFIRM_REDIRECT_URL!,
      },
    });

    if (mailError) {
      console.warn('No se pudo reenviar el mail de confirmación:', mailError.message);
    }

    // 4️⃣ Éxito
    return {
      status: 200,
      message: `Empleado registrado correctamente. Se envió un correo a ${email}.`,
      data: {
        passwordTemporal, // ⚠️ mostrala solo si luego se envía por correo
      },
    };
  } catch (err) {
    console.error('Error inesperado:', err);
    return {
      status: 500,
      message: 'Error inesperado en el servidor',
      data: null,
    };
  }
}

function generarPasswordTemporal(length: number = 12): string {
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
  let password = '';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    password += charset[array[i] % charset.length];
  }
  return password;
}
