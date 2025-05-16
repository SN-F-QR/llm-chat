import { StatusCode } from 'hono/utils/http-status';

export default class UnauthorizedError extends Error {
  message: string;
  name = 'UnauthorizedError';
  statusCode: StatusCode = 401;
  constructor(message: string) {
    super();
    this.message = message;
  }
}
