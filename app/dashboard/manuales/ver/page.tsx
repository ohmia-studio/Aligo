import GenericPDFViewPage from '@/components/common/GenericPDFViewPage';

interface ManualViewPageProps {
  searchParams: Promise<{
    key?: string;
    name?: string;
  }>;
}

export default function ManualViewPage({ searchParams }: ManualViewPageProps) {
  return <GenericPDFViewPage searchParams={searchParams} type="manuales" />;
}
