'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ConfirmModalProps } from '@/interfaces/contact-interfaces';

export default function ConfirmModal({
  open,
  onOpenChange,
  title = 'Confirmar',
  description,
  items = [],
  confirmLabel = 'Eliminar',
  cancelLabel = 'Cancelar',
  onConfirm,
  loading = false,
}: ConfirmModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white text-black">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>

        {items.length > 0 && (
          <div className="mb-4 max-h-40 overflow-auto rounded border bg-gray-50 p-3">
            <ul className="text-sm text-gray-800">
              {items.map((it) => (
                <li key={String(it.id)} className="py-1">
                  <strong>{it.title || '\u2014'}</strong>
                  {it.subtitle && (
                    <span className="ml-2 text-gray-500">({it.subtitle})</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm()}
            className="bg-red-600 text-white"
          >
            {loading ? 'Eliminando...' : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
