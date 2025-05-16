import { StatusCode } from 'hono/utils/http-status';

export default class NotFoundError extends Error {
  message: string;
  name = 'NotFoundError';
  statusCode: StatusCode = 404;
  constructor(message: string) {
    super();
    this.message = message;
  }
}
