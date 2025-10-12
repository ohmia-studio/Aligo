'use client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import PasswordInput from '@/components/ui/PasswordInput';
import { updatePasswordAction } from '@/features/auth/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Función para validar la contraseña en tiempo real
  const validatePasswordRealTime = (password: string) => {
    const errors: string[] = [];

    if (password.length < 6) {
      errors.push('Mínimo 6 caracteres');
    }

    if (!/\d/.test(password)) {
      errors.push('Al menos un número');
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Al menos un carácter especial');
    }

    if (!/[a-zA-Z]/.test(password)) {
      errors.push('Al menos una letra');
    }

    setValidationErrors(errors);
  };

  // Usamos server action HTML puro
  // No hay handleSubmit, el form se envía directamente

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    // Agregar el código de la URL al formData
    const code = searchParams.get('code');
    if (code) {
      formData.append('code', code);
    }

    const result = await updatePasswordAction(formData);
    if (result.status === 200) {
      setMessage(result.message);
      setShowSuccessDialog(true);
    } else {
      setError(result.message);
      setShowErrorDialog(true);
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
        onChange={(e) => {
          setNewPassword(e.target.value);
          validatePasswordRealTime(e.target.value);
        }}
        placeholder="Nueva contraseña"
        required
      />

      {/* Mostrar requisitos de validación */}
      {newPassword.length > 0 && (
        <div className="space-y-1 text-xs">
          <p className="font-medium text-gray-600">Requisitos de contraseña:</p>
          {validationErrors.map((error, index) => (
            <p key={index} className="text-red-500">
              ✗ {error}
            </p>
          ))}
          {validationErrors.length === 0 && (
            <p className="text-green-500">✓ Contraseña válida</p>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || validationErrors.length > 0}
        className="w-full rounded-lg bg-indigo-600 py-2 text-white transition duration-300 hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
      </button>

      {/* Alert Dialog para errores */}
      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent>
          <AlertDialogTitle>Error al actualizar contraseña</AlertDialogTitle>
          <AlertDialogDescription>{error}</AlertDialogDescription>
          <AlertDialogAction onClick={() => setShowErrorDialog(false)}>
            Entendido
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alert Dialog para éxito */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogTitle>¡Contraseña actualizada!</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
          <AlertDialogAction
            onClick={() => {
              setShowSuccessDialog(false);
              router.push('/login');
            }}
          >
            Ir al Login
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
}
