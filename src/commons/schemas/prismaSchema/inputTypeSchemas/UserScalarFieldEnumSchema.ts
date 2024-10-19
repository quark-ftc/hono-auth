import { z } from 'zod';

export const UserScalarFieldEnumSchema = z.enum(['id','email','password','name']);

export default UserScalarFieldEnumSchema;
