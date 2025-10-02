// Mock generalizado de getSupabaseServer para tests de login, logout y userService
// Permite simular los distintos comportamientos según el uso

export const getSupabaseServer = jest.fn(() => ({
  from: () => ({
    select: () => ({
      eq: (_campo: any, valor: any) => ({
        maybeSingle: () => {
          // Caso para userService y login
          if (valor === 'massimoparzanese@gmail.com') {
            return Promise.resolve({
              data: {
                email: 'massimoparzanese@gmail.com',
                rol: 'admin',
                nombre: 'Massimo',
              },
              error: null,
            });
          }
          // Caso de usuario no encontrado
          return Promise.resolve({
            data: null,
            error: { message: 'No encontrado' },
          });
        },
      }),
    }),
  }),
  auth: {
    signInWithPassword: jest.fn(({ email, password }) => {
      // Caso login exitoso
      if (email === 'massimoparzanese@gmail.com' && password === '12345678') {
        return Promise.resolve({
          data: {
            session: { access_token: 'token', refresh_token: 'refresh' },
          },
          error: null,
        });
      }
      // Caso login fallido
      return Promise.resolve({
        data: { session: null },
        error: { message: 'Credenciales incorrectas' },
      });
    }),
    signOut: jest.fn(() =>
      Promise.resolve({
        error: null,
      })
    ),
  },
}));
