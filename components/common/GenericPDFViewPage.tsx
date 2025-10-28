import BrowserPDFViewer from '@/components/catalogs/BrowserPDFViewer';
import Link from 'next/link';

interface GenericPDFViewPageProps {
  searchParams: Promise<{
    key?: string;
    name?: string;
  }>;
  type: 'catalogos' | 'manuales';
}

export default async function GenericPDFViewPage({
  searchParams,
  type,
}: GenericPDFViewPageProps) {
  const { key, name } = await searchParams;

  const config = {
    catalogos: {
      title: 'Catálogos',
      backUrl: '/dashboard/catalogos',
      apiEndpoint: '/api/catalogos',
    },
    manuales: {
      title: 'Manuales',
      backUrl: '/dashboard/manuales',
      apiEndpoint: '/api/manuales',
    },
  };

  const currentConfig = config[type];

  if (!key || !name) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            Error: Parámetros faltantes
          </h1>
          <p className="mb-4 text-gray-600">
            No se pudo cargar el PDF. Faltan parámetros requeridos.
          </p>
          <Link
            href={currentConfig.backUrl}
            className="inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Volver a {currentConfig.title}
          </Link>
        </div>
      </div>
    );
  }

  // Construir las URLs del PDF
  const pdfUrl = `${currentConfig.apiEndpoint}?key=${encodeURIComponent(key)}&name=${encodeURIComponent(name)}&view=true`;
  const downloadUrl = `${currentConfig.apiEndpoint}?key=${encodeURIComponent(key)}&name=${encodeURIComponent(name)}`;

  return (
    <div className="flex h-screen flex-col">
      {/* Header con navegación - Solo en desktop */}
      <header className="hidden items-center justify-between border-b bg-white px-4 py-3 shadow-sm md:flex">
        <div className="flex items-center gap-4">
          <Link
            href={currentConfig.backUrl}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="hidden sm:inline">
              Volver a {currentConfig.title}
            </span>
            <span className="sm:hidden">Volver</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={downloadUrl}
            download={name}
            className="flex items-center gap-2 rounded bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="hidden sm:inline">Descargar</span>
          </a>
        </div>
      </header>

      {/* Visor de PDF - Toma toda la altura disponible */}
      <div className="flex-1 md:flex-1">
        <BrowserPDFViewer
          pdfUrl={pdfUrl}
          catalogName={decodeURIComponent(name)}
        />
      </div>
    </div>
  );
}
