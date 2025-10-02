// app/dashboard/actions.test.ts
import { logoutUser } from '@/features/auth/logout';

jest.mock('@/lib/supabaseServer', () => require('./supabaseServer.mock'));

describe('Acción de cierre de sesión', () => {
  it('debería cerrar sesión correctamente', async () => {
    const result = await logoutUser();

    expect(result).toEqual({
      status: 200,
      message: 'Sesión cerrada con éxito',
    });
  });
});
