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
