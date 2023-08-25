'use strict';

import { createClient } from '@supabase/supabase-js';

import { SUPABASE_SERVICE_KEY, SUPABASE_URL } from '../config.js';

export const supabase = (req, _res, next) => {
	try {
		const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
			auth: {
				autoRefreshToken: false,
				persistSession: false,
			},
		});

		req.db = supabase;
		next();
	} catch (err) {
		next(err);
	}
};
