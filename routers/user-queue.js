'use strict';

import { Router } from 'express';
import { UserQueueController } from '../controllers/userQueueController.js';

export const routerUserQueue = Router()
	.get('/', UserQueueController.isInQueue)
	.post('/', UserQueueController.addToQueue)
	.delete('/', UserQueueController.removeFromQueue);
