'use strict';

import { HttpError } from '../helpers/error.js';

export const isUser = (req, _res, next) => {
	try {
		const {
			app_metadata: { type },
		} = req.auth;

		if (type !== 'user') throw new HttpError(403, 'You are not authorized');

		const { id } = req.auth;

		const { data: user } = req.db
			.from('Users')
			.select('id,email,name,role,createdAt,updatedAt')
			.eq('id', id)
			.limit(1)
			.single();
		req.user = user;

		next();
	} catch (err) {
		next(err);
	}
};
