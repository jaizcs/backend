import { comparePassword, hashPassword } from '../helpers/password.js';
import { generateToken } from '../helpers/jwt.js';

/**
 * @typedef { import('../types').Request } Request
 * @typedef { import('../types').Response} Response
 * @typedef { import('../types').NextFunction } NextFunction
 */

export class UserController {
	/**
	 * @param { Request } req
	 * @param { Response } res
	 * @param { NextFunction } next
	 */
	static async register(req, res, next) {
		try {
			const { email, password, name, role } = req.body;
			if (!email) throw { name: 'requireEmail' };
			if (!password) throw { name: 'requirePassword' };
			if (!name) throw { name: 'requireName' };

			const { data: user } = await req.db
				.from('Users')
				.insert({
					email,
					password: hashPassword(password),
					name,
					role,
				})
				.select('id,email,name,role,createdAt,updatedAt')
				.single();

			res.status(201).send(user);
		} catch (err) {
			next(err);
		}
	}

	/**
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
			const { data } = await supabase
				.from('Users')
				.select()
				.eq('email', email)
				.single();
			if (!data) throw { name: 'InvalidUser' };
			const thisPassword = comparePassword(password, data.password);
			if (!thisPassword) throw { name: 'InvalidUser' };

			const token = generateToken({
				id: data.id,
				email,
				role: data.role,
				app_metadata: {
					type: 'user',
				},
			});
			res.status(200).json({
				accessToken: token,
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
	static async fetchUsers(req, res, next) {
		try {
			const supabase = req.db;
			const { data } = await supabase
				.from('Users')
				.select('id,email,name,role,createdAt,updatedAt');
			res.status(200).json(data);
		} catch (err) {
			next(err);
		}
	}
	/**
	 * @param { Request } req
	 * @param { Response } res
	 * @param { NextFunction } next
	 */
	static async fetchMe(req, res, next) {
		try {
			const supabase = req.db;
			const { id } = req.auth;
			const { data } = await supabase
				.from('Users')
				.select('id,email,name,role,createdAt,updatedAt')
				.eq('id', id)
				.single();
			res.status(200).json(data);
		} catch (err) {
			next(err);
		}
	}

	/**
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
				.select('id,email,name,role,createdAt,updatedAt')
				.eq('id', id)
				.single();
			if (!data) throw 'userNotFound';
			res.status(200).json(data);
		} catch (err) {
			next(err);
		}
	}
}
