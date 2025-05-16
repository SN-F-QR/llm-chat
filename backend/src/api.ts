import { Hono } from 'hono';
import llmRouter from './api/llmRouter';
import userRouter from './api/userRouter';
import ConflictError from './error/ConflictError';

const apiRouter = new Hono();

apiRouter.route('/llm', llmRouter);
apiRouter.route('/user', userRouter);

apiRouter.onError((err, c) => {
  if (err instanceof ConflictError) {
    c.status(err.statusCode);
    return c.text(err.message);
  } else {
    console.error('Unknown error:', err.name, err.message);
    c.status(500);
    return c.text('Internal Server Error');
  }
});

export default apiRouter;
