import { Hono } from 'hono';
import { streamText } from 'hono/streaming';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const apiRouter = new Hono();

const llm = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

apiRouter.post('/chat', async (c) => {
  try {
    const { content }: { content: string } = await c.req.json();
    const response = await llm.models.generateContent({
      model: 'gemini-2.5-flash-preview-04-17',
      contents: content,
      config: {
        temperature: 1.2,
      },
    });
    return c.json({ content: response.text });
  } catch (error) {
    console.error('Error in /chat route:', error);
    c.status(500);
    return c.json({ error: 'Failed to chat with Gemini API' });
  }
});

apiRouter.post('/chat-stream', async (c) => {
  try {
    const { content }: { content: string } = await c.req.json();
    const response = await llm.models.generateContentStream({
      model: 'gemini-2.5-flash-preview-04-17',
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
    console.error('Error in /chat-stream route:', error);
    c.status(500);
    return c.json({ error: 'Failed to chat with Gemini API' });
  }
});

export default apiRouter;
