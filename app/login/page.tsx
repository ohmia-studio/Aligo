'use client';
import { loginUser } from '@/features/auth/login';
import { requestResetPassword } from '@/features/auth/resetPassword';
import { validateEmail, validatePassword } from '@/lib/validations';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type FormState = {
  username: string;
  password: string;
  loading: boolean;
  error: string;
  message: string;
  resetMode: boolean;
  disabled: boolean;
};

export default function Page() {
  const [state, setState] = useState<FormState>({
    username: '',
    password: '',
    loading: false,
    error: '',
    message: '',
    resetMode: false,
    disabled: false,
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleToggleReset = () => {
    setState((prev) => ({
      ...prev,
      resetMode: !prev.resetMode,
      error: '',
      message: '',
      disabled: false,
      username: '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, error: '', message: '', loading: true }));

    const emailError = validateEmail(state.username);
    if (emailError) {
      setState((prev) => ({ ...prev, error: emailError, loading: false }));
      return;
    }

    try {
      if (state.resetMode) {
        const response = await requestResetPassword(state.username);
        setState((prev) => ({
          ...prev,
          message: response.status === 200 ? response.message : '',
          error: response.status !== 200 ? response.message : '',
        }));
        if (response.status === 200) {
          setState((prev) => ({ ...prev, disabled: true }));
        }
      } else {
        const pwdError = validatePassword(state.password);
        if (pwdError) {
          setState((prev) => ({ ...prev, error: pwdError, loading: false }));
          return;
        }
        const result = await loginUser({
          email: state.username,
          password: state.password,
        });
        if (result.status === 200) router.push('/dashboard');
      }
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        error: err.message ?? 'Ocurrió un error',
      }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold text-indigo-700">
          {state.resetMode ? 'Restablecer contraseña' : 'Iniciar sesión'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Usuario
          </label>
          <input
            type="text"
            name="username"
            value={state.username}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-black focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            placeholder="Tu usuario"
          />

          {!state.resetMode && (
            <>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={state.password}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-black focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                placeholder="Tu contraseña"
              />
            </>
          )}
          {!state.disabled && (
            <button
              type="submit"
              disabled={state.loading}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white shadow transition hover:bg-indigo-700 disabled:opacity-50"
            >
              {state.loading
                ? 'Enviando...'
                : state.resetMode
                  ? 'Restablecer mi contraseña'
                  : 'Ingresar'}
            </button>
          )}

          <p
            className="cursor-pointer text-center text-black hover:underline"
            onClick={handleToggleReset}
          >
            {state.resetMode ? 'Volver al login' : 'Olvidé mi contraseña'}
          </p>

          {state.error && (
            <div className="mt-2 text-center text-red-600">{state.error}</div>
          )}
          {state.message && (
            <div className="mt-2 text-center text-green-600">
              {state.message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
