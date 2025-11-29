import GenericPDFViewPage from '@/components/common/GenericPDFViewPage';
import { PDFViewPageProps as ManualViewPageProps } from '@/interfaces/documents-interfaces';

export default function ManualViewPage({ searchParams }: ManualViewPageProps) {
  return <GenericPDFViewPage searchParams={searchParams} type="manuales" />;
}
