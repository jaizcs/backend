import { Router } from 'express';
// import { routerUser } from './user.js';
// import { routerCust } from './customer.js';
import { routerTicket } from './ticket.js';
// import { custAuth } from '../middlewares/custAuthentication.js';

export const router = Router()
	.get('/health-check', (_req, res, _next) => {
		res.set('content-type', 'text/plain').status(200).send('OK');
	})
	.use('/', routerTicket)
	// .use(custAuth)
	.get('/test', (req, res) => {
		console.log('exex');
	});
