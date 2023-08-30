'use strict';

import { HttpError } from '../helpers/error.js';

export const handleError = async (err, req, res, _next) => {
	console.log(err);

	if (err instanceof HttpError) {
		return res.status(err.code).json(err);
	}

	let statusCode = 500;
	let message = 'Internal server error';

	res.status(statusCode).json({
		message,
	});
};
