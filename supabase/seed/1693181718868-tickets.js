'use strict';

import tickets from './tickets.json' assert { type: 'json' };

/**
 * @param { import('../../types').Supabase } supabase
 **/
export const up = async (supabase) => {
	const { data: user } = await supabase
		.from('Users')
		.select('id')
		.limit(1)
		.single();

	await supabase.from('Tickets').insert(
		tickets.map((ticket) => ({
			...ticket,
			UserId: user.id,
		})),
	);
};

/**
 * @param { import('../../types').Supabase } supabase
 **/
export const down = async (supabase) => {
	await supabase.from('Tickets').delete().not('id', 'is', null);
};
