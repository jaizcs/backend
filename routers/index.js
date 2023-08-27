import { Router } from 'express';
import { routerUser } from './user.js';
import { authentication } from '../middlewares/authentication.js';
import { routerWidget } from './widget.js';
import { widgetContoller } from '../controllers/widgetController.js';

export const router = Router()
	.get('/health-check', (_req, res, _next) => {
		res.set('content-type', 'text/plain').status(200).send('OK');
	})
	.use('/users', routerUser)
	.post('/ticket/:id/resolutions', widgetContoller.generateResolution)
	.use(authentication)
	.use('/tokens', routerWidget);
