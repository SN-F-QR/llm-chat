import { Hono } from 'hono';
import db from '../database';
import { chatTable } from '../drizzle/schema';
import { authMiddleware } from './authRouter';
import { nanoid } from 'nanoid';

import { GoogleGenAI } from '@google/genai';
import { googleApiKey } from '../config';

const chatRouter = new Hono();
const llm = new GoogleGenAI({ apiKey: googleApiKey });

const generateTitle = async (content: string) => {
  try {
    const response = await llm.models.generateContent({
      model: 'gemini-2.5-flash-preview-05-20',
      contents: content,
      config: {
        temperature: 0.9,
        systemInstruction:
          'You are a helpful assistant. Please name a title for the following chat message. If the message is too short, you may give a general title related to the content. Please control the length of the title to be less than 10 words. Please do not add any other content.',
      },
    });
    return response.text;
  } catch (error) {
    console.error('Error in /chat route:', error);
    return undefined;
  }
};

chatRouter.post('/', authMiddleware, async (c) => {
  const { id: userId } = c.get('user');
  const { content }: { content: string } = await c.req.json();
  const title = await generateTitle(content);
  if (!title) {
    c.status(500);
    return c.text('Server Network Error, Please retry');
  }
  const publicId = nanoid();
  const newChat = await db
    .insert(chatTable)
    .values({
      title,
      publicId,
      ownerId: userId,
    })
    .returning();
  c.status(201);
  return c.json({
    ...newChat[0],
    id: undefined,
  });
});

export default chatRouter;
