'use client';

import { TableProps } from '@/interfaces/contact-interfaces';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ContactTableDesktop({
  contactos,
  selected,
  toggle,
  allSelected,
  toggleSelectAll,
}: TableProps) {
  const router = useRouter();

  return (
    <div className="border-container-foreground bg-container max-w-fit overflow-x-auto rounded-lg shadow-md">
      <table className="text-base-color max-w-full text-sm">
        <thead className="from-primary/80 to-primary/60 bg-gradient-to-r">
          <tr>
            <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
                className="h-4 w-4"
                aria-label="Seleccionar todo"
              />
            </th>
            <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
              Nombre
            </th>
            <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
              Email
            </th>
            <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
              Teléfono
            </th>
            <th className="px-4 py-3 text-center font-semibold whitespace-nowrap">
              Editar
            </th>
          </tr>
        </thead>
        <tbody>
          {contactos.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-base">
                No hay contactos registrados.
              </td>
            </tr>
          ) : (
            contactos.map((c) => (
              <tr
                key={String(c.id)}
                className="hover:bg-accent/15 border-t transition-colors last:border-b"
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
                <td className="px-4 py-3 whitespace-nowrap">{c.nombre}</td>
                <td className="px-4 py-3 whitespace-nowrap">{c.email}</td>
                <td className="px-4 py-3 whitespace-nowrap">{c.telefono}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    className="hover:bg-primary text-base-color-foreground bg-primary/90 hover:border-accent-foreground border-primary/90 rounded-full border-2 p-2 shadow-md transition duration-150 hover:border-2"
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
  );
}
