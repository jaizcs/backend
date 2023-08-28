'use strict';

import { Redis } from 'ioredis';

import { REDIS_URL } from '../config.js';

let redis;

/**
 * @returns { Redis }
 */
export const getRedisClient = () => {
	if (!redis) {
		redis = new Redis(REDIS_URL);
	}

	return redis;
};
