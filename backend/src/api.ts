import { Hono } from 'hono';
import llmRouter from './api/llmRouter';
import userRouter from './api/userRouter';
import authRouter from './api/authRouter';
import chatRouter from './api/chatRouter';

import ConflictError from './error/ConflictError';
import NotFoundError from './error/NotFoundError';
import UnauthorizedError from './error/UnauthorizedError';
import { JwtTokenInvalid, JwtTokenExpired } from 'hono/utils/jwt/types';

const apiRouter = new Hono();

apiRouter.route('/llm', llmRouter);
apiRouter.route('/user', userRouter);
apiRouter.route('/auth', authRouter);
apiRouter.route('/chat', chatRouter);

apiRouter.onError((err, c) => {
  if (
    err instanceof ConflictError ||
    err instanceof NotFoundError ||
    err instanceof UnauthorizedError
  ) {
    c.status(err.statusCode);
    return c.text(err.message);
  } else if (err instanceof JwtTokenInvalid || err instanceof JwtTokenExpired) {
    c.status(401);
    return c.text('Invalid token');
  } else {
    console.error('Unknown error:', err.name, err.message);
    c.status(500);
    return c.text('Internal Server Error');
  }
});

export default apiRouter;
