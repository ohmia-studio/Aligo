'use client';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function NewPasswordPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSessionReady, setIsSessionReady] = useState(false);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-blue-200">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white/90 p-8 shadow-2xl">
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-2 flex items-center gap-2">
            <svg
              width="36"
              height="36"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="16" cy="16" r="16" fill="#6366f1" />
              <text
                x="16"
                y="22"
                textAnchor="middle"
                fontSize="16"
                fill="white"
                fontWeight="bold"
              >
                A
              </text>
            </svg>
            <span className="text-2xl font-extrabold tracking-tight text-indigo-700">
              Aligo
            </span>
          </div>
          <h2 className="text-center text-2xl font-bold text-indigo-700">
            Nueva Contraseña
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Elige una contraseña segura para tu cuenta
          </p>
        </div>
        <ResetPasswordForm />
      </div>
    </div>
  );
}
