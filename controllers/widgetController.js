/**
 * @typedef { import('../types').Request } Request
 * @typedef { import('../types').Response} Response
 * @typedef { import('../types').NextFunction} NextFunction
 */
import { comparePassword, hasingPassword } from '../helpers/hashing.js';
import { generateToken } from '../helpers/jwt.js';

export class widgetContoller {
	/**
	 *
	 * @param { Request } req
	 * @param { Response } res
	 * @param { NextFunction } next
	 */
	static async fetchToken(req, res, next) {
		try {
			const supabase = req.db;
			const { id } = req.user;
			const { data } = await supabase
				.from('WidgetTokens')
				.select()
				.eq('UserId', id);
			res.status(200).json(data);
		} catch (error) {
			next(error);
		}
	}
	/**
	 *
	 * @param { Request } req
	 * @param { Response } res
	 * @param { NextFunction } next
	 */
	static async createToken(req, res, next) {
		try {
			const supabase = req.db;
			const { id, email } = req.user;
			const token = generateToken({
				id,
				email,
				role: 'anon',
				type: 'widget',
			});
			const { data } = await supabase
				.from('WidgetTokens')
				.insert({
					token,
					UserId: id,
				})
				.select();
			res.status(201).json(data[0]);
		} catch (error) {
			next(error);
		}
	}
}
