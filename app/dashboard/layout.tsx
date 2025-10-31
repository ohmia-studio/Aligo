// app/dashboard/layout.tsx
'use client';

import AdminNavbar from '@/components/common/adminNavbar';
import { logoutUser } from '@/features/auth/logout';
import { clearUser } from '@/store/authSlice';
import { RootState } from '@/store/store';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  // Obtener usuario del estado (sin verificación de auth, eso lo maneja el middleware)
  const user = useSelector((state: RootState) => state.auth.user);
  const handleLogout = async () => {
    startTransition(async () => {
      try {
        setError(null);
        const result = await logoutUser();

        if (result.status !== 200) {
          setError(result.message);
        } else {
          // Limpiar el estado de Redux cuando el logout es exitoso
          dispatch(clearUser());
          router.push('/login');
        }
      } catch (err) {
        setError('Ocurrió un error inesperado');
      }
    });
  };

  // Oculta el header/nav si estás en /dashboard/admin o subrutas
  const isAdminRoute = pathname?.startsWith('/dashboard/admin');

  // Lógica para home y links según rol
  const getHomeRoute = () => {
    if (!user) return '/dashboard';
    switch (user.rol) {
      case 'admin':
        return '/dashboard/admin';
      case 'empleado':
        return '/dashboard/empleados';
      default:
        return '/dashboard';
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-green-100 via-white to-indigo-100">
      {/*
      <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-gray-200 bg-white/80 px-6 py-3 shadow-lg backdrop-blur-md">
        <Link
          href={getHomeRoute()}
          className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-green-700 transition hover:text-green-800"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="16" cy="16" r="16" fill="#22c55e" />
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
          <div className="flex flex-col">
            <span>Aligo Distribuidora</span>
            {user && (
              <span className="text-xs font-normal text-green-600 capitalize">
                {user.rol} • {user.name}
              </span>
            )}
          </div>
        </Link>
        <nav className="flex items-center gap-2">
          
          {user?.rol === 'admin' && <AdminNavLinks />}
          
          <Link
            href="/dashboard/catalogos"
            className="flex items-center gap-1 rounded-lg bg-green-100 px-3 py-1 font-medium text-green-700 transition hover:bg-green-200"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Catálogos
          </Link>
          <form action={handleLogout} className="ml-2">
            <button
              type="submit"
              disabled={isPending}
              className="flex cursor-pointer items-center gap-1 rounded-lg bg-red-500 px-3 py-1 font-medium text-white shadow transition hover:bg-red-600 focus:ring-2 focus:ring-red-400 focus:outline-none disabled:opacity-50"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7"
                />
              </svg>
              {isPending ? 'Cerrando...' : 'Cerrar sesión'}
            </button>
          </form>
        </nav>
      </header>
*/}
      <AdminNavbar />
      <div className="flex min-h-screen flex-col">
        <header className="flex items-center justify-between p-4 shadow">
          <h1 className="text-lg font-bold">Mi App</h1>

          <form action={handleLogout}>
            <button
              type="submit"
              disabled={isPending}
              className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600 disabled:opacity-50"
            >
              {isPending ? 'Cerrando...' : 'Cerrar sesión'}
            </button>
          </form>
        </header>

        {error && (
          <div className="bg-red-100 p-2 text-center text-sm text-red-700">
            Error al cerrar sesión: {error}
          </div>
        )}

        <main className="animate-fade-in flex flex-1 flex-col items-center justify-center">
          <div className="w-full max-w-5xl px-2 py-8 sm:px-6 lg:px-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
