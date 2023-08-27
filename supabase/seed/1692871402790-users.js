'use strict';
import { hashPassword } from '../../helpers/password.js';

/**
 * @param { import('../../types').Supabase } supabase
 **/
export const up = async (supabase) => {
	// insert data
	const password = hashPassword('123456');
	await supabase.from('Users').insert({
		email: 'admin@gmail.com',
		password,
		name: 'admin',
		experienceYear: 4,
		isAvailable: false,
		createdAt: new Date(),
		updatedAt: new Date(),
	});
};

/**
 * @param { import('../../types').Supabase } supabase
 **/
export const down = async (supabase) => {
	// remove data
	await supabase.from('countries').delete();
};
