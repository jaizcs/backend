import { Router } from 'express';
import { ticketController } from '../controllers/ticketController.js';

export const routerTicket = Router().post(
	'/createTicket',
	ticketController.createTicket,
);
