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
});
