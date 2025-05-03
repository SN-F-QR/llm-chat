import { Hono } from 'hono';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const apiRouter = new Hono();

const llm = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

apiRouter.post('/chat', async (c) => {
  try {
    const { content }: { content: string } = await c.req.json();
    const response = await llm.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: content,
      config: {
        temperature: 1.2,
        maxOutputTokens: 200,
      },
    });
    return c.json({ content: response.text });
  } catch (error) {
    console.error('Error in /chat route:', error);
    c.status(500);
    return c.json({ error: 'Failed to chat with Gemini API' });
  }
});

export default apiRouter;
