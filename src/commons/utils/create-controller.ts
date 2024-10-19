import { Hono } from 'hono';

export type Controller = {
  controllerBasePath: string;
  router: Hono;
} & Omit<Hono, 'route'>;

export function createController(controllerBasePath: string): Controller {
  const router = new Hono();

  const controller = {
    controllerBasePath,
    router,
  } as Controller;

  // Copy methods from the Hono instance
  Object.keys(router).forEach((key) => {
    if (typeof router[key as keyof Hono] === 'function') {
      (controller as any)[key] = (...args: any[]) => {
        return (router[key as keyof Hono] as Function).apply(router, args);
      };
    }
  });

  return controller;
}
