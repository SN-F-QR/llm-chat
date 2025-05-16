import { StatusCode } from 'hono/utils/http-status';

class ConflictError extends Error {
  message: string;
  name = 'ConflictError';
  statusCode: StatusCode = 409;
  constructor(message: string) {
    super();
    this.message = message;
  }
}

export default ConflictError;
