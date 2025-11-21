import Employees from '@/components/employees/employees';
import { EmployeesTableSkeleton } from '@/components/employees/EmployeesTableSkeleton';
import { getAllWorkers } from '@/features/employees/actions/listWorkers';
import { Suspense } from 'react';

export default async function EmployeesPage() {
  const resultEmplloyees = await getAllWorkers();

  return (
    <Suspense fallback={<EmployeesTableSkeleton />}>
      <Employees employees={resultEmplloyees} />
    </Suspense>
  );
}
