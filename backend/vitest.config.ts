import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ['src/test/main.test.ts'],
    environment: 'node',
    env: {
      DB_URL: ':memory:',
    },
  },
});
