'use server';
import { Result } from '@/interfaces/server-response-interfaces';
import { validateEmail } from '@/lib/validations';
import {
  createAuthUser,
  deleteAuthUser,
  findPersonaByDniOrEmail,
  findPersonaByEmailExcludingId,
  findPersonaById,
  insertPersona,
  updateAuthUser,
  updatePersonaById,
} from './employeeRepository';
import { sendConfirmationEmail } from './sendConfirmationEmail';

export async function altaEmpleadoAction(formData: FormData): Promise<Result> {
  const id = formData.get('id')?.toString().trim(); // NEW: detect edit
  const dni = formData.get('dni')?.toString().trim();
  const nombre = formData.get('nombre')?.toString().trim();
  const apellido = formData.get('apellido')?.toString().trim();
  const email = formData.get('email')?.toString().trim();
  const telefono = formData.get('telefono')?.toString().trim() ?? '';

  if ((!id && !dni) || !nombre || !apellido || !email || !telefono) {
    return {
      status: 400,
      message: 'Todos los campos son obligatorios',
      data: null,
    };
  }

  const errorEmail = validateEmail(email);
  if (errorEmail) return { status: 400, message: 'Email inválido', data: null };
  if (dni && dni.replace(/\D/g, '').length < 6)
    return { status: 400, message: 'DNI demasiado corto', data: null };

  // EDIT FLOW
  if (id) {
    try {
      const { data: persona, error: findErr } = await findPersonaById(id);
      if (findErr) {
        console.error('Error buscando persona:', findErr);
        return { status: 500, message: 'Error buscando empleado', data: null };
      }
      if (!persona) {
        return { status: 404, message: 'Empleado no encontrado', data: null };
      }

      // Enforce DNI immutability only if a dni was provided
      if (dni && persona.dni !== dni) {
        return {
          status: 400,
          message: 'El DNI no puede modificarse',
          data: null,
        };
      }

      // Check email duplicate only if changed
      if (persona.email !== email) {
        const { data: dupByEmail, error: dupErr } =
          await findPersonaByEmailExcludingId(email, id);
        if (dupErr) {
          console.error('Error verificando email duplicado:', dupErr);
          return {
            status: 500,
            message: 'Error verificando email',
            data: null,
          };
        }
        if (dupByEmail) {
          return {
            status: 409,
            message: 'El email ya está registrado',
            data: null,
          };
        }
      }

      // Update Persona (without changing DNI)
      const { error: updErr } = await updatePersonaById(id, {
        nombre,
        apellido,
        email,
        telefono,
      });
      if (updErr) {
        console.error('Error actualizando Persona:', updErr);
        return {
          status: 500,
          message: 'Error al actualizar datos del empleado',
          data: null,
        };
      }

      // Update Auth metadata and email if changed
      if (persona.auth_id) {
        const { error: authUpdErr } = await updateAuthUser(persona.auth_id, {
          email,
          user_metadata: { nombre, apellido, dni: persona.dni, telefono }, // ensure consistent dni
        });
        if (authUpdErr) {
          console.error('Error actualizando usuario en Auth:', authUpdErr);
          // We don’t rollback Persona update; report partial success or failure
          return {
            status: 200,
            message:
              'Empleado actualizado, pero no se pudo sincronizar cambios en Auth.',
            data: null,
          };
        }
      }

      return {
        status: 200,
        message: 'Empleado actualizado correctamente',
        data: null,
      };
    } catch (err) {
      console.error('Error inesperado actualizando empleado:', err);
      return {
        status: 500,
        message: 'Error inesperado en el servidor',
        data: null,
      };
    }
  }

  // CREATE FLOW (sin cambios en lógica de negocio)
  // comprobar duplicados (repo retorna data/error)

  // Validar que DNI existe en CREATE flow
  if (!dni) {
    return {
      status: 400,
      message: 'DNI es obligatorio para crear un empleado',
      data: null,
    };
  }

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

    try {
      await sendConfirmationEmail(email, passwordTemporal, nombre);
    } catch (mailErr) {
      console.error('Error enviando email de confirmación:', mailErr);
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
