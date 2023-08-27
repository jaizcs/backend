/**
 * @typedef { import('../types').Request } Request
 * @typedef { import('../types').Response} Response
 * @typedef { import('../types').NextFunction} NextFunction
 */

export class TicketController {
	/**
	 * @param { Request } req
	 * @param { Response } res
	 * @param { NextFunction } next
	 */
	static async createTicket(req, res, next) {
		try {
			const {
				type,
				description,
				isSatisfactory,
				status,
				embedding,
				resolution,
			} = req.body;

			const { data } = await req.db
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

			// const token = generateToken({
			// 	id: data[0].id,
			// 	type: 'ticket',
			// });

			// console.log(token);

			res.status(201).json({
				// access_token: token,
			});
		} catch (err) {
			next(err);
		}
	}

	/**
	 * @param { Request } req
	 * @param { Response } res
	 * @param { NextFunction } next
	 */
	static async getTickets(req, res, next) {
		try {
		} catch (err) {
			next(err);
		}
	}
}
