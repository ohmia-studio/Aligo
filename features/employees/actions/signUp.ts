'use server';
import { Result } from '@/interfaces/server-response-interfaces';
import { validateEmail } from '@/lib/validations';
import {
  createAuthUser,
  deleteAuthUser,
  findPersonaByDniOrEmail,
  insertPersona,
} from './employeeRepository';
import { sendConfirmationEmail } from './sendConfirmationEmail';

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

  // validaciones mínimas
  const errorEmail = validateEmail(email);
  if (errorEmail) return { status: 400, message: 'Email inválido', data: null };
  if (dni.replace(/\D/g, '').length < 6)
    return { status: 400, message: 'DNI demasiado corto', data: null };

  // comprobar duplicados (repo retorna data/error)
  try {
    const { data: existing, error: existingError } =
      await findPersonaByDniOrEmail(dni, email);
    if (existingError) {
      console.error('Error comprobando duplicados:', existingError);
      return {
        status: 500,
        message: 'Error verificando datos existentes',
        data: null,
      };
    }
    if (existing) {
      return {
        status: 409,
        message: 'El DNI o email ya están registrados',
        data: null,
      };
    }
  } catch (err) {
    console.error(err);
    return {
      status: 500,
      message: 'Error inesperado en el servidor',
      data: null,
    };
  }

  // generar password y crear en Auth
  const passwordTemporal = generarPasswordTemporal();
  try {
    const { data: authData, error: authError } = await createAuthUser({
      email,
      password: passwordTemporal,
      user_metadata: { nombre, apellido, dni, telefono },
    });

    if (authError || !authData?.user?.id) {
      console.error('Error creando usuario en Auth:', authError);
      return {
        status: 500,
        message: 'Error al crear el usuario en Auth',
        data: null,
      };
    }

    const authId = authData.user.id;

    // insertar en Persona
    const { error: insertError } = await insertPersona({
      dni,
      nombre,
      apellido,
      email,
      telefono,
      rol: 'empleado',
      auth_id: authId,
    });

    if (insertError) {
      console.error('Error insertando Persona:', insertError);
      // rollback correcto: borrar user en Auth
      try {
        await deleteAuthUser(authId);
      } catch (e) {
        console.error('Rollback deleteAuthUser falló:', e);
      }
      return {
        status: 500,
        message: 'Error al guardar datos del empleado',
        data: null,
      };
    }

    // después de insertar Persona y antes de return success:
    try {
      await sendConfirmationEmail(email, passwordTemporal, nombre);
    } catch (mailErr) {
      console.error('Error enviando email de confirmación:', mailErr);
      // no hacemos rollback por fallo de mail, pero podés decidir marcarlo en la respuesta
      return {
        status: 200,
        message: `Empleado registrado, pero no se pudo enviar el correo a ${email}.`,
        data: { passwordTemporal },
      };
    }

    return {
      status: 200,
      message: `Empleado registrado correctamente. Se envió un correo a ${email}.`,
      data: { passwordTemporal },
    };
  } catch (err) {
    console.error('Error inesperado creando empleado:', err);
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
  for (let i = 0; i < length; i++)
    password += charset[array[i] % charset.length];
  return password;
}
