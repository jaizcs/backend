import { Router } from 'express';
import { userController } from '../controllers/userController.js';

export const routerUser = Router()
	.get('/users', userController.fetchUsers)
	.get('/users/:id', userController.fetchUsersById)
	.post('/users', userController.register)
	.post('/users/tokens', userController.login);
