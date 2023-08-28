'use strict';
import { hashPassword } from '../../helpers/password.js';

/**
 * @param { import('../../types').Supabase } supabase
 **/
export const up = async (supabase) => {
	// insert data
	const password = hashPassword('123456');
	await supabase.from('Users').insert({
		email: 'johndoe@mail.com',
		password,
		name: 'John Doe',
		role: 'admin',
		createdAt: new Date(),
		updatedAt: new Date(),
	});
};

/**
 * @param { import('../../types').Supabase } supabase
 **/
export const down = async (supabase) => {
	// remove data
	await supabase.from('Users').delete().not('id', 'is', null);
};
