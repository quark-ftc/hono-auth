import { createController } from '@/commons/utils/create-controller';

export const userController = createController('/user');

userController.get('/users', async (c) => {});
