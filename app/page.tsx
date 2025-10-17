export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-green-50 via-white to-indigo-100 px-2 py-8 sm:px-8">
      <main className="mx-auto flex w-full max-w-3xl flex-col items-center gap-10 py-8">
        <div className="flex flex-col items-center gap-2">
          <h1 className="mb-2 text-center text-3xl font-bold tracking-tight text-green-700 sm:text-4xl">
            Ingresar a Aligo
          </h1>
          <p className="max-w-xl text-center text-base text-gray-700 sm:text-lg">
            Accede a tu cuenta para gestionar la distribuidora.
          </p>
        </div>
        <div className="mt-6 flex w-full justify-center">
          <a
            href="/login"
            className="flex flex-col items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-6 font-semibold text-white shadow-lg transition hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          >
            <span className="text-xl">Ingresar</span>
            <span className="text-sm font-normal text-indigo-100">
              Accede a tu cuenta
            </span>
          </a>
        </div>
      </main>
      <footer className="mx-auto mt-8 flex w-full max-w-3xl flex-wrap items-center justify-center gap-6 border-t border-gray-200 py-6">
        <span className="text-sm text-gray-500">
          Aligo &copy; {new Date().getFullYear()} - Distribuidora inteligente
        </span>
        <a
          className="text-sm text-green-700 hover:underline hover:underline-offset-4"
          href="mailto:contacto@aligo.com"
        >
          contacto@aligo.com
        </a>
      </footer>
    </div>
  );
}
