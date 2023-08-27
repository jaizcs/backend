import { Router } from 'express';
import { widgetContoller } from '../controllers/widgetController.js';

export const routerWidget = Router()
	.get('/', widgetContoller.fetchToken)
	.post('/', widgetContoller.createToken);
