import GenericPDFViewPage from '@/components/common/GenericPDFViewPage';

interface PDFViewPageProps {
  searchParams: Promise<{
    key?: string;
    name?: string;
  }>;
}

export default function PDFViewPage({ searchParams }: PDFViewPageProps) {
  return <GenericPDFViewPage searchParams={searchParams} type="catalogos" />;
}
