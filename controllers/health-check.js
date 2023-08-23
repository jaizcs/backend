'use strict';

/**
 * @typedef { import('../types').Request } Request
 * @typedef { import('../types').Response} Response
 * @typedef { import('../types').NextFunction} NextFunction
 */

export class HealthCheckController {
	/**
	 *
	 * @param { Request } req
	 * @param { Response } res
	 * @param { NextFunction } next
	 */
	static async healthCheck(req, res, next) {}
}
