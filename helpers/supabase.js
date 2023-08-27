'use strict';

import { createClient } from '@supabase/supabase-js';

import { SUPABASE_SERVICE_KEY, SUPABASE_URL } from '../config.js';

export const createSupabaseClient = () => {
	return createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	});
};
