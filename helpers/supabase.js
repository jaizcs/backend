'use strict';

import { createClient } from '@supabase/supabase-js';

import { SUPABASE_SERVICE_KEY, SUPABASE_URL } from '../config.js';

let supabase;

/**
 * @returns { import('../types.js').Supabase }
 */
export const getSupabaseClient = () => {
	if (!supabase) {
		supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
			auth: {
				autoRefreshToken: false,
				persistSession: false,
			},
		});
	}

	return supabase;
};
