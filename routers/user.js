import { Router } from 'express';
import { UserController } from '../controllers/userController.js';
import { isAuthenticated } from '../middlewares/auth.js';
import { isUser } from '../middlewares/authz.js';

export const routerUser = Router()
	.get('/', isAuthenticated, isUser, UserController.fetchUsers)
	.post('/', UserController.register)
	.post('/tokens', UserController.login)
	.get('/:id', isAuthenticated, isUser, UserController.fetchUsersById);
