'use client';

import { useState } from 'react';
import { PermissionGuard, usePermissions } from '../auth/PermissionGuard';

interface ManagerTemplateProps {
  headerTitle: String;
  headerDescription: String;
  UploaderComponent: React.ReactNode;
  ListComponent: React.ReactNode;
  SkeletonLoader: React.ReactNode;
}

// Salvo que el fetch lo haga desde afuera y le pase los datos por parametros
export const AdminManagerPageTemplate: React.FC<ManagerTemplateProps> = ({
  headerTitle,
  headerDescription,
  UploaderComponent,
  ListComponent,
  SkeletonLoader,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isAdmin } = usePermissions();
  return (
    <>
      <header className="mb-8 flex flex-col items-center gap-2 text-center">
        <h1 className="text-primary text-3xl font-semibold tracking-tight sm:text-4xl">
          {headerTitle}
        </h1>
        <p className="text-base-color text-base sm:text-lg">
          {headerDescription}
        </p>
      </header>

      <section className="bg-container flex flex-col gap-8 rounded-xl p-4 shadow-sm lg:flex-row lg:items-start">
        <PermissionGuard requiredRoles={['admin']}>
          <article className="w-full lg:w-1/2">
            {/* <ManualUploadForm onUploadSuccess={handleUploadSuccess} /> */}
            {/* <CatalogUploadForm onUploadSuccess={handleUploadSuccess} /> */}
            {UploaderComponent}
          </article>
        </PermissionGuard>

        {/* "w-full lg:w-1/2"  */}
        <article className={`w-full ${isAdmin ? 'lg:w-1/2' : ''}`}>
          {isLoading
            ? SkeletonLoader
            : // <CatalogList
              //   catalogs={catalogs}
              //   onDelete={isAdmin ? handleDeleteRequest : undefined}
              //   onDownload={handleDownload}
              //   onView={handleView}
              //   onRefresh={isAdmin ? fetchCatalogs : undefined}
              // />
              //  <ManualList
              //       manuals={manuals}
              //       onRefresh={fetchManuals}
              //       onDownload={handleDownload}
              //     />
              ListComponent}
        </article>
      </section>
      {/* <DeleteCatalogModal
        open={deleteModalOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        catalogName={catalogToDelete?.name}
      /> */}
    </>
  );
};
