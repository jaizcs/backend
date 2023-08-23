'use strict';

export const handleError = async (err, req, res, _next) => {
	res.staus(500).send({
		message: 'Internal server error',
	});
};
