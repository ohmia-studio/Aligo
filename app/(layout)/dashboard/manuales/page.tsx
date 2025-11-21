'use client';

import CatalogListSkeleton from '@/components/catalogs/CatalogListSkeleton';
import { AdminManagerPageTemplate } from '@/components/page/adminManagerPageTemplate';
import ResourcesList from '@/components/page/resourcesList';
import ResourcesUploadForm from '@/components/page/resourcesUploadForm';
import { deleteManualAction } from '@/features/manuals/actions/deleteManual';
import { uploadManualAction } from '@/features/manuals/actions/uploadManual';
import { Resource } from '@/interfaces/resource-interfaces';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function ManualsPage() {
  const [manuals, setManuals] = useState<Resource[]>([]);

  const fetchManuals = async () => {
    try {
      const res = await fetch('/api/manuales', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setManuals(json.manuals ?? []);
    } catch (err: any) {
      console.error('[ManualsPage] fetchManuals error:', err);
      toast.error('Error cargando manuales');
    }
  };

  useEffect(() => {
    fetchManuals();
  }, []);

  // descarga centralizada (igual que en catalogos)
  const handleDownload = (m: Resource) => {
    const url = `/api/manuales?key=${encodeURIComponent(m.fullKey)}&name=${encodeURIComponent(m.name || m.fullKey)}`;
    const a = document.createElement('a');
    a.href = url;
    a.download = m.name || 'manual.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success(`Descargando: ${m.name || 'manual'}`);
  };

  return (
    <AdminManagerPageTemplate
      headerTitle={'Gestión de Manuales'}
      headerDescription={
        'Sube y gestiona tus manuales PDF de manera simple y segura'
      }
      UploaderComponent={
        // <ManualUploadForm onUploadSuccess={handleUploadSuccess} />
        <ResourcesUploadForm
          type="Manual"
          onUploadSuccess={fetchManuals}
          onUploadAction={uploadManualAction}
        />
      }
      ListComponent={
        // <ManualList manuals={manuals} onRefresh={fetchManuals} onDownload={handleDownload}/>
        <ResourcesList
          type="Manual"
          fetchedData={manuals}
          onDeleteAction={deleteManualAction}
          onDownload={handleDownload}
          onRefresh={fetchManuals}
        />
      }
      SkeletonLoader={<CatalogListSkeleton />}
    />
  );
}
