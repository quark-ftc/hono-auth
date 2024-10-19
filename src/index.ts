import { registerControllers } from '@/commons/utils/register-controllers';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { errorHandlerMiddleware } from '@/middlewares/error-handler.middleware';

function bootStrap() {
  return new Hono();
}
const app = bootStrap();

const port = 3000;
console.log(`Server is running on port ${port}`);

registerControllers(app);

app.onError(errorHandlerMiddleware);

serve({
  fetch: app.fetch,
  port,
});
