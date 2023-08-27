import { Router } from 'express';

import { routerTicket } from './ticket.js';
import { routerUser } from './user.js';
import { authentication } from '../middlewares/authentication.js';
import { routerWidget } from './widget.js';

export const router = Router()
	.get('/health-check', (_req, res, _next) => {
		res.set('content-type', 'text/plain').status(200).send('OK');
	})
	.use('/', routerTicket)
	.use('/', routerUser)
	.use(authentication)
	.use('/tokens', routerWidget);
