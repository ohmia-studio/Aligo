'use client';
import { loginUser } from '@/features/auth/login';
import { requestResetPassword } from '@/features/auth/resetPassword';
import { validateEmail, validatePassword } from '@/lib/validations';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
export default function Page() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [resetMode, setResetMode] = useState(false);
  const router = useRouter();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const emailError = validateEmail(username);
    if (emailError) {
      setError(emailError);
      return;
    }

    setLoading(true);
    try {
      if (resetMode) {
        const response = await requestResetPassword(username);
        if (response.status === 200) setMessage(response.message);
        else setError(response.message);
      } else {
        const pwdError = validatePassword(password);
        if (pwdError) {
          setError(pwdError);
          return;
        }
        const result = await loginUser({ email: username, password });
        if (result.status === 200) router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message ?? 'Ocurrió un error');
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
          {!resetMode ? (
            <>
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
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white shadow transition hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Enviando...' : 'Ingresar'}
              </button>
            </>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white shadow transition hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Restablecer mi contraseña'}
            </button>
          )}
          <p
            className="cursor-pointer text-black hover:underline"
            onClick={() => setResetMode(!resetMode)}
          >
            Olvide mi contraseña
          </p>
          {error ? (
            <div className="mt-2 text-center text-red-600">{error}</div>
          ) : (
            <div className="mt-2 text-center text-green-600">{message}</div>
          )}
        </form>
      </div>
    </div>
  );
}
