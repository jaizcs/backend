import { HttpError } from '../helpers/error.js';
import { generateToken } from '../helpers/jwt.js';

/**
 * @typedef { import('../types').Request } Request
 * @typedef { import('../types').Response} Response
 * @typedef { import('../types').NextFunction } NextFunction
 */

export class widgetContoller {
	/**
	 * @param { Request } req
	 * @param { Response } res
	 * @param { NextFunction } next
	 */
	static async fetchToken(req, res, next) {
		const supabase = req.db;
		const { id } = req.user;
		const { data } = await supabase
			.from('WidgetTokens')
			.select()
			.eq('UserId', id);
		res.status(200).json(data);
	}

	/**
	 * @param { Request } req
	 * @param { Response } res
	 * @param { NextFunction } next
	 */
	static async createToken(req, res, next) {
		try {
			const supabase = req.db;
			const { name } = req.body;
			const { id } = req.user;

			if (!name) throw new HttpError(400, 'Name must require');

			const token = generateToken({
				role: 'anon',
				app_metadata: {
					type: 'widget',
				},
			});
			const { data } = await supabase
				.from('WidgetTokens')
				.insert({
					token,
					UserId: id,
					name,
				})
				.select();

			res.status(201).json(data[0]);
		} catch (error) {
			next(error);
		}
	}
}
