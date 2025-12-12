'use client';

import { deleteEmployeeAction } from '@/features/employees/actions/deleteEmployee';
import { useIsMobile } from '@/hooks/use-mobile';
import { Employee } from '@/interfaces/Employee-interfaces';
import { Result } from '@/interfaces/server-response-interfaces';
import { AnimatePresence, motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Dialog } from '../common/alertDialog';
import ServerErrorPage from '../page/serverErrorPage';
import { AlertDialog, AlertDialogTrigger } from '../ui/alert-dialog';
import { Spinner } from '../ui/spinner';
import EmployeeCardMobile from './EmployeeCardMobile';
import EmployeeForm from './EmployeeForm';
import EmployeeTableDesktop from './EmployeeTableDesktop';

export default function Employees({ employees }: { employees: Result }) {
  const isMobile = useIsMobile();
  const router = useRouter();

  const [selected, setSelected] = useState<Set<number | string>>(new Set());
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [employeeEdit, setEmployeeEdit] = useState<Employee | undefined>(
    undefined
  );

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

  const handleAddClick = () => {
    setEmployeeEdit(undefined);
    setIsFormOpen((prev) => !prev);
  };

  const handleEdit = (emp: Employee) => {
    setEmployeeEdit(emp);
    setIsFormOpen(true);
  };

  useEffect(() => {
    if (employeeEdit) setIsFormOpen(true);
  }, [employeeEdit]);

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
          Listado de empleados
        </h1>

        <div className="flex gap-4">
          <button
            className="from-primary to-primary/90 hover:bg-primary hover:border-accent-foreground text-base-color-foreground rounded-full bg-gradient-to-r px-5 py-2 font-semibold shadow-md transition duration-150 hover:scale-105 hover:cursor-pointer hover:border-2"
            onClick={handleAddClick}
          >
            {isFormOpen && !employeeEdit
              ? '− Cerrar formulario'
              : '+ Agregar empleado'}
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

      {/* Formulario animado (igual que Contacts) */}
      <AnimatePresence initial={false}>
        {isFormOpen && (
          <motion.div
            key="employee-form"
            initial={{ opacity: 0, height: 'var(--scale-from,0)' }}
            animate={{ opacity: 1, height: 'var(--scale-to,1)' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="overflow-hidden [--scale-from:0] [--scale-to:auto]"
          >
            <EmployeeForm
              employee={employeeEdit}
              onCancel={() => {
                setIsFormOpen(false);
                setEmployeeEdit(undefined);
              }}
              onSuccess={() => {
                setIsFormOpen(false);
                setEmployeeEdit(undefined);
                router.refresh();
                toast.success(
                  employeeEdit ? 'Empleado actualizado' : 'Empleado creado'
                );
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

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
              onEdit={() => handleEdit(e)}
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
          onEdit={(emp) => handleEdit(emp)}
        />
      )}
    </div>
  );
}
