'use client';
import AuthForm from '@/components/auth/AuthForm';

export default function Page() {
  // Solo renderiza el login y el request de reset
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold text-indigo-700">
          Inicio de sesión
        </h2>
        <AuthForm />
      </div>
    </div>
  );
}
