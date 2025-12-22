import { PermissionGuard } from '@/components/auth/PermissionGuard';
import Link from 'next/link';

export default function DashboardHome({
  adminPath = '',
}: {
  adminPath: string;
}) {
  return (
    <>
      <header className="flex w-full flex-col items-center py-4">
        <h1 className="text-primary mb-2 text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Bienvenido a Aligo
        </h1>
      </header>
      <main className="text-base-color mx-auto flex w-full max-w-3xl flex-col items-center gap-10 py-8">
        <section
          className="flex flex-col items-center gap-2"
          aria-labelledby="intro-title"
        >
          <h2 id="intro-title" className="sr-only">
            Introducción
          </h2>
          <p className="max-w-xl text-center text-base sm:text-lg">
            Plataforma de gestión para distribuidoras. Controla tus productos,
            empleados, contactos y operaciones de manera simple y eficiente.
          </p>
        </section>
        <nav aria-label="Accesos rápidos" className="mt-6 w-full">
          <ul className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
            <li>
              <Link
                href="/dashboard/catalogos"
                className="bg-secondary text-base-color focus:ring-primary flex flex-col items-center justify-center gap-2 rounded-xl px-6 py-6 font-semibold shadow-lg transition hover:brightness-120 focus:ring-2 focus:outline-none"
              >
                <span className="text-xl">Catálogos</span>
                <span className="text-sm font-normal">Explora productos</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/manuales"
                className="bg-secondary text-base-color focus:ring-primary flex flex-col items-center justify-center gap-2 rounded-xl px-6 py-6 font-semibold shadow-lg transition hover:brightness-120 focus:ring-2 focus:outline-none"
              >
                <span className="text-xl">Manuales</span>
                <span className="text-sm font-normal">Explora manuales</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/novedades"
                className="bg-secondary text-base-color focus:ring-primary flex flex-col items-center justify-center gap-2 rounded-xl px-6 py-6 font-semibold shadow-lg transition hover:brightness-120 focus:ring-2 focus:outline-none"
              >
                <span className="text-xl">Novedades</span>
                <span className="text-sm font-normal">Explora novedades</span>
              </Link>
            </li>
          </ul>
        </nav>
        <PermissionGuard requiredRoles={['admin']}>
          {adminPath !== '' && (
            <section aria-labelledby="gestion-title" className="mt-2 w-full">
              <h2 id="gestion-title" className="sr-only">
                Gestión
              </h2>
              <ul className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
                <li>
                  <Link
                    href={`/dashboard/${adminPath}contactos`}
                    className="bg-secondary text-base-color focus:ring-primary flex flex-col items-center justify-center gap-2 rounded-xl px-6 py-6 font-semibold shadow-lg transition hover:brightness-120 focus:ring-2 focus:outline-none"
                  >
                    <span className="text-xl">Contactos</span>
                    <span className="text-sm font-normal">
                      Gestión de contactos
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/dashboard/${adminPath}empleados`}
                    className="bg-secondary text-base-color focus:ring-primary flex flex-col items-center justify-center gap-2 rounded-xl px-6 py-6 font-semibold shadow-lg transition hover:brightness-120 focus:ring-2 focus:outline-none"
                  >
                    <span className="text-xl">Empleados</span>
                    <span className="text-sm font-normal">
                      Administra tu equipo
                    </span>
                  </Link>
                </li>
              </ul>
            </section>
          )}
        </PermissionGuard>
      </main>
      <footer className="mx-auto mt-8 flex w-full max-w-3xl flex-wrap items-center justify-center gap-6 border-t border-gray-200 py-6">
        <span className="text-sm">
          Aligo &copy; {new Date().getFullYear()} - Distribuidora inteligente
        </span>
      </footer>
    </>
  );
}
