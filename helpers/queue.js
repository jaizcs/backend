'use strict';

import { Queue, Worker } from 'bullmq';

import { getRedisClient } from './redis.js';
import { getSupabaseClient } from './supabase.js';

const ticketQueue = new Queue('ticket', {
	connection: getRedisClient(),
});

export const addTicketToQueue = async ({ ticketId, userId }) => {
	await ticketQueue.add('queue-ticket', {
		ticketId,
		userId,
	});
};

const ticketWorker = new Worker('ticket', async (job) => {
	const { ticketId, userId } = job.data;

	// update ticket UserId
	const supabase = getSupabaseClient();
	await supabase
		.from('Tickets')
		.update({
			UserId: userId,
		})
		.eq('id', ticketId);
});
