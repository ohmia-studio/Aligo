import { GenericPDFViewPageProps } from '@/interfaces/documents-interfaces';
import { stripTimestamp } from '@/lib/utils';
import BrowserPDFViewer from './BrowserPDFViewer';

export default async function GenericPDFViewPage({
  searchParams,
  type,
}: GenericPDFViewPageProps) {
  const { key, name } = await searchParams;

  const config = {
    catalogos: {
      title: 'Catálogos',
      backUrl: '/dashboard/catalogos',
      apiEndpoint: '/api/storage',
    },
    manuales: {
      title: 'Manuales',
      backUrl: '/dashboard/manuales',
      apiEndpoint: '/api/storage',
    },
  };

  const currentConfig = config[type];

  // Construir las URLs del PDF
  const pdfUrl = `${currentConfig.apiEndpoint}?key=${encodeURIComponent(key!)}&name=${encodeURIComponent(name!)}&view=true`;
  const downloadUrl = `${currentConfig.apiEndpoint}?key=${encodeURIComponent(key!)}&name=${encodeURIComponent(name!)}`;
  const cleanName = stripTimestamp(name);
  // Determinar homeUrl y homeLabel según el rol
  // Ejemplo: puedes obtener el rol del usuario desde contexto, session, etc.
  // Aquí lo simulo con una variable (ajusta según tu lógica real)
  const userRole = 'admin'; // Cambia esto por tu lógica real
  const homeUrl = userRole === 'admin' ? '/dashboard/admin' : '/dashboard';

  return (
    <div className="relative h-[90svh] w-full">
      <BrowserPDFViewer
        pdfUrl={pdfUrl}
        catalogName={cleanName}
        downloadUrl={downloadUrl}
        backUrl={currentConfig.backUrl}
        backLabel={`Volver a ${currentConfig.title}`}
        homeUrl={homeUrl}
      />
    </div>
  );
}
