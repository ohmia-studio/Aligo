'use client';
import AuthForm from '@/components/auth/AuthForm';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-blue-200 px-4">
      {/* Volver al home */}
      <Link
        href="/"
        className="mt-4 mb-6 inline-flex items-center gap-2 text-sm font-medium text-indigo-700 hover:underline"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M9.707 14.707a1 1 0 01-1.414 0L3.586 10l4.707-4.707a1 1 0 011.414 1.414L6.414 10l3.293 3.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Volver al inicio
      </Link>

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
            Inicio de sesión
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Accede a tu cuenta para gestionar la distribuidora
          </p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}
