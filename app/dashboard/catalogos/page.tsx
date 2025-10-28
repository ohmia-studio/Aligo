'use client';

import {
  PermissionGuard,
  usePermissions,
} from '@/components/auth/PermissionGuard';
import CatalogList from '@/components/catalogs/CatalogList';
import CatalogListSkeleton from '@/components/catalogs/CatalogListSkeleton';
import CatalogUploadForm from '@/components/catalogs/CatalogUploadForm';
import DeleteCatalogModal from '@/components/catalogs/DeleteCatalogModal';
import { deleteCatalog, listCatalogs } from '@/features/catalogs/catalogs';
import { Catalog } from '@/interfaces/catalogs-interfaces';
import { RootState } from '@/store/store';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

export default function CatalogosPage() {
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Hook para verificar permisos basado en rol
  const { isAdmin } = usePermissions();
  const [catalogToDelete, setCatalogToDelete] = useState<Catalog | null>(null);
  const user = useSelector((state: RootState) => state.auth.user);
  console.log('Usuario en Redux:', user);
  const fetchCatalogs = async () => {
    try {
      setIsLoading(true);
      const result = await listCatalogs();
      if (result.success) {
        setCatalogs(result.catalogs);
      } else {
        toast.error(result.error || 'Error al cargar los catálogos');
      }
    } catch (error) {
      toast.error('Error al cargar los catálogos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRequest = (catalogId: string) => {
    // Solo permitir eliminación a admins
    if (!isAdmin) return;

    const catalog = catalogs.find((c) => c.id === catalogId) || null;
    setCatalogToDelete(catalog);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!catalogToDelete) return;
    try {
      const result = await deleteCatalog(catalogToDelete.id);
      if (result.success) {
        toast.success(result.message || 'Catálogo eliminado correctamente');
        setCatalogs(catalogs.filter((c) => c.id !== catalogToDelete.id));
      } else {
        toast.error(result.error || 'Error al eliminar el catálogo');
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

  const handleDownload = (catalog: Catalog) => {
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

  const handleUploadSuccess = () => {
    fetchCatalogs();
  };

  useEffect(() => {
    fetchCatalogs();
  }, []);

  return (
    <>
      <header className="mb-8 flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-blue-500 sm:text-4xl">
          Gestión de Catálogos
        </h1>
        <p className="text-base text-gray-700 sm:text-lg">
          Sube y gestiona tus catálogos PDF de manera simple y segura
        </p>
      </header>
      <section
        className={`flex flex-col gap-8 rounded-xl bg-gray-50 p-4 shadow-sm ${isAdmin ? 'lg:flex-row lg:items-start' : ''}`}
      >
        {/* Formulario de upload - solo para admins */}
        <PermissionGuard requiredRoles={['admin']}>
          <article className="w-full lg:w-1/2">
            <CatalogUploadForm onUploadSuccess={handleUploadSuccess} />
          </article>
        </PermissionGuard>

        {/* Lista de catálogos */}
        <article className={`w-full ${isAdmin ? 'lg:w-1/2' : ''}`}>
          {isLoading ? (
            <CatalogListSkeleton />
          ) : (
            <CatalogList
              catalogs={catalogs}
              onDelete={isAdmin ? handleDeleteRequest : undefined}
              onDownload={handleDownload}
              onView={handleView}
              onRefresh={isAdmin ? fetchCatalogs : undefined}
            />
          )}
        </article>
      </section>
      <DeleteCatalogModal
        open={deleteModalOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        catalogName={catalogToDelete?.name}
      />
    </>
  );
}
