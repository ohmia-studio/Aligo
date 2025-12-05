export interface PDFViewPageProps {
  searchParams: Promise<{
    key?: string;
    name?: string;
    resource?: string;
  }>;
}

export interface GenericPDFViewPageProps {
  searchParams: Promise<{
    key?: string;
    name?: string;
    resource?: string;
  }>;
  type: 'catalogos' | 'manuales';
}

export interface BrowserPDFViewerProps {
  pdfUrl: string;
  catalogName: string;
  downloadUrl?: string;
  backUrl?: string;
  backLabel?: string;
  homeUrl?: string;
}
