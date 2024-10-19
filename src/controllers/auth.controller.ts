import {
  LoginDTO,
  LoginSchema,
  RegisterDTO,
  RegisterSchema,
} from '@/commons/schemas/auth.schema';
import { createController } from '@/commons/utils/create-controller';
import { createResponse } from '@/commons/utils/create-response';
import { zodValidator } from '@/middlewares/zod-validator.middleware';
import { getUserByEmail, registerUser } from '@/services/user.service';
import bcrypt from 'bcryptjs';

import {
  getCookie,
  getSignedCookie,
  setCookie,
  setSignedCookie,
  deleteCookie,
} from 'hono/cookie';

export const authController = createController('/auth');
authController.post('/login', zodValidator('json', LoginSchema), async (c) => {
  const loginDTO: LoginDTO = c.req.valid('json');

  const user = await getUserByEmail(loginDTO.email);
  if (!user) {
    throw new Error('User not found');
  }

  if (!bcrypt.compareSync(loginDTO.password!, user.password!)) {
    throw new Error('Invalid password');
  }

  setCookie(c, 'token', user.email);
  return c.json(
    createResponse<typeof user>({
      success: true,
      data: user,
      message: 'User logged in successfully',
    }),
  );
});

authController.post(
  '/register',
  zodValidator('json', RegisterSchema),
  async (c) => {
    const registerDTO: RegisterDTO = c.req.valid('json');
    const user = await getUserByEmail(registerDTO.email);
    if (user) {
      throw new Error('User already exists');
    }
    const registeredUser = await registerUser(registerDTO);

    if (!registeredUser) {
      throw new Error('Failed to register user');
    }
    return c.json(
      createResponse<typeof registeredUser>({
        success: true,
        data: registeredUser,
        message: 'User registered successfully',
      }),
    );
  },
);
