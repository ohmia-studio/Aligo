'use client';

import { deleteEmployeeAction } from '@/features/employees/actions/deleteEmployee';
import { useIsMobile } from '@/hooks/use-mobile';
import { Employee } from '@/interfaces/Employee-interfaces';
import { Result } from '@/interfaces/server-response-interfaces';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Dialog } from '../common/alertDialog';
import ServerErrorPage from '../page/serverErrorPage';
import { AlertDialog, AlertDialogTrigger } from '../ui/alert-dialog';
import { Spinner } from '../ui/spinner';
import EmployeeCardMobile from './EmployeeCardMobile';
import EmployeeTableDesktop from './EmployeeTableDesktop';

export default function Employees({ employees }: { employees: Result }) {
  const isMobile = useIsMobile();
  const router = useRouter();

  const [selected, setSelected] = useState<Set<number | string>>(new Set());
  //   const [selected, setSelected] = useState<Record<number, string>>();

  const [loadingDelete, setLoadingDelete] = useState(false);

  const toggle = (id: string | number) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const allSelected =
    employees.data.length > 0 && selected.size === employees.data.length;

  const toggleSelectAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(employees.data.map((e: Employee) => e.id)));
  };

  const performDelete = async () => {
    if (selected.size === 0) return;

    setLoadingDelete(true);

    try {
      const formData = new FormData();
      selected.forEach((id) => formData.append('selected', String(id)));
      await deleteEmployeeAction(formData);
      toast.success('Empleado eliminado con éxito');

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

  const selectedIds = [...selected];
  const employeeToDelete =
    selected.size === 1
      ? employees.data.find((e: Employee) => e.id === selectedIds[0])
      : null;

  return employees.status !== 200 ? (
    <ServerErrorPage errorCode={employees.status} />
  ) : (
    <div className="flex flex-col items-center gap-8 pt-8">
      <header className="flex flex-row flex-wrap items-center gap-4">
        <h1 className="text-base-color text-2xl font-bold">
          Listado de contactos
        </h1>

        <div className="flex gap-4">
          <button
            className="from-primary to-primary/90 hover:bg-primary hover:border-accent-foreground text-base-color-foreground rounded-full bg-gradient-to-r px-5 py-2 font-semibold shadow-md transition duration-150 hover:scale-105 hover:cursor-pointer hover:border-2"
            onClick={() => router.push('/dashboard/admin/empleados/alta')}
          >
            + Agregar empleado
          </button>

          <AlertDialog>
            <Dialog
              title={
                selected.size > 1
                  ? `Eliminar ${selected.size} empleados`
                  : `Eliminar ${employeeToDelete?.nombre} ${employeeToDelete?.apellido}`
              }
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

      {!employees.data.length ? (
        <p className="text-base-color/80">
          🤔 No hay empleados cargados aún...
        </p>
      ) : isMobile ? (
        <div className="space-y-4">
          {employees.data.map((e: Employee) => (
            <EmployeeCardMobile
              key={String(e.id)}
              employee={e}
              selected={selected.has(e.id)}
              onToggle={() => toggle(e.id)}
              onEdit={() =>
                window.location.assign(
                  `/dashboard/admin/empleados/${e.id}/editar`
                )
              }
            />
          ))}
        </div>
      ) : (
        <EmployeeTableDesktop
          employees={employees.data}
          selected={selected}
          toggle={toggle}
          allSelected={allSelected}
          toggleSelectAll={toggleSelectAll}
        />
      )}
    </div>
  );
}
