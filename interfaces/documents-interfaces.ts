export interface PDFViewPageProps {
  searchParams: Promise<{
    key?: string;
    name?: string;
  }>;
}

export interface GenericPDFViewPageProps {
  searchParams: Promise<{
    key?: string;
    name?: string;
  }>;
  type: 'catalogos' | 'manuales';
}
