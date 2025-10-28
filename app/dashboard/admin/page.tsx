import Link from 'next/link';

export default function DashboardHomeAdmin() {
  return (
    <>
      <header className="flex w-full flex-col items-center py-4">
        <h1 className="mb-2 text-center text-3xl font-bold tracking-tight text-green-700 sm:text-4xl">
          Bienvenido a Aligo
        </h1>
      </header>
      <main className="mx-auto flex w-full max-w-3xl flex-col items-center gap-10 py-8">
        <section
          className="flex flex-col items-center gap-2"
          aria-labelledby="intro-title"
        >
          <h2 id="intro-title" className="sr-only">
            Introducción
          </h2>
          <p className="max-w-xl text-center text-base text-gray-700 sm:text-lg">
            Plataforma de gestión para distribuidoras. Controla tus productos,
            empleados, contactos y operaciones de manera simple y eficiente.
          </p>
        </section>
        <nav aria-label="Accesos rápidos" className="mt-6 w-full">
          <ul className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
            <li>
              <Link
                href="/dashboard/catalogos"
                className="flex flex-col items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-6 font-semibold text-white shadow-lg transition hover:bg-green-600 focus:ring-2 focus:ring-green-400 focus:outline-none"
              >
                <span className="text-xl">Catálogos</span>
                <span className="text-sm font-normal text-green-100">
                  Explora productos
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/news"
                className="flex flex-col items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-6 font-semibold text-white shadow-lg transition hover:bg-green-600 focus:ring-2 focus:ring-green-400 focus:outline-none"
              >
                <span className="text-xl">Novedades</span>
                <span className="text-sm font-normal text-green-100">
                  Explora novedades
                </span>
              </Link>
            </li>
          </ul>
        </nav>
        <section aria-labelledby="gestion-title" className="mt-2 w-full">
          <h2 id="gestion-title" className="sr-only">
            Gestión
          </h2>
          <ul className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
            <li>
              <Link
                href="/dashboard/admin/contactos"
                className="flex flex-col items-center justify-center gap-2 rounded-xl bg-yellow-400 px-6 py-6 font-semibold text-black shadow-lg transition hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-300 focus:outline-none"
              >
                <span className="text-xl">Contactos</span>
                <span className="text-sm font-normal text-yellow-900">
                  Gestión de contactos
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/empleados"
                className="flex flex-col items-center justify-center gap-2 rounded-xl bg-gray-500 px-6 py-6 font-semibold text-white shadow-lg transition hover:bg-gray-900 focus:ring-2 focus:ring-gray-400 focus:outline-none"
              >
                <span className="text-xl">Empleados</span>
                <span className="text-sm font-normal text-gray-200">
                  Administra tu equipo
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/manuales"
                className="flex flex-col items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-6 font-semibold text-white shadow-lg transition hover:bg-green-600 focus:ring-2 focus:ring-green-400 focus:outline-none"
              >
                <span className="text-xl">Manuales</span>
                <span className="text-sm font-normal text-green-100">
                  Explora manuales
                </span>
              </Link>
            </li>
          </ul>
        </section>
      </main>
      <footer className="mx-auto mt-8 flex w-full max-w-3xl flex-wrap items-center justify-center gap-6 border-t border-gray-200 py-6">
        <span className="text-sm text-gray-500">
          Aligo &copy; {new Date().getFullYear()} - Distribuidora inteligente
        </span>
      </footer>
    </>
  );
}
