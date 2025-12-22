import NotFoundPage from '@/components/ui/NotFoundPage';

export default function ManualNotFound() {
  return (
    <NotFoundPage
      title="Manual no encontrado"
      message="Los parámetros del PDF no son válidos o el manual no existe."
      backUrl="/dashboard/manuales"
      backLabel="Volver a Manuales"
    />
  );
}
