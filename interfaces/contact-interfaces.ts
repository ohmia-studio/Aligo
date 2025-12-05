export interface ContactForm {
  nombre: string;
  telefono: string;
  email: string;
}
export interface ContactError {
  nombre?: string | null;
  telefono?: string | null;
  email?: string | null;
  general?: string | null;
}
export interface Contact {
  id: string | number;
  nombre?: string;
  email?: string;
  telefono?: string;
}

export interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  items?: Item[];
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
}

export interface Item {
  id: string | number;
  title?: string;
  subtitle?: string;
}

export type TableProps = {
  contactos: Contact[];
  selected: Set<number | string>;
  toggle: (id: number | string) => void;
  allSelected: boolean;
  toggleSelectAll: () => void;
  onEdit?: (contact: Contact) => void;
};

export interface ContactValidationResult {
  isValid: boolean;
  errors?: string;
  validatedData?: any;
}
