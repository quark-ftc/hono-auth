import { createResponse } from '@/commons/utils/create-response';
import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { HTTPResponseError } from 'hono/types';
import { ZodError } from 'zod';
import { StatusCode } from 'hono/utils/http-status';

export const errorHandlerMiddleware = async (
  e: Error | HTTPResponseError,
  c: Context,
) => {
  let status: StatusCode = 500;

  let message = 'Internal server error';
  let error = 'InternalServerError';
  if (e instanceof HTTPException) {
    message = e.message;
    error = e.name;
    status = e.status;
  } else if (e instanceof ZodError) {
    const errorMessages = e.errors.map((error) => {
      return `${error.path.join('.')}:${error.message}`;
    });

    message = errorMessages.join(';');
    error = 'ValidationError';
  } else if (e instanceof Error) {
    message = e.message;
    error = e.name ?? error;
  }

  return c.json(
    createResponse({
      success: false,
      message,
      error,
    }),
    status,
  );
};
