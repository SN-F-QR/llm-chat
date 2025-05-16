import { Hono } from 'hono';
import db from '../database';
import { eq } from 'drizzle-orm';
import { userTable } from '../drizzle/schema';

import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { sign } from 'hono/jwt';
import ConflictError from '../error/ConflictError';

const userRouter = new Hono();
const saltRounds = 11;

dotenv.config();
const { JWT_SECRET } = process.env;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}

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
    .values({ name, password: hashedPassword, stuNum, department, lastRevokedTime: Date.now() })
    .returning();
  const token = await sign(
    {
      id: newUser[0].id,
      iat: Date.now(),
      exp: Math.floor(Date.now() / 1000) + 31 * 24 * 60 * 60,
    },
    JWT_SECRET,
    'HS256'
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
