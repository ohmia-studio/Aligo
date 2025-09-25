export const getSupabaseServer = jest.fn(() => ({
  from: () => ({
    select: () => ({
      eq: (_campo: string, valor: string) => ({
        maybeSingle: () => {
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
          return Promise.resolve({
            data: null,
            error: { message: 'No encontrado' },
          });
        },
      }),
    }),
  }),
}));
