import { Hono } from 'hono';
import { authController } from '@/controllers/auth.controller';
const controllers = [authController];
export const registerControllers = (app: Hono) => {
  controllers.forEach((controller) => {
    app.route(controller.controllerBasePath, controller.router);
  });
};
