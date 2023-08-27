import { Router } from 'express';
import { widgetContoller } from '../controllers/widgetController.js';
import { isUser, isUserAdmin } from '../middlewares/authz.js';

export const routerWidget = Router()
	.get('/', isUser, isUserAdmin, widgetContoller.fetchToken)
	.post('/', isUser, isUserAdmin, widgetContoller.createToken);
