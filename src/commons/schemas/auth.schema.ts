import { z } from 'zod';
import { UserSchema } from '@/commons/schemas/prismaSchema';

export const LoginSchema = UserSchema.omit({ name: true, id: true });
export type LoginDTO = z.infer<typeof LoginSchema>;

export const RegisterSchema = UserSchema.omit({ id: true });
export type RegisterDTO = z.infer<typeof RegisterSchema>;
