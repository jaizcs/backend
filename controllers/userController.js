/**
 * @typedef { import('../types').Request } Request
 * @typedef { import('../types').Response} Response
 * @typedef { import('../types').NextFunction} NextFunction
 */
import { comparePassword, hasingPassword } from '../helpers/hashing.js';
import { generateToken } from '../helpers/jwt.js';

export class userController {
	/**
	 *
	 * @param { Request } req
	 * @param { Response } res
	 * @param { NextFunction } next
	 */
	static async register(req, res, next) {
		try {
			const supabase = req.db;
			const { email, password, name } = req.body;
			if (!email) throw { name: 'requireEmail' };
			if (!password) throw { name: 'requirePassword' };
			if (!name) throw { name: 'requireName' };
			const hashPassword = hasingPassword(password);
			const { data } = await supabase
				.from('Users')
				.insert({
					email,
					password: hashPassword,
					name,
					isAvaliable: false,
					experienceYear: 0,
				})
				.select('id , email');
			res.status(201).json(data[0]);
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
	static async login(req, res, next) {
		try {
			const supabase = req.db;
			const { email, password } = req.body;
			if (!email) throw { name: 'requireEmail' };
			if (!password) throw { name: 'requirePassword' };
			const { data } = await supabase.from('Users').select().eq('email', email);
			if (data.length === 0 || !data) throw { name: 'InvalidUser' };
			const thisPassword = comparePassword(password, data[0].password);
			if (!thisPassword) throw { name: 'InvalidUser' };
			const token = generateToken({
				id: data[0].id,
				email,
				experienceYear: data[0].experienceYear,
			});
			res.status(200).json({
				access_token: token,
			});
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
	static async fetchUsers(req, res, next) {
		try {
			const supabase = req.db;
			const { data } = await supabase
				.from('Users')
				.select('id,email,name,isAvaliable,experienceYear,createdAt,updatedAt');
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
	static async fetchUsersById(req, res, next) {
		try {
			const supabase = req.db;
			const { id } = req.params;
			const { data } = await supabase
				.from('Users')
				.select('id,email,name,isAvaliable,experienceYear,createdAt,updatedAt')
				.eq('id', id);
			if (data.length === 0) throw 'userNotFound';
			res.status(200).json(data[0]);
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
	static async getTokens(req, res, next) {
		try {
			const supabase = req.db;
			const { id } = req.params;
			const { data } = await supabase
				.from('Users')
				.select('id,email,name,isAvaliable,experienceYear,createdAt,updatedAt')
				.eq('id', id);
			if (data.length === 0) throw 'userNotFound';
			res.status(200).json(data[0]);
		} catch (error) {
			next(error);
		}
	}
}
