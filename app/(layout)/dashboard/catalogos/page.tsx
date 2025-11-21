'use client';

import { usePermissions } from '@/components/auth/PermissionGuard';
import CatalogListSkeleton from '@/components/catalogs/CatalogListSkeleton';
import DeleteCatalogModal from '@/components/catalogs/DeleteCatalogModal';
import { AdminManagerPageTemplate } from '@/components/page/adminManagerPageTemplate';
import ResourcesList from '@/components/page/resourcesList';
import ResourcesUploadForm from '@/components/page/resourcesUploadForm';
import {
  deleteCatalog,
  listCatalogs,
  uploadCatalogAction,
} from '@/features/catalogs/catalogs';
import { Catalog, Resource } from '@/interfaces/resource-interfaces';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function CatalogosPage() {
  const [catalogs, setCatalogs] = useState<Resource[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Hook para verificar permisos basado en rol
  const { isAdmin } = usePermissions();
  const [catalogToDelete, setCatalogToDelete] = useState<Resource | null>(null);

  const fetchCatalogs = async () => {
    try {
      const result = await listCatalogs();
      if (result.success) {
        setCatalogs(result.catalogs);
      } else {
        toast.error(result.error || 'Error al cargar los catálogos');
      }
    } catch (error) {
      toast.error('Error al cargar los catálogos');
    }
  };

  const handleDeleteRequest = (catalogKey: string) => {
    // Solo permitir eliminación a admins
    if (!isAdmin) return;

    const catalog = catalogs.find((c) => c.fullKey === catalogKey) || null;
    setCatalogToDelete(catalog);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!catalogToDelete) return;
    try {
      const result = await deleteCatalog(catalogToDelete.fullKey);
      if (result.status) {
        toast.success(result.message || 'Catálogo eliminado correctamente');
        setCatalogs(
          catalogs.filter((c) => c.fullKey !== catalogToDelete.fullKey)
        );
      } else {
        toast.error(result.message || 'Error al eliminar el catálogo');
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
    const url = `/api/catalogos?key=${encodeURIComponent(
      catalog.fullKey
    )}&name=${encodeURIComponent(catalog.name)}`;
    const a = document.createElement('a');
    a.href = url;
    a.download = catalog.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success(`Descargando: ${catalog.name}`);
  };

  const handleView = (catalog: Catalog) => {
    window.open(
      `/dashboard/catalogos/ver?key=${encodeURIComponent(catalog.fullKey)}&name=${encodeURIComponent(catalog.name)}`,
      '_blank'
    );
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
            onUploadAction={uploadCatalogAction}
          />
        }
        ListComponent={
          // <CatalogList catalogs={catalogs} onDelete={isAdmin ? handleDeleteRequest : undefined} onDownload={handleDownload} onView={handleView} onRefresh={isAdmin ? fetchCatalogs : undefined}/>
          <ResourcesList
            type="Catalogo"
            fetchedData={catalogs}
            onDeleteAction={deleteCatalog}
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
