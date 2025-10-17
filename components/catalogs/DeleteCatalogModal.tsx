'use client';
import { DeleteCatalogModalProps } from '@/interfaces/catalogs-interfaces';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@radix-ui/react-dialog';

export default function DeleteCatalogModal({
  open,
  onConfirm,
  onCancel,
  catalogName,
}: DeleteCatalogModalProps) {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onCancel()}>
      {/* Backdrop solo si el modal está abierto */}
      {open && (
        <div
          className="fixed inset-0 z-[9998] bg-black/40"
          aria-hidden="true"
        ></div>
      )}
      <DialogContent className="fixed top-1/2 left-1/2 z-[9999] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-2xl">
        <DialogTitle className="mb-2 text-lg font-bold text-red-600">
          ¿Eliminar catálogo?
        </DialogTitle>
        <DialogDescription className="mb-4 text-gray-700">
          {catalogName ? (
            <span>
              ¿Estás seguro de que deseas eliminar <b>{catalogName}</b>?<br />
            </span>
          ) : null}
          Esta acción <b>no se puede deshacer</b> y el archivo será eliminado
          permanentemente.
        </DialogDescription>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="cursor-pointer rounded bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
            type="button"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="cursor-pointer rounded bg-red-600 px-4 py-2 font-semibold text-white shadow hover:bg-red-700 focus:ring-2 focus:ring-red-400 focus:outline-none"
            type="button"
          >
            Eliminar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
