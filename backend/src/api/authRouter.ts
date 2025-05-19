import { Hono } from 'hono';
import { createMiddleware } from 'hono/factory';
import db from '../database';
import { eq } from 'drizzle-orm';
import { userTable, User } from '../drizzle/schema';

import { jwtOptions } from '../config';
import z from 'zod';
import { sign, verify } from 'hono/jwt';
import { zValidator } from '@hono/zod-validator';
import bcrypt from 'bcryptjs';
import NotFoundError from '../error/NotFoundError';
import UnauthorizedError from '../error/UnauthorizedError';

const authRouter = new Hono();

const loginSchema = z.object({
  stuNum: z.string().length(8),
  password: z.string().min(8),
});

authRouter.post('/login', zValidator('json', loginSchema), async (c) => {
  const { stuNum, password } = c.req.valid('json');
  const existingUser = await db.query.userTable.findFirst({
    where: eq(userTable.stuNum, stuNum),
  });
  if (!existingUser) {
    throw new NotFoundError('User not exists');
  }
  const isPasswordValid = await bcrypt.compare(password, existingUser.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid password');
  }
  const token = await sign(
    {
      id: existingUser.id,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + jwtOptions.expTime,
    },
    jwtOptions.secret,
    jwtOptions.alg
  );

  c.status(200);
  return c.json({
    info: 'Login successful',
    token: token,
  });
});

export const authMiddleware = createMiddleware<{
  Variables: { user: Omit<User, 'password'> };
}>(async (c, next) => {
  const token = c.req.header('Authorization')?.split(' ')[1];
  if (!token) {
    throw new UnauthorizedError('No token provided');
  }
  const decoded = await verify(token, jwtOptions.secret, jwtOptions.alg);
  console.log('Decoded token:', decoded);
  if (!decoded?.iat || !decoded?.id) {
    throw new UnauthorizedError('Invalid token');
  }
  const existingUser = await db.query.userTable.findFirst({
    where: eq(userTable.id, decoded.id as number),
  });
  if (!existingUser || existingUser.lastRevokedTime > decoded.iat) {
    console.log('Last revoked time:', existingUser?.lastRevokedTime, 'Decoded iat:', decoded.iat);
    throw new UnauthorizedError('Revoked token');
  }
  // populate the context with user info
  c.set('user', existingUser);
  await next();
});

authRouter.use('/verify', authMiddleware);

authRouter.get('/verify', (c) => {
  return c.text('Verify endpoint');
});

authRouter.get('/logout', authMiddleware, async (c) => {
  const { stuNum } = c.get('user');
  await db
    .update(userTable)
    .set({ lastRevokedTime: Math.floor(Date.now() / 1000) })
    .where(eq(userTable.stuNum, stuNum));
  c.status(200);
  return c.text('Logout successful');
});

export default authRouter;
