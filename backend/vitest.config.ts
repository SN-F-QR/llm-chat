import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    env: {
      DB_URL: ':memory:',
      GOOGLE_API_KEY: 'test-google-api-key',
      JWT_SECRET: 'test-jwt-secret',
    },
  },
});
