jest.mock('@/lib/supabaseServer', () => require('./supabaseServer.mock'));
import { loginUser } from '@/features/auth/login';
import '@testing-library/jest-dom';
describe('loginUser - tests sobre la respuesta del backend', () => {
  it('debería retornar login exitoso', async () => {
    const response = await loginUser({
      email: 'massimoparzanese@gmail.com',
      password: '12345678',
    });
    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    expect(response.message).toBe('Login exitoso');
    expect(response.role).toBe('admin');
    expect(response.session_token).toBeDefined();
    expect(response.refresh_token).toBeDefined();
  });

  it('debería retornar credenciales incorrectas (password incorrecta)', async () => {
    const response = await loginUser({
      email: 'massimoparzanese@gmail.com',
      password: 'aaaaaa3',
    });
    expect(response).toBeDefined();
    expect(response.status).toBe(401);
    expect(response.message).toBe('Credenciales incorrectas');
    expect(response.role).toBeUndefined();
    expect(response.session_token).toBeUndefined();
    expect(response.refresh_token).toBeUndefined();
  });

  it('debería retornar credenciales incorrectas (usuario inexistente)', async () => {
    const response = await loginUser({
      email: 'massimo@gmail.com',
      password: '12345678',
    });
    expect(response).toBeDefined();
    expect(response.status).toBe(401);
    expect(response.message).toBe('Credenciales incorrectas');
    expect(response.role).toBeUndefined();
    expect(response.session_token).toBeUndefined();
    expect(response.refresh_token).toBeUndefined();
  });
});
