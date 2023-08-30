'use strict';

import { generateToken } from '../../helpers/jwt.js';

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

	const token = generateToken({
		role: 'anon',
		app_metadata: {
			type: 'widget',
		},
	});
	await supabase.from('WidgetTokens').insert({
		token,
		UserId: user.id,
		name: 'complain',
	});
};

/**
 * @param { import('../../types').Supabase } supabase
 **/
export const down = async (supabase) => {
	await supabase.from('Messages').delete().not('id', 'is', null);
};
