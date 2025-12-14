'use client';

import AddContactForm from '@/components/contactos/AddContactForm';
import ContactCardMobile from '@/components/contactos/contactCardMobile';
import ContactTableDesktop from '@/components/contactos/contactTableDesktop';
import { deleteContactsAction } from '@/features/contactos/deleteContacts';
import { useIsMobile } from '@/hooks/use-mobile';
import { Contact } from '@/interfaces/contact-interfaces';
import { Result } from '@/interfaces/server-response-interfaces';
import { AnimatePresence, motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Dialog } from '../common/alertDialog';
import BubbleInfo from '../news/bubbleInfo';
import ServerErrorPage from '../page/serverErrorPage';
import { AlertDialog, AlertDialogTrigger } from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';

export default function Contacts({ contacts }: { contacts: Result }) {
  const isMobile = useIsMobile();
  const router = useRouter();

  const [selected, setSelected] = useState<Set<number | string>>(new Set());
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [contactEdit, setContactEdit] = useState<Contact | undefined>(
    undefined
  );

  useEffect(() => {
    if (!isFormOpen && contactEdit !== undefined) setIsFormOpen(true);
    else if (isFormOpen && contactEdit === undefined) setIsFormOpen(false);
  }, [contactEdit]);

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

  const getDeleteTitle = () => {
    if (selected.size === 0) return 'Eliminar contactos';
    if (selected.size === 1) {
      const id = Array.from(selected)[0];
      const contact = contacts.data.find(
        (c: Contact) => String(c.id) === String(id)
      );
      return contact
        ? `Eliminar ${contact.nombre}`
        : 'Eliminar contacto seleccionado';
    }
    return `Eliminar ${selected.size} contactos`;
  };

  return contacts.status !== 200 ? (
    <ServerErrorPage errorCode={contacts.status} />
  ) : (
    <div className="flex flex-col items-center gap-8 pt-8">
      <header className="flex flex-row flex-wrap items-center gap-4">
        <h1 className="text-base-color text-2xl font-bold">
          Listado de contactos
        </h1>

        <div className="flex items-center gap-4">
          <Button
            onClick={() => setIsFormOpen(!isFormOpen)}
            variant="outline"
            type="button"
            className="hover:border-primary border-accent relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border transition-colors hover:cursor-pointer"
          >
            <motion.span
              key={isFormOpen ? 'minus' : 'plus'}
              initial={{ rotate: isFormOpen ? 90 : -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: isFormOpen ? -90 : 90, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-accent absolute text-2xl leading-none font-bold"
            >
              {isFormOpen ? '−' : '+'}
            </motion.span>
          </Button>

          {contactEdit && (
            <BubbleInfo
              content={`Editando: ${contactEdit.nombre}`}
              onClose={() => {
                setContactEdit(undefined);
              }}
            />
          )}

          <AlertDialog>
            <Dialog
              title={getDeleteTitle()}
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

      {/* Formulario animado */}
      <AnimatePresence initial={false}>
        {isFormOpen && (
          <motion.div
            key="contact-form"
            initial={{ opacity: 0, height: 'var(--scale-from,0)' }}
            animate={{ opacity: 1, height: 'var(--scale-to,1)' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="overflow-hidden [--scale-from:0] [--scale-to:auto]"
          >
            <AddContactForm
              contact={contactEdit}
              onSuccess={() => {
                setIsFormOpen(false);
                setContactEdit(undefined);
                router.refresh();
                toast.success(
                  contactEdit
                    ? 'Contacto actualizado con éxito'
                    : 'Contacto creado con éxito'
                );
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

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
              onEdit={() => setContactEdit(c)}
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
          onEdit={(contact) => setContactEdit(contact)}
        />
      )}
    </div>
  );
}
