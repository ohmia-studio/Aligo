import GenericPDFViewPage from '@/components/common/GenericPDFViewPage';
import { PDFViewPageProps as ManualViewPageProps } from '@/interfaces/documents-interfaces';
import { notFound } from 'next/navigation';

export default async function ManualViewPage({
  searchParams,
}: ManualViewPageProps) {
  const { key, name } = await searchParams;

  if (!key || !name) {
    notFound();
  }

  return <GenericPDFViewPage searchParams={searchParams} type="manuales" />;
}
