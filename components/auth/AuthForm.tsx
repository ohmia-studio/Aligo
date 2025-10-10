'use client';
import Alert from '@/components/ui/FormAlert';
import PasswordInput from '@/components/ui/PasswordInput';
import { authAction } from '@/features/auth/auth';
import { useAuthForm } from '@/hooks/useAuthForm';

export default function AuthForm() {
  const {
    state,
    resetCooldown,
    updateField,
    toggleResetMode,
    setLoading,
    setMessage,
    clearMessages,
    clearError,
    clearSuccessMessage,
    activateResetCooldown,
  } = useAuthForm();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField(e.target.name, e.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    clearMessages();

    const formData = new FormData(event.currentTarget);
    const result = await authAction(formData);

    if (result?.message) {
      const isSuccess = result.status === 200;
      setMessage(result.message, !isSuccess);

      if (state.resetMode && isSuccess) {
        activateResetCooldown();
      }
    }

    setLoading(false);
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
          <PasswordInput
            name="password"
            value={state.password}
            onChange={handleChange}
            placeholder="Tu contraseña"
            required
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
        onClick={toggleResetMode}
      >
        {state.resetMode ? 'Volver al login' : 'Olvidé mi contraseña'}
      </p>

      {state.error && (
        <Alert type="error" message={state.error} onClose={clearError} />
      )}

      {state.message && (
        <Alert
          type="success"
          message={state.message}
          onClose={clearSuccessMessage}
        />
      )}
    </form>
  );
}
