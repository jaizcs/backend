import { verifyToken } from '../helpers/jwt.js';
import { createClient } from '@supabase/supabase-js';

import { SUPABASE_SERVICE_KEY, SUPABASE_URL } from '../config.js';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

export const custAuth = async (req, res, next) => {
	try {
		const { access_token } = req.headers;
		if (!access_token) throw { name: 'loginFirst' };
		const payload = verifyToken(access_token);
		const { data } = await supabase
			.from('Customers')
			.select()
			.eq('email', payload.email);
		if (data.length === 0) throw { name: 'loginFirst' };
		req.user = {
			id: data[0].id,
			role: 'authenticated',
			type: 'customer',
		};
		next();
	} catch (error) {
		next(error);
	}
};
