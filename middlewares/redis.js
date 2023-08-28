'use strict';

import { getRedisClient } from '../helpers/redis.js';

export const redis = (req, _res, next) => {
	try {
		req.redis = getRedisClient();
		next();
	} catch (err) {
		next(err);
	}
};
