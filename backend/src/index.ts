import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';

import apiRouter from './api';

const app = new Hono();
const PORT: number = +(process.env.PORT ?? '3001');
const staticPath = '../frontend/dist';

app.route('/api', apiRouter);

app.use('/static/*', serveStatic({ root: staticPath }));
app.use('*', serveStatic({ root: staticPath, index: 'index.html' }));

serve({
  fetch: app.fetch,
  port: PORT,
});
