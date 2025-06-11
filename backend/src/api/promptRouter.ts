import { Hono } from 'hono';
import db from '../database';
import { eq, and } from 'drizzle-orm';
import { userTable, promptTable } from '../drizzle/schema';
import { authMiddleware, AuthMiddleEnv } from './authRouter';
import { nanoid } from 'nanoid';
import NotFoundError from '../error/NotFoundError';

const promptRouter = new Hono<AuthMiddleEnv>();
const nanoSize = 10;

promptRouter.use('*', authMiddleware);

promptRouter.get('/', async (c) => {
  const { id: userId } = c.get('user');
  const userWithPrompts = await db.query.userTable.findFirst({
    where: eq(userTable.id, userId),
    with: {
      prompts: {
        columns: {
          id: false,
          ownerId: false,
        },
      },
    },
  });

  const prompts = userWithPrompts!.prompts;
  c.status(200);
  return c.json({
    prompts: prompts,
  });
});

promptRouter.post('/', async (c) => {
  const { id: userId } = c.get('user');
  const { name, content, category }: { name: string; content: string; category: string } =
    await c.req.json();
  const publicId = nanoid(nanoSize);
  const insertedPrompt = await db
    .insert(promptTable)
    .values({
      publicId,
      name,
      content,
      ownerId: userId,
      category,
    })
    .returning();
  c.status(201);
  console.log('Inserted prompt:', insertedPrompt[0]);
  return c.json({
    prompt: {
      ...insertedPrompt[0],
      id: undefined,
      ownerId: undefined,
    },
  });
});

promptRouter.get('/:publicid', async (c) => {
  const publicId = c.req.param('publicid');
  const { id: userId } = c.get('user');
  const prompt = await db.query.promptTable.findFirst({
    where: and(eq(promptTable.publicId, publicId), eq(promptTable.ownerId, userId)),
  });
  if (!prompt) {
    throw new NotFoundError('Prompt not found');
  }
  c.status(200);
  return c.json({
    prompt: {
      ...prompt,
      id: undefined,
      ownerId: undefined,
    },
  });
});

promptRouter.delete('/:publicid', async (c) => {
  const publicId = c.req.param('publicid');
  const { id: userId } = c.get('user');
  const deleted = await db
    .delete(promptTable)
    .where(and(eq(promptTable.publicId, publicId), eq(promptTable.ownerId, userId)))
    .returning();
  if (deleted.length === 0) {
    throw new NotFoundError('Prompt not found');
  }
  console.log('Deleted prompt:', deleted[0]);
  c.status(204);
  return c.text('Prompt deleted successfully');
});

promptRouter.put('/:publicid', async (c) => {
  const publicId = c.req.param('publicid');
  const { id: userId } = c.get('user');
  const { name, content, category }: { name: string; content: string; category: string } =
    await c.req.json();
  const updated = await db
    .update(promptTable)
    .set({
      name,
      content,
      category,
    })
    .where(and(eq(promptTable.publicId, publicId), eq(promptTable.ownerId, userId)))
    .returning();
  if (updated.length === 0) {
    throw new NotFoundError('Prompt not found');
  }
  console.log('Updated prompt:', updated[0]);
  c.status(200);
  return c.json({
    prompt: {
      ...updated[0],
      id: undefined,
      ownerId: undefined,
    },
  });
});

export default promptRouter;
