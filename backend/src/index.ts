import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';

import db from './database';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import path from 'path';
import { customLogger } from './utils/logHelper';

import apiRouter from './api';

const app = new Hono();
const PORT: number = +(process.env.PORT ?? '3001');
const staticPath = './static';

app.use(logger(customLogger));
app.use('api', cors());
app.route('/api', apiRouter);

app.use('/static/*', serveStatic({ root: staticPath }));
app.use('*', serveStatic({ root: staticPath, index: 'index.html' }));

serve({
  fetch: app.fetch,
  port: PORT,
});

console.log(`migration folder: ${path.resolve(__dirname, './drizzle/')}`);
migrate(db, {
  migrationsFolder: path.resolve(__dirname, './drizzle/'),
});

export default app;
