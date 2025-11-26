'use client';

import CatalogListSkeleton from '@/components/catalogs/CatalogListSkeleton';
import DeleteCatalogModal from '@/components/catalogs/DeleteCatalogModal';
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

export default function CatalogosPage() {
  const [catalogs, setCatalogs] = useState<Resource[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [catalogToDelete, setCatalogToDelete] = useState<Resource | null>(null);

  const fetchCatalogs = async () => {
    try {
      const result = await listAction('catalogs');
      if (result && result.status === 200) {
        setCatalogs(result.data?.catalogs || []);
      } else {
        toast.error(result?.message || 'Error al cargar los catálogos');
      }
    } catch (error) {
      toast.error('Error al cargar los catálogos');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!catalogToDelete) return;
    try {
      const result = await deleteAction('catalogs', catalogToDelete.fullKey);
      if (result && result.status === 200) {
        toast.success(result.message || 'Catálogo eliminado correctamente');
        setCatalogs(
          catalogs.filter((c) => c.fullKey !== catalogToDelete.fullKey)
        );
      } else {
        toast.error(result?.message || 'Error al eliminar el catálogo');
      }
    } catch (error) {
      toast.error('Error al eliminar el catálogo');
      console.error(error);
    } finally {
      setDeleteModalOpen(false);
      setCatalogToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setCatalogToDelete(null);
  };

  const handleDownload = (catalog: Resource) => {
    triggerDownload(catalog.fullKey, catalog.name);
    toast.success(`Descargando: ${catalog.name}`);
  };

  useEffect(() => {
    fetchCatalogs();
  }, []);

  return (
    <>
      <AdminManagerPageTemplate
        headerTitle={'Gestión de Catalogos'}
        headerDescription={
          'Sube y gestiona tus catalogos PDF de manera simple y segura'
        }
        UploaderComponent={
          // <CatalogUploadForm onUploadSuccess={handleUploadSuccess} />
          <ResourcesUploadForm
            type="Catalogo"
            onUploadSuccess={fetchCatalogs}
            onUploadAction={uploadAction}
          />
        }
        ListComponent={
          // <CatalogList catalogs={catalogs} onDelete={isAdmin ? handleDeleteRequest : undefined} onDownload={handleDownload} onView={handleView} onRefresh={isAdmin ? fetchCatalogs : undefined}/>
          <ResourcesList
            type="Catalogo"
            fetchedData={catalogs}
            onDeleteAction={(key) => deleteAction('catalogs', key)}
            onDownload={handleDownload}
            onRefresh={fetchCatalogs}
          />
        }
        SkeletonLoader={<CatalogListSkeleton />}
      />
      <DeleteCatalogModal
        open={deleteModalOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        catalogName={catalogToDelete?.name}
      />
    </>
  );
}
