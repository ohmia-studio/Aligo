jest.mock('@/lib/supabaseServer', () => require('./supabaseServer.mock'));

import { getAllWorkers } from '@/features/workers/listWorkers';
import '@testing-library/jest-dom';

describe('getAllWorkers - tests sobre la respuesta del backend', () => {
  it('debería retornar la lista de empleados', async () => {
    const response = await getAllWorkers();
    expect(response).toBeDefined();
    expect(response.data).toBeDefined();
    expect(response.data.length).toBeGreaterThan(0);
    expect(response.status).toBe(200);
    expect(response.data[0].nombre).toBe('Juan');
    expect(response.data[0].rol).toBe('empleado');
    expect(response.data[1].nombre).toBe('Ana');
    expect(response.data[1].rol).toBe('empleado');
  });

  it('debería retornar una lista vacía si no hay empleados', async () => {
    const { mockEmpleadosVacio } = require('./supabaseServer.mock');
    const originalMock = require('./supabaseServer.mock').mockEmpleados;
    require('./supabaseServer.mock').mockEmpleados = mockEmpleadosVacio;

    const response = await getAllWorkers();
    expect(response).toBeDefined();
    expect(response.data.length).toBe(0);
    expect(response.status).toBe(200);
    expect(response.data).toEqual([]);

    // Restaurar el mock original
    require('./supabaseServer.mock').mockEmpleados = originalMock;
  });
});
