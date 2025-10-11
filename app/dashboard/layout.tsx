// app/dashboard/layout.tsx
'use client';

import { logoutUser } from '@/features/auth/logout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const handleLogout = (formData: FormData) => {
    startTransition(async () => {
      const result = await logoutUser();
      if (result?.status >= 400) {
        setError(result.message); // guardo el error y lo muestro
      } else {
        router.push('/');
      }
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between p-4 shadow">
        <Link href="/dashboard" className="cursor-pointer font-bold text-white">
          Mi app
        </Link>

        <form action={handleLogout}>
          <button
            type="submit"
            disabled={isPending}
            className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600 disabled:opacity-50"
          >
            {isPending ? 'Cerrando...' : 'Cerrar sesión'}
          </button>
        </form>
        <Link
          href="/dashboard/catalogos"
          className="cursor-pointer rounded bg-blue-500/10 px-3 py-1 text-blue-500"
        >
          Ir a Catálogos
        </Link>
      </header>

      {error && (
        <div className="bg-red-100 p-2 text-center text-sm text-red-700">
          Error al cerrar sesión: {error}
        </div>
      )}

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
