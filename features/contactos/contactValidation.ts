import { ContactValidationResult } from '@/interfaces/contact-interfaces';
import { normalizePhoneNumber, validateEmail } from '@/lib/validations';

export function validateContactPayload(payload: {
  nombre: string;
  telefono?: string;
  email?: string;
}): ContactValidationResult {
  // Validación de nombre
  if (!payload.nombre || payload.nombre.trim().length < 2) {
    return {
      isValid: false,
      errors: 'El nombre es requerido (mínimo 2 caracteres)',
    };
  }

  // Validación de email usando helper centralizado
  if (payload.email) {
    const emailError = validateEmail(payload.email);
    if (emailError) {
      return { isValid: false, errors: emailError };
    }
  }

  // Validación: al menos email o teléfono debe estar presente
  const hasEmail = payload.email && payload.email.trim();
  const hasPhone = payload.telefono && payload.telefono.trim();

  if (!hasEmail && !hasPhone) {
    return {
      isValid: false,
      errors: 'Debe proporcionar al menos un email o un teléfono',
    };
  }

  // Preparar datos validados
  const validatedData: any = { nombre: payload.nombre.trim() };

  // Validar y normalizar email
  if (payload.email !== undefined) {
    if (payload.email.trim()) {
      validatedData.email = payload.email.trim();
    } else {
      // Permitir limpiar el campo en updates
      validatedData.email = null;
    }
  }

  // Validar y normalizar teléfono
  if (payload.telefono !== undefined) {
    if (payload.telefono.trim()) {
      const phoneResult = normalizePhoneNumber(payload.telefono, '+54');
      if (phoneResult.error) {
        return { isValid: false, errors: phoneResult.error };
      }
      if (phoneResult.number) {
        validatedData.telefono = phoneResult.number;
      }
    } else {
      // Permitir limpiar el campo en updates
      validatedData.telefono = null;
    }
  }

  return {
    isValid: true,
    validatedData,
  };
}
