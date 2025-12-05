import GenericPDFViewPage from '@/components/common/GenericPDFViewPage';
import { PDFViewPageProps } from '@/interfaces/documents-interfaces';

export default function PDFViewPage({ searchParams }: PDFViewPageProps) {
  return <GenericPDFViewPage searchParams={searchParams} type="catalogos" />;
}
