'use client';
import AuthForm from '@/components/auth/AuthForm';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const searchParams = useSearchParams();
  const token = searchParams.get('code');

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
