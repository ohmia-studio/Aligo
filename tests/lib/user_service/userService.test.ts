jest.mock('@/lib/supabaseServer', () => require('./supabaseServer.mock'));

import { getUserByEmail } from '@/lib/userService';

describe('getUserByEmail', () => {
  it('debería retornar el usuario si existe', async () => {
    const user = await getUserByEmail('massimoparzanese@gmail.com');
    expect(user).toBeDefined();
    expect(user?.email).toBe('massimoparzanese@gmail.com');
    expect(user?.rol).toBe('admin');
    expect(user?.nombre).toBe('Massimo');
  });

  it('debería retornar null si el usuario no existe', async () => {
    const user = await getUserByEmail('otro@email.com');
    expect(user).toBeNull();
  });
});
