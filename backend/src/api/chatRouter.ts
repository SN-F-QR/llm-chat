import { Hono } from 'hono';
import { streamText } from 'hono/streaming';

import db from '../database';
import { eq, and, sql } from 'drizzle-orm';
import { chatTable, messageTable, Role, userTable } from '../drizzle/schema';
import { authMiddleware } from './authRouter';
import { nanoid } from 'nanoid';
import { zValidator } from '@hono/zod-validator';
import z from 'zod';

import { createHistory, generateTitle, generateContent } from '../utils/llmHelper';
import { FinishReason } from '@google/genai';

import NotFoundError from '../error/NotFoundError';

const chatRouter = new Hono();
const nanoSize = 21;

const chatSchema = z.object({
  content: z.string().min(1, 'Message content cannot be empty'),
  model: z.string(),
});

const messageSchema = z.object({
  content: z.string().min(1, 'Message content cannot be empty'),
});

const publicIdSchema = z.object({
  publicid: z.string().length(nanoSize, 'Public ID must be exactly 21 characters long'),
});

/**
 * Creates a new chat list
 * @route POST /chat
 * @param {string} content of first chat message
 * @param {string} model
 * @return a chat info object
 */
chatRouter.post('/', authMiddleware, zValidator('json', chatSchema), async (c) => {
  const { id: userId } = c.get('user');
  const { content, model }: { content: string; model: string } = await c.req.json();
  const title = await generateTitle(content);
  if (!title) {
    c.status(500);
    return c.text('Server Network Error, Please retry');
  }
  const publicId = nanoid(nanoSize);
  const newChat = await db
    .insert(chatTable)
    .values({
      title,
      publicId,
      model,
      ownerId: userId,
    })
    .returning();

  c.status(201);
  return c.json({
    ...newChat[0],
    id: undefined,
  });
});

chatRouter.get('/', authMiddleware, async (c) => {
  const { id } = c.get('user');
  const chatAndTag = await db.query.userTable.findFirst({
    where: eq(userTable.id, id),
    with: {
      chats: {
        columns: {
          ownerId: false,
          id: false,
        },
      },
      tags: {
        columns: {
          ownerId: false,
        },
      },
    },
  });

  if (!chatAndTag) {
    throw new NotFoundError('User not exist');
  }
  const { chats, tags } = chatAndTag;
  c.status(200);
  return c.json({
    chats: chats,
    // tags: tags,
  });
});

chatRouter.delete('/:publicid', zValidator('param', publicIdSchema), authMiddleware, async (c) => {
  const publicId = c.req.param('publicid');
  try {
    const targetChat = await db.query.chatTable.findFirst({
      where: eq(chatTable.publicId, publicId),
    });
    if (targetChat) {
      const chatId = targetChat.id;
      await db.delete(messageTable).where(eq(messageTable.chatId, chatId));
      await db.delete(chatTable).where(eq(chatTable.publicId, publicId));
    } else {
      throw new NotFoundError('Chat not exist');
    }
  } catch (error) {
    console.error('Error deleting chat:', error);
  }
  c.status(204);
  return c.text('Chat deleted successfully');
});

/**
 * Get messages of a chat
 * @route GET /chat/:publicid
 * @param {string} publicid - The public ID of the chat
 * @return {object} - The chat info and messages
 */
chatRouter.get('/:publicid', zValidator('param', publicIdSchema), authMiddleware, async (c) => {
  const publicId = c.req.param('publicid');
  const chat = await db.query.chatTable.findFirst({
    where: and(eq(chatTable.publicId, publicId), eq(chatTable.ownerId, c.get('user').id)),
    with: {
      messages: true,
    },
  });
  if (!chat) {
    throw new NotFoundError('Chat not exist');
  }
  const { messages, ...chatInfo } = chat;
  const returnMessages = messages.map((message) => {
    const { id, chatId, ...messageInfo } = message;
    return messageInfo;
  });
  c.status(200);
  return c.json({
    ...chatInfo,
    id: undefined,
    messages: returnMessages,
  });
});

/**
 * Post a message to a chat and stream llm response
 */
chatRouter.post(
  '/:publicid/message',
  zValidator('param', publicIdSchema),
  authMiddleware,
  zValidator('json', messageSchema),
  async (c) => {
    const { content } = c.req.valid('json');
    const chat = await db.query.chatTable.findFirst({
      where: eq(chatTable.publicId, c.req.param('publicid')),
      with: {
        messages: true,
      },
    });
    if (!chat) {
      throw new NotFoundError('Chat not exist');
    }

    const formattedMessages = createHistory(chat.messages, content);
    const response = await generateContent(formattedMessages, chat.model);

    await db.insert(messageTable).values({
      chatId: chat.id,
      content,
      role: Role.user,
    });

    c.status(201);
    let finalAnswer = '';
    return streamText(c, async (stream) => {
      for await (const chunk of response) {
        if (chunk.text) {
          await stream.write(chunk.text);
          finalAnswer += chunk.text;
        }
        if (chunk.candidates && chunk.candidates[0].finishReason === FinishReason.STOP) {
          console.log('Generation finished');
          await db.insert(messageTable).values({
            chatId: chat.id,
            content: finalAnswer,
            role: Role.assistant,
          });

          await db
            .update(chatTable)
            .set({ lastUseAt: sql`(unixepoch())` })
            .where(eq(chatTable.id, chat.id));
        }
      }
    });
  }
);

export default chatRouter;
