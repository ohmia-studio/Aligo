'use client';

import ContactCardMobile from '@/components/contactos/contactCardMobile';
import ContactTableDesktop from '@/components/contactos/contactTableDesktop';
import { deleteContactsAction } from '@/features/contactos/deleteContacts';
import { useIsMobile } from '@/hooks/use-mobile';
import { Contact } from '@/interfaces/contact-interfaces';
import { Result } from '@/interfaces/server-response-interfaces';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Dialog } from '../common/alertDialog';
import ServerErrorPage from '../page/serverErrorPage';
import { AlertDialog, AlertDialogTrigger } from '../ui/alert-dialog';
import { Spinner } from '../ui/spinner';
import AddContactToggle from './AddContactToggle';

export default function Contacts({ contacts }: { contacts: Result }) {
  const isMobile = useIsMobile();
  const router = useRouter();

  const [selected, setSelected] = useState<Set<number | string>>(new Set());
  const [loadingDelete, setLoadingDelete] = useState(false);

  const toggle = (id: number | string) => {
    setSelected((prev) => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
  };

  const allSelected =
    contacts.data.length > 0 && selected.size === contacts.data.length;

  const toggleSelectAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(contacts.data.map((c: Contact) => c.id)));
  };

  const performDelete = async () => {
    if (selected.size === 0) return;

    setLoadingDelete(true);

    try {
      const formData = new FormData();
      selected.forEach((id) => formData.append('selected', String(id)));
      await deleteContactsAction(formData);
      toast.success('Contacto eliminado con éxito');

      setSelected((prev) => {
        const next = new Set(prev);
        selected.forEach((id) => next.delete(id));
        return next;
      });
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error('Error inesperado al eliminar');
    } finally {
      setLoadingDelete(false);
    }
  };

  return contacts.status !== 200 ? (
    <ServerErrorPage errorCode={contacts.status} />
  ) : (
    <div className="flex flex-col items-center gap-8 pt-8">
      <header className="flex flex-row flex-wrap items-center gap-4">
        <h1 className="text-base-color text-2xl font-bold">
          Listado de contactos
        </h1>

        <div className="flex gap-4">
          <AddContactToggle />

          <AlertDialog>
            <Dialog
              title={`Eliminar ${selected.size > 1 ? `${selected.size} contactos` : `${selected.keys()}`}`}
              description={`Esta acción no se puede deshacer.`}
              actionVerb="Borrar"
              onConfirm={performDelete}
            />
            <AlertDialogTrigger asChild>
              <button
                disabled={loadingDelete || selected.size === 0}
                className="text-base-color border-destructive enabled:bg-destructive/20 enabled:shadow-destructive flex items-center gap-2 rounded-full border-2 px-4 py-2 transition duration-150 enabled:shadow-xs enabled:hover:scale-105 enabled:hover:cursor-pointer disabled:opacity-50"
                aria-label="Eliminar seleccionados"
              >
                {loadingDelete ? (
                  <>
                    <Spinner className="text-base-color size-8" />
                    Eliminando...
                  </>
                ) : (
                  `Eliminar seleccionados (${selected.size})`
                )}
              </button>
            </AlertDialogTrigger>
          </AlertDialog>
        </div>
      </header>

      {!contacts.data.length ? (
        <p className="text-base-color/80">
          🤔 No hay contactos agendados aún...
        </p>
      ) : isMobile ? (
        <div className="space-y-4">
          {contacts.data.map((c: Contact) => (
            <ContactCardMobile
              key={String(c.id)}
              contact={c}
              selected={selected.has(c.id)}
              onToggle={() => toggle(c.id)}
              onEdit={() =>
                window.location.assign(
                  `/dashboard/admin/contactos/${c.id}/editar`
                )
              }
            />
          ))}
        </div>
      ) : (
        <ContactTableDesktop
          contactos={contacts.data}
          selected={selected}
          toggle={toggle}
          allSelected={allSelected}
          toggleSelectAll={toggleSelectAll}
        />
      )}
    </div>
  );
}
