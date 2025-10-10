'use client';
import { authAction } from '@/features/auth/auth';
import { useState } from 'react';
import { toast } from 'sonner';
type FormState = {
  username: string;
  password: string;
  loading: boolean;
  error: string;
  message: string;
  resetMode: boolean;
  disabled: boolean;
};
export default function AuthForm() {
  const [state, setState] = useState<FormState>({
    username: '',
    password: '',
    loading: false,
    error: '',
    message: '',
    resetMode: false,
    disabled: false,
  });
  const [resetCooldown, setResetCooldown] = useState(false);

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = await authAction(formData);
    if (result?.message) {
      toast[result.status === 200 ? 'success' : 'error'](result.message);
    }
    // Si está en resetMode y fue exitoso, activa cooldown
    if (state.resetMode && result?.status === 200) {
      setResetCooldown(true);
      setTimeout(() => setResetCooldown(false), 30000); // 30 segundos
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input
        type="hidden"
        name="resetMode"
        value={state.resetMode ? 'true' : 'false'}
      />
      <label className="mb-1 block text-sm font-medium text-gray-700">
        Usuario
      </label>
      <input
        type="email"
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
      {!state.disabled && (!resetCooldown || !state.resetMode) && (
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
        <div className="mt-2 text-center text-green-600">{state.message}</div>
      )}
    </form>
  );
}
