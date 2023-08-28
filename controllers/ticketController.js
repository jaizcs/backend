/**
 * @typedef { import('../types').Request } Request
 * @typedef { import('../types').Response} Response
 * @typedef { import('../types').NextFunction} NextFunction
 */

// import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { generateToken } from '../helpers/jwt.js';

// import { supabaseClient } from './lib/supabase';

export class ticketController {
	/**
	 *
	 * @param { Request } req
	 * @param { Response } res
	 * @param { NextFunction } next
	 */

	static async createTicket(req, res, next) {
		try {
			const { type, description, isSatisfactory, status, resolution } =
				req.body;
			console.log(req.body);

			const openai = new OpenAI({
				apiKey: process.env.OPENAI_API_KEY,
			});
			const embedding = await openai.embeddings.create({
				model: 'text-embedding-ada-002',
				input: description,
			});
			// // const [{ embedding }] = embeddingResponse.data.data
			console.log(embedding.data[0].embedding);
			const newEmbed = embedding.data[0].embedding;
			const { data } = await req.db
				.from('Tickets')
				.insert({
					description,
					isSatisfactory,
					status,
					embedding: newEmbed,
					resolution,
					type,
				})
				.select('id')
				.single();
			console.log(data, 'line 77');

			const token = generateToken({
				id: data.id,
				type: 'ticket',
			});

			// console.log(token);

			res.status(201).json({
				access_token: token,
				data,
			});
		} catch (error) {
			console.log(error);
			next(error);
		}
	}
}
