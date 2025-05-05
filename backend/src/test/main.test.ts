import { describe, test, expect } from 'vitest';
import app from '../index.js';

describe('main test', () => {
  test('should have a fetch method', () => {
    expect(app.fetch).toBeDefined();
  });

  test('POST /api/chat', async () => {
    const response = await app.request('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ content: 'Hello, Gemini!' }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/json');
    const body = (await response.json()) as { content: string };
    expect(body).toHaveProperty('content');
    expect(body.content).toBeTypeOf('string');
    expect(body.content.length).toBeGreaterThan(0);
  });

  test('POST /api/chat-stream', async () => {
    const response = await app.request('/api/chat-stream', {
      method: 'POST',
      body: JSON.stringify({ content: 'Can you tell me a joke in 100 words?' }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    expect(response.status).toBe(200);
    expect(response.body).not.toBeNull();
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      const text = decoder.decode(value);
      expect(text.length).toBeGreaterThan(0);
    }
  });
});
