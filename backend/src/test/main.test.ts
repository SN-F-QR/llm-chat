import { describe, test, expect } from 'vitest';
import app from '../index';

interface User {
  id: number;
  name: string;
  password: string | undefined;
  money: number;
  avatar: string;
  stuNum: string;
  department: string;
  lastRevokedTime: number;
}

describe.sequential('main test', () => {
  let TOKEN: string; // JWT token for authentication

  test('should have a fetch method', () => {
    expect(app.fetch).toBeDefined();
  });

  test('POST /user', async () => {
    const response = await app.request('/api/user', {
      method: 'POST',
      body: JSON.stringify({
        name: 'test User',
        password: '123456789012345678',
        stuNum: '20180321',
        department: 'Computer Science',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    expect(response.status).toBe(201);
    expect(response.headers.get('Content-Type')).toBe('application/json');
    const { info, token } = (await response.json()) as { info: User; token: string };
    expect(info).toBeDefined();
    expect(info.password).toBeUndefined();
    expect(info.lastRevokedTime).toBeUndefined();
    expect(token).toBeDefined();
  });

  test('POST /login', async () => {
    const response = await app.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        stuNum: '20180321',
        password: '123456789012345678',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    expect(response.status).toBe(200);
    const { info, token } = (await response.json()) as { info: string; token: string };
    expect(info).toBe('Login successful');
    expect(token).toBeDefined();
    TOKEN = token;
  });

  describe.concurrent('auth test', () => {
    test('GET /verify', async () => {
      const response = await app.request('/api/auth/verify', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      });
      expect(response.status).toBe(200);
      const body = await response.text();
      expect(body).toBe('Verify endpoint');
    });

    test('GET /verify with invalid token', async () => {
      const response = await app.request('/api/auth/verify', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer invalid_token233',
        },
      });
      expect(response.status).toBe(401);
    });

    test('POST /chat', async () => {
      const response = await app.request('/api/llm/chat', {
        method: 'POST',
        body: JSON.stringify({ content: 'Hello, Gemini!' }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${TOKEN}`,
        },
      });
      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('application/json');
      const body = (await response.json()) as { content: string };
      expect(body).toHaveProperty('content');
      expect(body.content).toBeTypeOf('string');
      expect(body.content.length).toBeGreaterThan(0);
    }, 20_000);

    test('POST /chat-stream', async () => {
      const response = await app.request('/api/llm/chat-stream', {
        method: 'POST',
        body: JSON.stringify({ content: 'Can you tell me a joke in 100 words?' }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${TOKEN}`,
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
    }, 20_000);

    test('GET /me', async () => {
      const response = await app.request('/api/user/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      });
      expect(response.status).toBe(200);
      const body = (await response.json()) as Omit<User, 'password'>;
      expect(body).toBeDefined();
      expect(body).not.toHaveProperty('password');
      expect(body.lastRevokedTime).toBeUndefined();
    });
  });

  test('Logout', async () => {
    const response = await app.request('/api/auth/logout', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    expect(response.status).toBe(200);
    const body = await response.text();
    expect(body).toBe('Logout successful');
  });
});
