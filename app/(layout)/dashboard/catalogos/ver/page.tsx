import GenericPDFViewPage from '@/components/common/GenericPDFViewPage';
import { PDFViewPageProps } from '@/interfaces/documents-interfaces';
import { notFound } from 'next/navigation';

export default async function PDFViewPage({ searchParams }: PDFViewPageProps) {
  const { key, name } = await searchParams;

  if (!key || !name) {
    notFound();
  }

  return <GenericPDFViewPage searchParams={searchParams} type="catalogos" />;
}
