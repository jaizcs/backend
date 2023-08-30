'use strict';

import tickets from './tickets.json' assert { type: 'json' };

/**
 * @param { import('../../types').Supabase } supabase
 **/

export const up = async (supabase) => {
	// insert data
	const { data: user } = await supabase
		.from('Users')
		.select('id')
		.limit(1)
		.single();

	await supabase.from('Messages').insert(
		tickets.flatMap((ticket, i = 1) => {
			i = i + 1;
			return [
				{
					message: ticket.description,
					TicketId: i,
					role: 'customer',
				},
				{
					message: ticket.resolution,
					TicketId: i,
					role: 'assistant',
					UserId: user.id,
				},
			];
		}),
	);
};

/**
 * @param { import('../../types').Supabase } supabase
 **/
export const down = async (supabase) => {
	await supabase.from('Messages').delete().not('id', 'is', null);
};
