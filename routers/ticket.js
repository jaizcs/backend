import { Router } from 'express';

import { TicketController } from '../controllers/ticketController.js';
import { isCustomer, isUser, isWidget } from '../middlewares/authz.js';

export const routerTicket = Router()
	.get('/', isUser, TicketController.fetchTickets)
	.post('/', isWidget, TicketController.createTicket)
	.patch('/:id', TicketController.resolveTicket)
	.get(
		'/:id/similarity-search',
		isCustomer,
		TicketController.fetchSimilarResolution,
	);
