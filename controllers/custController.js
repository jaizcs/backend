/**
 * @typedef { import('../types').Request } Request
 * @typedef { import('../types').Response} Response
 * @typedef { import('../types').NextFunction} NextFunction
 */

export class custController {
	/**
	 *
	 * @param { Request } req
	 * @param { Response } res
	 * @param { NextFunction } next
	 */
	static async custRegister(req, res, next) {
		try {
			const supabase = req.db;
			const { email, name } = req.body;
			if (!email) throw { name: 'requireEmail' };
			if (!name) throw { name: 'requireName' };
			const { data } = await supabase
				.from('Customers')
				.insert({
					email,
					name,
				})
				.select('id , email');
			res.status(201).json(data[0]);
		} catch (error) {
			console.log(error);
			next(error);
		}
	}
	/**
	 *
	 * @param { Request } req
	 * @param { Response } res
	 * @param { NextFunction } next
	 */
	static async custlogin(req, res, next) {
		try {
			const supabase = req.db;
			const { email } = req.body;
			if (!email) throw { name: 'requireEmail' };
			const { data } = await supabase
				.from('Customers')
				.select()
				.eq('email', email);
			if (data.length === 0 || !data) throw { name: 'InvalidUser' };
			const token = generateToken({
				id: data[0].id,
				email,
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
				.from('Customers')
				.select('id,email,name,createdAt,updatedAt');
			res.status(200).json(data);
		} catch (error) {
			next(error);
		}
	}
}
