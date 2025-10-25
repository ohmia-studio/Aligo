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
