import type {
  Context,
  MiddlewareHandler,
  Env,
  ValidationTargets,
  TypedResponse,
  Input,
} from 'hono';
import { validator } from 'hono/validator';
import type { z, ZodSchema, ZodError } from 'zod';

export type Hook<
  T,
  E extends Env,
  P extends string,
  Target extends keyof ValidationTargets = keyof ValidationTargets,
  O = {},
> = (
  result: (
    | { success: true; data: T }
    | { success: false; error: ZodError; data: T }
  ) & {
    target: Target;
  },
  c: Context<E, P>,
) =>
  | Response
  | void
  | TypedResponse<O>
  | Promise<Response | void | TypedResponse<O>>;

type HasUndefined<T> = undefined extends T ? true : false;

export const zodValidator = <
  T extends ZodSchema,
  Target extends keyof ValidationTargets,
  E extends Env,
  P extends string,
  In = z.input<T>,
  Out = z.output<T>,
  I extends Input = {
    in: HasUndefined<In> extends true
      ? {
          [K in Target]?: In extends ValidationTargets[K]
            ? In
            : { [K2 in keyof In]?: ValidationTargets[K][K2] };
        }
      : {
          [K in Target]: In extends ValidationTargets[K]
            ? In
            : { [K2 in keyof In]: ValidationTargets[K][K2] };
        };
    out: { [K in Target]: Out };
  },
  V extends I = I,
>(
  target: Target,
  schema: T,
  hook?: Hook<z.infer<T>, E, P, Target>,
): MiddlewareHandler<E, P, V> =>
  // @ts-expect-error not typed well
  validator(target, async (value, c) => {
    const result = await schema.safeParseAsync(value);
    if (hook) {
      const hookResult = await hook({ data: value, ...result, target }, c);
      if (hookResult) {
        if (hookResult instanceof Response) {
          return hookResult;
        }

        if ('response' in hookResult) {
          return hookResult.response;
        }
      }
    }

    if (!result.success) {
      // return c.json(result, 400);
      throw result.error;
    }

    return result.data as z.infer<T>;
  });
