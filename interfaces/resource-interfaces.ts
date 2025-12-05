export interface Resource {
  name: string;
  fullKey: string;
  url: string;
  size: string;
  lastModified: string | null;
}
export interface Catalog extends Resource {
  id: string;
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
