'use client';
import Alert from '@/components/ui/FormAlert';
import PasswordInput from '@/components/ui/PasswordInput';
import { authAction } from '@/features/auth/auth';
import { useAuthForm } from '@/hooks/useAuthForm';
import { setUser } from '@/store/authSlice';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
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

  const dispatch = useDispatch();
  const router = useRouter();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField(e.target.name, e.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    clearMessages();

    // Ambos casos (login y reset) usan server action para que la sesión se maneje correctamente en cookies
    const formData = new FormData(event.currentTarget);
    const result = await authAction(formData);

    if (result?.message) {
      const isSuccess = result.status === 200;
      setMessage(result.message, !isSuccess);

      // Si es login exitoso, guardar usuario en Redux
      if (isSuccess && !state.resetMode && result.data?.user) {
        dispatch(
          setUser({
            id: result.data.user.id,
            email: result.data.user.email,
            rol: result.data.role,
            name: result.data.user.email, // Por ahora usamos el email como nombre
          })
        );
        // Redirigir según el rol
        if (router) {
          if (result.data.role === 'admin') {
            router.push('/dashboard/admin');
          } else {
            router.push('/dashboard');
          }
        }
      }

      // Si es reset exitoso, activar cooldown
      if (isSuccess && state.resetMode) {
        activateResetCooldown();
      }
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="text-base-color space-y-5">
      <input
        type="hidden"
        name="resetMode"
        value={state.resetMode ? 'true' : 'false'}
      />
      <label className="mb-1 block text-sm font-medium">Usuario</label>
      <input
        type="email"
        name="username"
        value={state.username}
        onChange={handleChange}
        required
        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:outline-none"
        placeholder="Tu usuario"
      />

      {!state.resetMode && (
        <>
          <label className="mb-1 block text-sm font-medium">Contraseña</label>
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
          className="text-base-color-foreground bg-accent hover:bg-accent/90 w-full rounded-lg px-4 py-2 font-semibold shadow transition hover:cursor-pointer disabled:opacity-50"
        >
          {state.loading
            ? 'Enviando...'
            : state.resetMode
              ? 'Restablecer mi contraseña'
              : 'Ingresar'}
        </button>
      )}

      <p
        className="cursor-pointer text-center hover:underline"
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
