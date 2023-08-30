import { comparePassword, hashPassword } from '../helpers/password.js';
import { generateToken } from '../helpers/jwt.js';
import { HttpError } from '../helpers/error.js';

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
			const { email, password, name, role = 'staff' } = req.body;

			if (!email) throw new HttpError(400, 'Email must Require');
			if (!password) throw new HttpError(400, 'Password must Require');
			if (!name) throw new HttpError(400, 'Name must Require');

			const { data: user, error } = await req.db
				.from('Users')
				.insert({
					email,
					password: hashPassword(password),
					name,
					role,
				})
				.select('id,email,name,role,createdAt,updatedAt')
				.single();
			if (
				error?.message ===
				'duplicate key value violates unique constraint "Users_email_key"'
			)
				throw new HttpError(409, 'Email alredy exist');
			res.status(201).json(user);
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
			if (!email) throw new HttpError(400, 'Email must Require');
			if (!password) throw new HttpError(400, 'Password must Require');

			console.log(email);

			const { data } = await supabase
				.from('Users')
				.select()
				.eq('email', email)
				.single();
			if (!data) throw new HttpError(401, 'Wrong Email or Password');

			const thisPassword = comparePassword(password, data.password);
			if (!thisPassword) throw new HttpError(401, 'Wrong Email or Password');

			const token = generateToken(
				{
					id: data.id,
					email,
					role: 'authenticated',
					app_metadata: {
						type: 'user',
					},
				},
				{ expiresIn: '1w' },
			);
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
		const supabase = req.db;
		const { data } = await supabase
			.from('Users')
			.select('id,email,name,role,createdAt,updatedAt');
		res.status(200).json(data);
	}
	/**
	 * @param { Request } req
	 * @param { Response } res
	 * @param { NextFunction } next
	 */
	static async fetchMe(req, res, next) {
		const supabase = req.db;
		const { id } = req.user;
		const { data } = await supabase
			.from('Users')
			.select('id,email,name,role,createdAt,updatedAt')
			.eq('id', id)
			.single();
		res.status(200).json(data);
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
			if (!data) throw new HttpError(404, 'User not found');
			res.status(200).json(data);
		} catch (err) {
			next(err);
		}
	}
}
