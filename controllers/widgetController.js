import { generateToken } from '../helpers/jwt.js';

/**
 * @typedef { import('../types').Request } Request
 * @typedef { import('../types').Response} Response
 * @typedef { import('../types').NextFunction} NextFunction
 */

export class widgetContoller {
	/**
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
	 * @param { Request } req
	 * @param { Response } res
	 * @param { NextFunction } next
	 */
	static async createToken(req, res, next) {
		try {
			const supabase = req.db;
			const { id } = req.user;
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
				})
				.select();
			res.status(201).json(data[0]);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * @param { Request } req
	 * @param { Response } res
	 * @param { NextFunction } next
	 */
	static async generateResolution(req, res, next) {
		try {
			const supabase = req.db;
			const { id } = req.params;
			const { data: ticketData } = await supabase
				.from('Tickets')
				.select()
				.eq('id', id)
				.single();
			const description = ticketData.description;
			const { data: documents } = await supabase.rpc('match_documents', {
				query_embedding: embedding,
				match_threshold: 0.7, // Choose an appropriate threshold for your data
				match_count: 5, // Choose the number of matches
			});
			if (documents.length === 0) {
				return res.status(200).json({ resolution: null });
			}
			const data = documents
				.map((el, i = 1) => {
					i++;
					return `${i}.${el}.`;
				})
				.join('\n');
			const prompt = `for this question bellow \n '${description}' \n chose one best answer from ${documents.length} answer below and  only display answer without the answer number \n ${data}`;
			const { choices } = await req.ai.chat.completions.create({
				messages: [{ role: 'user', content: prompt }],
				model: 'gpt-3.5-turbo',
			});

			await supabase
				.from('Messages')
				.insert({ TikcetId: id, messages: choices[0].message.content });
			res.status(200).send();
		} catch (error) {
			next(error);
		}
	}
}
