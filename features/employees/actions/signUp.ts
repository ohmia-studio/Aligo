'use server';

import { Result } from '@/interfaces/server-response-interfaces';
import { supabaseAdmin } from '@/lib/supabase/supabaseAdmin';

type AltaEmpleadoParams = {
  dni: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
};

export async function altaEmpleadoAction(formData: FormData): Promise<Result> {
  const dni = formData.get('dni')?.toString().trim();
  const nombre = formData.get('nombre')?.toString().trim();
  const apellido = formData.get('apellido')?.toString().trim();
  const email = formData.get('email')?.toString().trim();
  const telefono = formData.get('telefono')?.toString().trim() ?? '';

  if (!dni || !nombre || !apellido || !email || !telefono) {
    return {
      status: 400,
      message: 'Todos los campos son obligatorios',
      data: null,
    };
  }

  // Validaciones mínimas en servidor
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    return { status: 400, message: 'Email inválido', data: null };
  }
  if (dni.replace(/\D/g, '').length < 6) {
    return { status: 400, message: 'DNI demasiado corto', data: null };
  }
  if (nombre.length < 2 || apellido.length < 2) {
    return {
      status: 400,
      message: 'Nombre/Apellido demasiado cortos',
      data: null,
    };
  }
  if (telefono && !/^[0-9+\s()-]{6,20}$/.test(telefono)) {
    return { status: 400, message: 'Teléfono inválido', data: null };
  }

  // === NUEVO: comprobar si DNI o email ya existen en Persona ===
  try {
    const { data: existing, error: existingError } = await supabaseAdmin
      .from('Persona')
      .select('id, dni, email')
      .or(`dni.eq.${dni},email.eq.${email}`)
      .limit(1)
      .maybeSingle();

    if (existingError) {
      console.error('Error comprobando existencia en Persona:', existingError);
      return {
        status: 500,
        message: 'Error verificando datos existentes',
        data: null,
      };
    }

    if (existing) {
      return {
        status: 409,
        message: 'Esa persona ya se encuentra registrada',
        data: null,
      };
    }
  } catch (err) {
    console.error('Error inesperado comprobando existencia:', err);
    return {
      status: 500,
      message: 'Error inesperado en el servidor',
      data: null,
    };
  }
  // === FIN comprobación ===

  // 🔐 Generar contraseña temporal segura
  const passwordTemporal = generarPasswordTemporal();

  try {
    // 1️⃣ Crear usuario en Auth
    const { data: userData, error: createError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password: passwordTemporal,
        email_confirm: false,
        user_metadata: { nombre, apellido, dni, telefono },
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

    // 2️⃣ Insertar en tabla Persona (incluye telefono)
    const { error: insertError } = await supabaseAdmin.from('Persona').insert([
      {
        dni,
        nombre,
        apellido,
        email,
        telefono,
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
      console.warn(
        'No se pudo reenviar el mail de confirmación:',
        mailError.message
      );
    }

    // 4️⃣ Éxito
    return {
      status: 200,
      message: `Empleado registrado correctamente. Se envió un correo a ${email}.`,
      data: {
        passwordTemporal,
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
