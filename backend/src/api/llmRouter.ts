import { Hono } from 'hono';
import { authMiddleware } from './authRouter';
import { streamText } from 'hono/streaming';
import { GoogleGenAI } from '@google/genai';
import { googleApiKey } from '../config';

const llmRouter = new Hono();

const llm = new GoogleGenAI({ apiKey: googleApiKey });

llmRouter.post('/chat', authMiddleware, async (c) => {
  try {
    const { content }: { content: string } = await c.req.json();
    const response = await llm.models.generateContent({
      model: 'gemini-2.5-flash-preview-05-20',
      contents: content,
      config: {
        temperature: 1.2,
      },
    });
    return c.json({ content: response.text });
  } catch (error) {
    console.error('Error in /llm route:', error);
    c.status(500);
    return c.json({ error: 'Failed to chat with Gemini API' });
  }
});

llmRouter.post('/chat-stream', authMiddleware, async (c) => {
  try {
    const { content }: { content: string } = await c.req.json();
    const response = await llm.models.generateContentStream({
      model: 'gemini-2.5-pro-preview-05-06',
      contents: content,
      config: {
        temperature: 1.2,
      },
    });
    c.status(200);
    return streamText(c, async (stream) => {
      for await (const chunk of response) {
        if (chunk.text) {
          await stream.write(chunk.text);
        }
      }
    });
  } catch (error) {
    console.error('Error in /llm-stream route:', error);
    c.status(500);
    return c.json({ error: 'Failed to chat with Gemini API' });
  }
});

export default llmRouter;
