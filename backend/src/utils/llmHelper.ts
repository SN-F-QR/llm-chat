import { Message } from '../drizzle/schema';
import { GoogleGenAI } from '@google/genai';
import { googleApiKey } from '../config';
import NotFoundError from '../error/NotFoundError';

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

const createHistory = (messages: Message[], newContent: string) => {
  const history = messages.map((message) => {
    return {
      role: message.role === 0 ? 'user' : 'model',
      parts: [{ text: message.content }],
    };
  });
  history.push({
    role: 'user',
    parts: [{ text: newContent }],
  });
  return history;
};

const generateContent = async (content: ReturnType<typeof createHistory>, model: string) => {
  const modelName =
    model === 'gemini-flash'
      ? 'gemini-2.5-flash-preview-05-20'
      : model === 'gemini-pro'
        ? 'gemini-2.5-pro-preview-05-06'
        : undefined;
  if (!modelName) {
    throw new NotFoundError('Model not found');
  }
  try {
    const stream = await llm.models.generateContentStream({
      model: modelName,
      contents: content,
      config: {
        temperature: 1.2,
      },
    });
    return stream;
  } catch {
    throw new Error('Failed to request gemini server');
  }
};

export { createHistory, generateTitle, generateContent };

export default llm;
