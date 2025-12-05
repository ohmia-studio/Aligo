import { parsePhoneNumberFromString } from 'libphonenumber-js';

export const validateEmail = (email: string): string | null => {
  if (!email.trim()) return 'El email es obligatorio';
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!regex.test(email)) return 'El email no tiene un formato válido';
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password.trim()) return 'La contraseña es obligatoria';
  return null;
};

export const normalizePhoneNumber = (
  phone: string,
  phonePrefix = '+54'
): { number?: string; error?: string } => {
  const raw = String(phone ?? '').trim();
  if (!raw) return { number: undefined };

  let candidate = raw;
  if (!raw.startsWith('+')) candidate = String(phonePrefix) + raw;

  let pn = parsePhoneNumberFromString(candidate);

  // fallback: intentar con +54 si no hay prefijo y no parseo
  if ((!pn || !pn.isValid()) && !candidate.startsWith('+')) {
    pn = parsePhoneNumberFromString('+54' + raw.replace(/^0+/, ''));
  }

  if (pn && pn.isValid()) {
    return { number: pn.number }; // E.164
  }

  return { error: 'Teléfono inválido' };
};
