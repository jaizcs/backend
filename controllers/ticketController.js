/**
 * @typedef { import('../types').Request } Request
 * @typedef { import('../types').Response} Response
 * @typedef { import('../types').NextFunction} NextFunction
 */

import OpenAI from 'openai';
import { generateToken } from '../helpers/jwt.js';

export class ticketController {
	/**
	 * @param { Request } req
	 * @param { Response } res
	 * @param { NextFunction } next
	 */
	static async createTicket(req, res, next) {
		try {
			const supabase = req.db;
			const {
				type,
				description,
				isSatisfactory,
				status,
				embedding,
				resolution,
			} = req.body;

			const { data } = await supabase
				.from('Tickets')
				.insert({
					description,
					isSatisfactory,
					status,
					embedding,
					resolution,
					type,
				})
				.select('id');
			console.log(data, 'line 77');

			// const token = generateToken({
			// 	id: data[0].id,
			// 	type: 'ticket',
			// });

			// console.log(token);

			res.status(201).json({
				// access_token: token,
			});
		} catch (error) {
			console.log(error);
			next(error);
		}
	}

	/**
	 * @param { Request } req
	 * @param { Response } res
	 * @param { NextFunction } next
	 */
	static async getTickets(req, res, next) {}
}
