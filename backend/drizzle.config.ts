import { defineConfig } from 'drizzle-kit';
import path from 'path';

export default defineConfig({
  out: './src/drizzle',
  schema: './src/drizzle/schema.ts',
  dialect: 'sqlite',
  strict: true,
  verbose: true,
  dbCredentials: {
    url: path.resolve(__dirname, '../db.sqlite'),
  },
});
