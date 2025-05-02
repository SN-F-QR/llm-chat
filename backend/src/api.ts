import express, { type Router } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const apiRouter: Router = express.Router();

const llm = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

apiRouter.use(express.json());

apiRouter.post('/chat', async (req, res) => {
  try {
    const { content } = req.body as { content: string };
    const response = await llm.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: content,
      config: {
        temperature: 1.2,
        maxOutputTokens: 200,
      },
    });
    res.json({ content: response.text });
  } catch (error) {
    console.error('Error in /chat route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default apiRouter;
