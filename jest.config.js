/*
module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
};
*/
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom', // jsdom para React, sirve también para lógica backend
  testMatch: ['**/tests/**/*.test.ts', '**/tests/**/*.test.tsx'], // todos tus tests
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest', // TS y TSX
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom'], // para matcher de RTL
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1', // para resolver imports con @/
  },
  globals: {
    'ts-jest': {
      isolatedModules: true, // más rápido para tests pequeños
    },
  },
};
