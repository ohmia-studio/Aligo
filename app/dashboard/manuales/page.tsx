'use client';

import CatalogListSkeleton from '@/components/catalogs/CatalogListSkeleton';
import ManualList from '@/components/manuals/ManualList';
import ManualUploadForm from '@/components/manuals/ManualUploadForm';
import { listManuals } from '@/features/manuals/manuals';
import { Suspense, useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function ManualsPage() {
  const [manuals, setManuals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchManuals = async () => {
    setIsLoading(true);
    try {
      const res = await listManuals();
      if (res.success) {
        setManuals(res.manuals);
      } else {
        toast.error(res.error || 'Error al cargar manuales');
      }
    } catch (err) {
      console.error('fetchManuals error:', err);
      toast.error('Error al cargar manuales');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchManuals();
  }, []);

  const handleUploadSuccess = () => {
    fetchManuals();
  };

  return (
    <Suspense fallback={<div className="p-6">Cargando manuales…</div>}>
      <header className="mb-8 flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-blue-500 sm:text-4xl">
          Gestión de Manuales
        </h1>
        <p className="text-base text-gray-700 sm:text-lg">
          Sube y gestiona tus manuales (PDF) de manera simple y segura
        </p>
      </header>

      <section className="flex flex-col gap-8 rounded-xl bg-gray-50 p-4 shadow-sm lg:flex-row lg:items-start">
        <article className="w-full lg:w-1/2">
          <ManualUploadForm onUploadSuccess={handleUploadSuccess} />
        </article>

        <article className="w-full lg:w-1/2">
          {isLoading ? (
            <div className="p-6">
              <CatalogListSkeleton />
            </div>
          ) : (
            <ManualList manuals={manuals} />
          )}
        </article>
      </section>
    </Suspense>
  );
}
