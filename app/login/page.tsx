'use client';
import { loginUser } from '@/features/auth/login';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
export default function Page() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!username.trim()) {
      setError('El email es obligatorio');
      return;
    }
    if (!emailRegex.test(username)) {
      setError('El email no tiene un formato válido');
      return;
    }
    if (!password.trim()) {
      setError('La contraseña es obligatoria');
      return;
    }

    setLoading(true);
    try {
      const result = await loginUser({ email: username, password });
      console.log(result);
      if (result.status === 200) {
        router.push('/dashboard'); // Redirige al dashboard
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold text-indigo-700">
          Iniciar sesión
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-black focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              placeholder="Tu usuario"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-black focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              placeholder="Tu contraseña"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white shadow transition hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Ingresar'}
          </button>
          {error && (
            <div className="mt-2 text-center text-red-600">{error}</div>
          )}
        </form>
      </div>
    </div>
  );
}
