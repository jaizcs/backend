'use strict';

import { getSupabaseClient } from '../helpers/supabase.js';

export const supabase = (req, _res, next) => {
	try {
		req.db = getSupabaseClient();
		next();
	} catch (err) {
		next(err);
	}
};
