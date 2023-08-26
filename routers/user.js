import { Router } from 'express';
import { userController } from '../controllers/userController.js';

export const routerUser = Router()
	.get('/', userController.fetchUsers)
	.get('/:id', userController.fetchUsersById)
	.post('/', userController.register)
	.post('/tokens', userController.login);
