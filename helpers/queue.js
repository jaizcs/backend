'use strict';

import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';

const redis = new IORedis();

export const ticketQueue = new Queue('ticket', {
	connection: redis,
});

const ticketWorker = new Worker('ticket', async (job) => {
	// get available customer support
	// update ticket UserId
	// send greeting message
});
