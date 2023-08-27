'use strict';

import { createSupabaseClient } from '../helpers/supabase.js';

let db;

export const supabase = (req, _res, next) => {
	try {
		if (!db) {
			db = createSupabaseClient();
		}

		req.db = db;
		next();
	} catch (err) {
		next(err);
	}
};
