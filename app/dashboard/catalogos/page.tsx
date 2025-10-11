'use client';
import CatalogList from '@/components/catalogs/CatalogList';
import CatalogListSkeleton from '@/components/catalogs/CatalogListSkeleton';
import CatalogUploadForm from '@/components/catalogs/CatalogUploadForm';
import { deleteCatalog, listCatalogs } from '@/features/catalogs/catalogs';
import { Catalog } from '@/interfaces/catalogs-interfaces';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function CatalogosPage() {
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleDelete = async (catalogKey: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este catálogo?')) {
      return;
    }

    try {
      const result = await deleteCatalog(catalogKey);
      if (result.success) {
        toast.success(result.message || 'Catálogo eliminado correctamente');
        // Actualizar la lista sin hacer fetch completo
        setCatalogs(catalogs.filter((c) => c.id !== catalogKey));
      } else {
        toast.error(result.error || 'Error al eliminar el catálogo');
      }
    } catch (error) {
      toast.error('Error al eliminar el catálogo');
      console.error(error);
    }
  };

  const handleDownload = (catalog: Catalog) => {
    // Construir URL de la API que servirá el archivo
    const url = `/api/catalogos?key=${encodeURIComponent(
      catalog.fullKey
    )}&name=${encodeURIComponent(catalog.name)}`;

    // Crear enlace temporal invisible para disparar la descarga
    const a = document.createElement('a');
    a.href = url; // Apunta a nuestra API
    a.download = catalog.name; // Sugiere nombre para el archivo descargado

    // Agregar temporalmente al DOM (requerido por algunos navegadores)
    document.body.appendChild(a);

    // Simular click → esto dispara la navegación/descarga a la URL
    a.click();

    // Limpiar el enlace temporal
    document.body.removeChild(a);

    toast.success(`Descargando: ${catalog.name}`);
  };

  const handleUploadSuccess = () => {
    fetchCatalogs();
  };

  useEffect(() => {
    fetchCatalogs();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-blue-500">
          Gestión de Catálogos
        </h1>
        <p className="text-gray-600">Sube y gestiona tus catálogos PDF</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Formulario de subida */}
        <div>
          <CatalogUploadForm onUploadSuccess={handleUploadSuccess} />
        </div>

        {/* Lista de catálogos */}
        <div>
          {isLoading ? (
            <CatalogListSkeleton />
          ) : (
            <CatalogList
              catalogs={catalogs}
              onDelete={handleDelete}
              onDownload={handleDownload}
              onRefresh={fetchCatalogs}
            />
          )}
        </div>
      </div>
    </div>
  );
}
