import { Router } from 'express';

import { routerTicket } from './ticket.js';
import { routerUser } from './user.js';
import { routerWidget } from './widget.js';

export const router = Router()
	.get('/health-check', (_req, res, _next) => {
		res.set('content-type', 'text/plain').status(200).send('OK');
	})
	.use('/tickets', routerTicket)
	.use('/users', routerUser)
	.use('/widget-tokens', routerWidget);
