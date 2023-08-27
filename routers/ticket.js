import { Router } from 'express';
import { TicketController } from '../controllers/ticketController.js';

export const routerTicket = Router()
	.get('/')
	.post('/', TicketController.createTicket)
	.get('/:id/ai')
	.get('/:id/messages');
