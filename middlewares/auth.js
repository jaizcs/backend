'use strict';

import { HttpError } from '../helpers/error.js';
import { verifyToken } from '../helpers/jwt.js';

export const authenticate = async (req, _res, next) => {
	try {
		const { authorization } = req.headers;

		if (authorization) {
			const payload = verifyToken(authorization);
			req.auth = payload;
		}

		next();
	} catch (_err) {
		next();
	}
};

export const isAuthenticated = (req, _res, next) => {
	try {
		if (!req.auth) throw new HttpError(401, 'Invalid access token');

		next();
	} catch (err) {
		next(err);
	}
};
