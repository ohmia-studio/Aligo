import type { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-indigo-50 via-blue-100 to-indigo-200">
      <header className="flex items-center justify-between bg-white/80 px-8 py-4 shadow-md">
        <div className="flex items-center gap-3">
          <a
            href="/dashboard"
            className="text-xl font-bold tracking-tight text-indigo-700"
          >
            Aligo Dashboard
          </a>
        </div>
        <nav className="flex gap-4">
          <a
            href="/dashboard"
            className="font-semibold text-indigo-700 hover:underline"
          >
            Inicio
          </a>
          <a
            href="/dashboard/workers"
            className="font-semibold text-indigo-700 hover:underline"
          >
            Empleados
          </a>
        </nav>
      </header>
      <main className="flex flex-1 flex-col items-center justify-start px-4 py-8 sm:px-8">
        <div className="w-full max-w-5xl">{children}</div>
      </main>
      <footer className="bg-white/80 py-4 text-center text-sm text-gray-500 shadow-inner">
        © {new Date().getFullYear()} Aligo Distribuidora. Todos los derechos
        reservados.
      </footer>
    </div>
  );
}
