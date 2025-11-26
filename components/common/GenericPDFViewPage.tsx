import BrowserPDFViewer from '@/components/catalogs/BrowserPDFViewer';
import { GenericPDFViewPageProps } from '@/interfaces/documents-interfaces';
import Link from 'next/link';

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

  // Determinar homeUrl y homeLabel según el rol
  // Ejemplo: puedes obtener el rol del usuario desde contexto, session, etc.
  // Aquí lo simulo con una variable (ajusta según tu lógica real)
  const userRole = 'admin'; // Cambia esto por tu lógica real
  const homeUrl = userRole === 'admin' ? '/dashboard/admin' : '/dashboard';

  return (
    <div className="relative h-screen w-full bg-gray-100">
      <BrowserPDFViewer
        pdfUrl={pdfUrl}
        catalogName={decodeURIComponent(name)}
        downloadUrl={downloadUrl}
        backUrl={currentConfig.backUrl}
        backLabel={`Volver a ${currentConfig.title}`}
        homeUrl={homeUrl}
      />
    </div>
  );
}
