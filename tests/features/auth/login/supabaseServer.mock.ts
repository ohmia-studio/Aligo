// Mock de getSupabaseServer para tests
// util para los casos en los que se utiliza supabaseServer
export const getSupabaseServer = jest.fn(() => ({
  from: () => ({
    select: () => ({
      eq: () => ({
        maybeSingle: () =>
          Promise.resolve({
            data: {
              email: 'massimoparzanese@gmail.com',
              rol: 'admin',
              nombre: 'Massimo',
            },
            error: null,
          }),
      }),
    }),
  }),
  auth: {
    signInWithPassword: jest.fn(({ email, password }) => {
      if (email === 'massimoparzanese@gmail.com' && password === '12345678') {
        return Promise.resolve({
          data: {
            session: { access_token: 'token', refresh_token: 'refresh' },
          },
          error: null,
        });
      }
      return Promise.resolve({
        data: { session: null },
        error: { message: 'Credenciales incorrectas' },
      });
    }),
  },
}));
