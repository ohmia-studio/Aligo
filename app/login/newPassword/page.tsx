'use client';
import { resetPassword } from '@/features/auth/resetPassword';
import { validatePassword } from '@/lib/validations';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function Page() {
  const [newPassword, setNewPassword] = useState('');
  const searchParams = useSearchParams();
  const token = searchParams.get('code'); // token de Supabase
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('Token inválido');
      return;
    }
    const validateError = validatePassword(newPassword);
    if (validateError) {
      setError('La contraseña es obligatoria');
      return;
    }

    setLoading(true);
    try {
      const data = await resetPassword(newPassword, token);
      console.log(data);
      if (data.status === 200) {
        router.push('/login');
      } else {
        setError(data.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
      <section className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold text-indigo-700">
          Nueva Contraseña
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Nueva Contraseña
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-black focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            placeholder="Nueva contraseña"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 py-2 text-white transition duration-300 hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
          </button>
        </form>
      </section>
    </div>
  );
}
