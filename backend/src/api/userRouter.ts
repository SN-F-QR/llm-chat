import { Hono } from 'hono';
import db from '../database';
import { eq } from 'drizzle-orm';
import { userTable } from '../drizzle/schema';

import { jwtOptions, saltRounds } from '../config';
import bcrypt from 'bcryptjs';
import { sign } from 'hono/jwt';
import ConflictError from '../error/ConflictError';

const userRouter = new Hono();

userRouter.post('/', async (c) => {
  const {
    name,
    password,
    stuNum,
    department,
  }: { name: string; email: string; password: string; stuNum: string; department: string } =
    await c.req.json();
  const existingUser = await db.query.userTable.findFirst({
    where: eq(userTable.stuNum, stuNum),
  });
  if (existingUser) {
    throw new ConflictError('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const newUser = await db
    .insert(userTable)
    .values({
      name,
      password: hashedPassword,
      stuNum,
      department,
      lastRevokedTime: Math.floor(Date.now() / 1000),
    })
    .returning();
  const token = await sign(
    {
      id: newUser[0].id,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + jwtOptions.expTime,
    },
    jwtOptions.secret,
    jwtOptions.alg
  );

  const returnUser = { ...newUser[0], password: undefined, lastRevokedTime: undefined };
  c.status(201);
  return c.json({
    info: {
      ...returnUser,
    },
    token: token,
  });
});

export default userRouter;
