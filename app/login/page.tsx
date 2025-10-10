'use client';
import AuthForm from '@/components/auth/AuthForm';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import { useEffect, useState } from 'react';

export default function Page() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Leer el fragment de la URL (después del #)
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.substring(1); // quitar el #
      const params = new URLSearchParams(hash);
      const accessToken = params.get('access_token');
      console.log('access_token from URL fragment:', accessToken);
      setToken(accessToken);
    }
  }, []);
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold text-indigo-700">
          {token ? 'Nueva Contraseña' : 'Inicio de sesión'}
        </h2>
        {token ? <ResetPasswordForm token={token} /> : <AuthForm />}
      </div>
    </div>
  );
}
