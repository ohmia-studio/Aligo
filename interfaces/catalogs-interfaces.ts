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
  onDelete: (catalogKey: string) => Promise<void>;
  onDownload: (catalog: Catalog) => void;
  onRefresh: () => Promise<void>;
}
