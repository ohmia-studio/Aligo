'use client';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { deleteContactsAction } from '@/features/contactos/deleteContacts';
import { useIsMobile } from '@/hooks/use-mobile';
import { Contact } from '@/interfaces/contact-interfaces';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import ContactTable from '../common/contactTable';

export function ContactList({ contactos }: { contactos: Contact[] }) {
  const [selected, setSelected] = useState<Set<string | number>>(new Set());
  const [loadingId, setLoadingId] = useState<string | number | null>(null);
  const [loadingBulk, setLoadingBulk] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteIds, setToDeleteIds] = useState<Array<string | number>>([]);
  const router = useRouter();

  const toggle = (id: string | number) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const allSelected =
    contactos.length > 0 && selected.size === contactos.length;
  const toggleSelectAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(contactos.map((c) => c.id)));
  };

  const openConfirmFor = (ids: Array<string | number>) => {
    setToDeleteIds(ids);
    setConfirmOpen(true);
  };

  const handleSingleDelete = (id: string | number) => openConfirmFor([id]);

  const handleBulkDelete = () => {
    if (selected.size === 0) {
      toast.error('Seleccioná al menos un contacto');
      return;
    }
    openConfirmFor(Array.from(selected));
  };

  const performDelete = async () => {
    if (toDeleteIds.length === 0) return;
    const isSingle = toDeleteIds.length === 1;
    if (isSingle) setLoadingId(toDeleteIds[0]);
    else setLoadingBulk(true);

    try {
      const formData = new FormData();
      toDeleteIds.forEach((id) => formData.append('selected', String(id)));

      const res = await deleteContactsAction(formData);
      toast[res.status === 200 ? 'success' : 'error'](
        res.message || 'Resultado desconocido'
      );

      setSelected((prev) => {
        const next = new Set(prev);
        toDeleteIds.forEach((id) => next.delete(id));
        return next;
      });
      router.refresh();
      setConfirmOpen(false);
      setToDeleteIds([]);
    } catch (err) {
      console.error(err);
      toast.error('Error inesperado al eliminar');
    } finally {
      if (isSingle) setLoadingId(null);
      else setLoadingBulk(false);
    }
  };

  const isMobile = useIsMobile();

  return isMobile ? (
    <ContactTable />
  ) : (
    <section className="w-full md:max-w-4xl">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <button
            className="rounded bg-gray-100 px-3 py-1 text-sm text-black"
            onClick={toggleSelectAll}
          >
            {allSelected ? 'Deseleccionar todo' : 'Seleccionar todo'}
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleBulkDelete}
            disabled={loadingBulk || selected.size === 0}
            className="flex items-center gap-2 rounded bg-red-600 px-4 py-2 text-white disabled:opacity-50"
            aria-label="Eliminar seleccionados"
          >
            {loadingBulk ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Eliminando...
              </>
            ) : (
              `Eliminar seleccionados (${selected.size})`
            )}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-md">
        <table className="min-w-full text-sm text-black">
          <thead className="bg-gradient-to-r from-green-400 to-green-300">
            <tr>
              <th className="px-4 py-3 text-left font-semibold whitespace-nowrap text-black">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  className="h-4 w-4"
                  aria-label="Seleccionar todo"
                />
              </th>
              <th className="px-4 py-3 text-left font-semibold whitespace-nowrap text-black">
                Nombre
              </th>
              {/* Apellido removed - contacts only have nombre, telefono, email */}
              <th className="px-4 py-3 text-left font-semibold whitespace-nowrap text-black">
                Email
              </th>
              <th className="px-4 py-3 text-left font-semibold whitespace-nowrap text-black">
                Teléfono
              </th>
              <th className="px-4 py-3 text-center font-semibold whitespace-nowrap text-black">
                Editar
              </th>
            </tr>
          </thead>
          <tbody className="text-black">
            {contactos.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-base text-gray-400"
                >
                  No hay contactos registrados.
                </td>
              </tr>
            ) : (
              contactos.map((c) => (
                <tr
                  key={String(c.id)}
                  className="border-t text-black transition-colors last:border-b hover:bg-green-50"
                >
                  <td className="px-4 py-3 whitespace-nowrap text-black">
                    <input
                      type="checkbox"
                      checked={selected.has(c.id)}
                      onChange={() => toggle(c.id)}
                      className="h-4 w-4"
                      aria-label={`Seleccionar contacto ${c.nombre || ''}`}
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-black">
                    {c.nombre}
                  </td>
                  {/* apellido not available */}
                  <td className="px-4 py-3 whitespace-nowrap text-black">
                    {c.email}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-black">
                    {c.telefono}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      className="rounded-full bg-blue-500 p-2 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                      onClick={() =>
                        router.push(`/dashboard/admin/contactos/${c.id}/editar`)
                      }
                      aria-label={`Editar contacto ${c.nombre || ''}`}
                    >
                      <Pencil size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={confirmOpen}
        onOpenChange={(open) => {
          if (!open) setToDeleteIds([]);
          setConfirmOpen(open);
        }}
        title="Confirmar baja"
        description={`Vas a eliminar ${toDeleteIds.length} contacto${toDeleteIds.length > 1 ? 's' : ''}. Esta acción no se puede deshacer.`}
        items={toDeleteIds.map((id) => {
          const e = contactos.find((x) => x.id === id);
          return { id, title: e?.nombre, subtitle: e?.email || e?.telefono };
        })}
        confirmLabel={
          toDeleteIds.length > 1
            ? 'Eliminar seleccionados'
            : 'Eliminar contacto'
        }
        onConfirm={performDelete}
        loading={loadingBulk}
      />
    </section>
  );
}
