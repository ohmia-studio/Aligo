'use client';
import { resetPasswordAction } from '@/features/auth/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ResetPasswordForm({ token }: { token: string }) {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.set('token', token);
    const result = await resetPasswordAction(formData);
    if (result.status === 200) {
      toast.success(result.message);
      setTimeout(() => router.push('/login'), 2000);
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <label className="mb-1 block text-sm font-medium text-gray-700">
        Nueva Contraseña
      </label>
      <input
        type="password"
        name="newPassword"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-black focus:ring-2 focus:ring-indigo-400 focus:outline-none"
        placeholder="Nueva contraseña"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-indigo-600 py-2 text-white transition duration-300 hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
      </button>
    </form>
  );
}
