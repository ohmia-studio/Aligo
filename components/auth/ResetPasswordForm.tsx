'use client';
import Alert from '@/components/ui/FormAlert';
import PasswordInput from '@/components/ui/PasswordInput';
import { updatePasswordAction } from '@/features/auth/auth';
import getSupabaseClient from '@/lib/supabase/supabaseClient';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ResetPasswordForm({ token }: { token: string }) {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [ready, setReady] = useState(false); // listo para enviar cuando el exchange se complete
  const router = useRouter();

  useEffect(() => {
    // Establece la sesión con el access_token que ya tenemos
    const setSession = async () => {
      if (!token) {
        setError('Token de restablecimiento faltante.');
        return;
      }
      try {
        const supabase = getSupabaseClient(); // Usa el del cliente debido a que si no, no puede recuperar el code_verifier del localStorage que guarda supabase por defecto

        // Leer también refresh_token del fragment de la URL si está disponible
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const refreshToken = params.get('refresh_token');

        if (refreshToken) {
          // Establecer la "sesión completa" con access_token y refresh_token
          const { error } = await supabase.auth.setSession({
            access_token: token,
            refresh_token: refreshToken,
          });

          if (error) {
            console.log(error);
            setError('El enlace de restablecimiento es inválido o expiró.');
            setReady(false);
          } else {
            setReady(true);
          }
        } else {
          setError('Datos de sesión incompletos en el enlace.');
          setReady(false);
        }
      } catch (e) {
        console.log(e);
        setError('No se pudo validar el enlace de restablecimiento.');
        setReady(false);
      }
    };
    void setSession();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (!ready) return;
    const formData = new FormData(e.currentTarget);
    const result = await updatePasswordAction(formData);

    if (result.status === 200) {
      setMessage(result.message);
      setTimeout(() => {
        // Redirigir al login sin el hash y hacer refresh
        router.push('/login');
        router.refresh();
      }, 2000);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <label className="mb-1 block text-sm font-medium text-gray-700">
        Nueva Contraseña
      </label>
      <PasswordInput
        name="newPassword"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="Nueva contraseña"
        required
      />

      <button
        type="submit"
        disabled={loading || !ready}
        className="w-full rounded-lg bg-indigo-600 py-2 text-white transition duration-300 hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading
          ? 'Actualizando...'
          : ready
            ? 'Actualizar Contraseña'
            : 'Validando enlace...'}
      </button>

      {error && (
        <Alert type="error" message={error} onClose={() => setError('')} />
      )}

      {message && (
        <Alert
          type="success"
          message={message}
          onClose={() => setMessage('')}
        />
      )}
    </form>
  );
}
