import { Router } from 'express';
import { custController } from '../controllers/custController.js';

export const routerCust = Router()
	.post('/pub/cust', custController.custRegister)
	.post('/pub/login', custController.custlogin);
