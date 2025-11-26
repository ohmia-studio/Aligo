'use client';

import CatalogListSkeleton from '@/components/catalogs/CatalogListSkeleton';
import { AdminManagerPageTemplate } from '@/components/page/adminManagerPageTemplate';
import ResourcesList from '@/components/page/resourcesList';
import ResourcesUploadForm from '@/components/page/resourcesUploadForm';
import { triggerDownload } from '@/features/storage/client';
import {
  deleteAction,
  listAction,
  uploadAction,
} from '@/features/storage/storage';
import { Resource } from '@/interfaces/resource-interfaces';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function ManualsPage() {
  const [manuals, setManuals] = useState<Resource[]>([]);

  const fetchManuals = async () => {
    try {
      const result = await listAction('manuales');
      if (result && result.status === 200) {
        setManuals(result.data?.manuals || []);
      } else {
        toast.error(result?.message || 'Error cargando manuales');
      }
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
    triggerDownload(m.fullKey, m.name || m.fullKey);
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
          onUploadAction={uploadAction}
        />
      }
      ListComponent={
        // <ManualList manuals={manuals} onRefresh={fetchManuals} onDownload={handleDownload}/>
        <ResourcesList
          type="Manual"
          fetchedData={manuals}
          onDeleteAction={(key) => deleteAction('manuales', key)}
          onDownload={handleDownload}
          onRefresh={fetchManuals}
        />
      }
      SkeletonLoader={<CatalogListSkeleton />}
    />
  );
}
