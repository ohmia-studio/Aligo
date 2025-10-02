// Mock de getSupabaseServer para tests de workers
export const getSupabaseServer = jest.fn(() => ({
  from: () => ({
    select: () => ({
      eq: (_campo: string, valor: string) => ({
        // Puedes ignorar los filtros para el mock básico
        maybeSingle: () => Promise.resolve({ data: null, error: null }),
        // Para obtener todos los empleados
        // .select().eq().then()
        then: (cb: (result: { data: any; error: any }) => any) =>
          cb({ data: mockEmpleados, error: null }),
      }),
      // Para obtener todos los empleados sin filtro
      then: (cb: (result: { data: any; error: any }) => any) =>
        cb({ data: mockEmpleados, error: null }),
    }),
  }),
}));

// Mock de empleados vacío
export const mockEmpleadosVacio = [];
// Mock de empleados con datos
export const mockEmpleados = [
  { id: 1, nombre: 'Juan', rol: 'empleado' },
  { id: 2, nombre: 'Ana', rol: 'empleado' },
];
