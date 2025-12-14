import { parsePhoneNumberFromString } from 'libphonenumber-js';

export const validateEmail = (email: string): string | null => {
  if (!email.trim()) return 'El email es obligatorio';
  if (email.length > 255) return 'El email no puede exceder 255 caracteres';
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!regex.test(email)) return 'El email no tiene un formato válido';
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password.trim()) return 'La contraseña es obligatoria';
  return null;
};

export const validateDNI = (dni: string): string | null => {
  if (!dni.trim()) return 'El DNI es obligatorio';
  const dniDigits = dni.replace(/\D/g, '');
  if (dniDigits.length != 8) return 'DNI inválido (debe tener 8 dígitos)';
  return null;
};

export const validateNombre = (nombre: string): string | null => {
  if (!nombre.trim()) return 'El nombre es obligatorio';
  if (nombre.length < 2) return 'Nombre demasiado corto';
  if (nombre.length > 25) return 'Nombre no puede exceder 25 caracteres';
  return null;
};

export const validateApellido = (apellido: string): string | null => {
  if (!apellido.trim()) return 'El apellido es obligatorio';
  if (apellido.length < 2) return 'Apellido demasiado corto';
  if (apellido.length > 50) return 'Apellido no puede exceder 50 caracteres';
  return null;
};

export const validateTelefono = (telefono: string): string | null => {
  // Validación básica en cliente
  if (!telefono.trim()) return 'El teléfono es obligatorio';
  const telefonoDigits = telefono.replace(/\D/g, '');
  if (telefonoDigits.length < 6)
    return 'Teléfono demasiado corto (mínimo 6 dígitos)';
  if (telefono.length > 20) return 'Teléfono no puede exceder 20 caracteres';
  return null;
};

export const normalizePhoneNumber = (
  phone: string,
  phonePrefix = '+54'
): { number?: string; error?: string } => {
  const raw = String(phone ?? '').trim();
  if (!raw) return { error: 'El teléfono es obligatorio' };

  let candidate = raw;
  if (!raw.startsWith('+')) candidate = String(phonePrefix) + raw;

  let pn = parsePhoneNumberFromString(candidate);

  // fallback: intentar con +54 si no hay prefijo y no parseo
  if ((!pn || !pn.isValid()) && !candidate.startsWith('+')) {
    pn = parsePhoneNumberFromString('+54' + raw.replace(/^0+/, ''));
  }

  if (pn && pn.isValid()) {
    return { number: pn.number }; // E.164 format
  }

  return { error: 'Teléfono inválido. Use formato: +54 9 11 1234 5678' };
};
