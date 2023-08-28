'use strict';

import { Queue, Worker } from 'bullmq';

import { getRedisClient } from './redis.js';
import { getSupabaseClient } from './supabase.js';

const ticketQueue = new Queue('ticket', {
	connection: getRedisClient(),
});

export const addTicketToQueue = async (ticketId) => {
	await ticketQueue.add('queue-ticket', {
		ticketId,
	});
};

const ticketWorker = new Worker('ticket', async (job) => {
	const { ticketId } = job.data;

	// get available customer support
	const redis = getRedisClient();
	const userId = redis.lpop('user:queue');

	// update ticket UserId
	const supabase = getSupabaseClient();
	await supabase
		.from('Tickets')
		.update({
			UserId: userId,
		})
		.eq('id', ticketId);
});
