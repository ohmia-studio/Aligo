'use client';

import CatalogListSkeleton from '@/components/catalogs/CatalogListSkeleton';
import ManualList from '@/components/manuals/ManualList';
import ManualUploadForm from '@/components/manuals/ManualUploadForm';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type Manual = {
  key: string;
  file_name?: string;
  url?: string;
  size?: number;
  lastModified?: string | null;
};

export default function ManualsPage() {
  const [manuals, setManuals] = useState<Manual[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchManuals = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/manuales', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setManuals(json.manuals ?? []);
    } catch (err: any) {
      console.error('[ManualsPage] fetchManuals error:', err);
      toast.error('Error cargando manuales');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchManuals();
  }, []);

  const handleUploadSuccess = () => fetchManuals();

  // descarga centralizada (igual que en catalogos)
  const handleDownload = (m: Manual) => {
    const url =
      m.url || `${process.env.NEXT_PUBLIC_R2_URL}/${encodeURIComponent(m.key)}`;
    const a = document.createElement('a');
    a.href = url;
    a.download = m.file_name || 'manual.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success(`Descargando: ${m.file_name || 'manual'}`);
  };

  return (
    <>
      <header className="mb-8 flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-blue-500 sm:text-4xl">
          Gestión de Manuales
        </h1>
        <p className="text-base text-gray-700 sm:text-lg">
          Sube y gestiona tus manuales PDF de manera simple y segura
        </p>
      </header>

      <section className="flex flex-col gap-8 rounded-xl bg-gray-50 p-4 shadow-sm lg:flex-row lg:items-start">
        <article className="w-full lg:w-1/2">
          <ManualUploadForm onUploadSuccess={handleUploadSuccess} />
        </article>

        <article className="w-full lg:w-1/2">
          {isLoading ? (
            <CatalogListSkeleton />
          ) : (
            <ManualList
              manuals={manuals}
              onRefresh={fetchManuals}
              onDownload={handleDownload}
            />
          )}
        </article>
      </section>
    </>
  );
}
