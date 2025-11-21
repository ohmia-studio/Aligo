'use client';
import { Contact } from '@/interfaces/contact-interfaces';
import { ChevronDown, Pencil } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

type Props = {
  contact: Contact;
  selected: boolean;
  onToggle: () => void; // checkbox toggle
  onEdit: () => void;
};

export default function ContactCardMobile({
  contact,
  selected,
  onToggle,
  onEdit,
}: Props) {
  const [open, setOpen] = useState(false); // collapsed by default

  return (
    <div className="bg-container border-container-foreground overflow-hidden rounded-lg border shadow-sm">
      <div
        className="flex items-center justify-between px-4 py-3"
        onClick={() => setOpen((s) => !s)}
      >
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggle}
            className="h-4 w-4"
            aria-label={`Seleccionar contacto ${contact.nombre}`}
          />
          <div className="text-sm font-semibold">{contact.nombre}</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            aria-label={`Editar ${contact.nombre}`}
            className="rounded p-2 hover:bg-gray-100"
          >
            <Pencil size={16} />
          </button>
          <motion.button
            animate={{ rotate: open ? 0 : 180, opacity: 1 }}
            aria-expanded={open}
            className="z-50 rounded p-2 hover:bg-gray-100"
            aria-label={`${open ? 'Cerrar' : 'Abrir'} detalles de ${contact.nombre}`}
          >
            <ChevronDown />
          </motion.button>
        </div>
      </div>

      <div
        className={`px-4 pb-4 transition-[max-height,opacity] duration-200 ease-in-out ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="pt-2">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div className="text-base-color/70 text-xs">Email</div>
            <div className="text-accent truncate">{contact.email || '-'}</div>

            <div className="text-base-color/70 text-xs">Teléfono</div>
            <div className="text-accent truncate">
              {contact.telefono || '-'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
