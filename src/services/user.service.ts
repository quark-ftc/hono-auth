import { prismaClient } from '@/commons/libs/db';
import { RegisterDTO } from '@/commons/schemas/auth.schema';
import bcrypt from 'bcryptjs';
export const getUserByEmail = async (email: string) => {
  const user = await prismaClient.user.findFirst({
    where: {
      email,
    },
  });
  return user;
};

export const registerUser = async (registerDto: RegisterDTO) => {
  const user = await prismaClient.user.create({
    data: {
      ...registerDto,
      password: bcrypt.hashSync(registerDto.password!, 10),
    },
  });
  return user;
};
