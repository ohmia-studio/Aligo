import NotFoundPage from '@/components/ui/NotFoundPage';

export default function CatalogNotFound() {
  return (
    <NotFoundPage
      title="Catálogo no encontrado"
      message="Los parámetros del PDF no son válidos o el catálogo no existe."
      backUrl="/dashboard/catalogos"
      backLabel="Volver a Catálogos"
    />
  );
}
