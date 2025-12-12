export interface Employee {
  id: string | number;
  dni: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string; 
}

export interface TableProps {
  employees: Employee[];
  selected: Set<number | string>;
  toggle: (id: number | string) => void;
  allSelected: boolean;
  toggleSelectAll: () => void;
}
