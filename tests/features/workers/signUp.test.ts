import { altaEmpleadoAction } from '@/features/employees/actions/signUp';

// Mock de supabaseAdmin usado por la acción
jest.mock('@/lib/supabase/supabaseAdmin', () => {
  const mockCreateUser = jest.fn(() =>
    Promise.resolve({
      data: { user: { id: 'auth-123' } },
      error: null,
    })
  );

  const mockInsert = jest.fn(() => Promise.resolve({ error: null }));

  const mockResend = jest.fn(() => Promise.resolve({ error: null }));

  return {
    supabaseAdmin: {
      auth: {
        admin: {
          createUser: mockCreateUser,
          deleteUser: jest.fn(() => Promise.resolve({ error: null })), // por si se prueba rollback
        },
        resend: mockResend,
      },
      from: jest.fn(() => ({
        insert: mockInsert,
      })),
    },
  };
});

describe('altaEmpleadoAction - tests simples', () => {
  it('retorna 200 y passwordTemporal cuando los datos son correctos', async () => {
    const formData = {
      get: (k: string) =>
        ({
          dni: '12345678',
          nombre: 'Juan',
          apellido: 'Perez',
          email: 'juan@example.com',
        } as Record<string, string>)[k],
    } as unknown as FormData;

    const result = await altaEmpleadoAction(formData);

    expect(result).toBeDefined();
    expect(result.status).toBe(200);
    expect(result.data).toBeDefined();
    expect(result.data?.passwordTemporal).toBeDefined();
  });

  it('retorna 400 cuando faltan campos obligatorios', async () => {
    const formData = {
      get: (_k: string) => '',
    } as unknown as FormData;

    const result = await altaEmpleadoAction(formData);

    expect(result).toBeDefined();
    expect(result.status).toBe(400);
    expect(result.message).toMatch(/Todos los campos/);
  });
});