export interface Catalog {
  id: string;
  name: string;
  fullKey: string;
  url: string;
  size: string;
  lastModified: string;
}

export interface CatalogListProps {
  catalogs: Catalog[];
  onDelete?: (catalogKey: string) => void | Promise<void>;
  onDownload: (catalog: Catalog) => void;
  onView?: (catalog: Catalog) => void;
  onRefresh?: () => Promise<void>;
}
export interface DeleteCatalogModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  catalogName?: string;
}
