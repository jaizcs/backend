/**
 * @typedef { import('../types').Request } Request
 * @typedef { import('../types').Response} Response
 * @typedef { import('../types').NextFunction} NextFunction
 */

// import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { generateToken } from '../helpers/jwt.js';
import axios from 'axios';

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
			const supabase = req.db;
			const {
				type,
				description,
				isSatisfactory,
				status,
				embedding,
				resolution,
			} = req.body;
			console.log(req.body);
			// console.log(supabase);
			// const openai = new OpenAI({
			// 	apiKey: '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',
			// });
			// // const openAi = new OpenAIApi(configuration);
			// console.log(req.body);
			// const embeddingResponse = await openai.createEmbedding({
			// 	model: 'text-embedding-ada-002',
			// 	description,
			// })

			// const [{ embedding }] = embeddingResponse.data.data
			// console.log(embedding);
			//+++++++++++++++++++++++++++++++++++++++++++++  versi axios +++++++++++++++++++++++++++++++++++
			// const apiKey = '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';

			// // Define the prompt for the text embedding
			// const prompt = `Generate an embedding for: ${description}`;

			// // Make a POST request to the GPT-3 API
			// const response = await axios.post(
			// 	'https://api.openai.com/v1/engines/davinci-codex/completions',
			// 	{
			// 		prompt,
			// 		max_tokens: 1, // To generate only one response
			// 	},
			// 	{
			// 		headers: {
			// 			'Content-Type': 'application/json',
			// 			'Authorization': `Bearer ${apiKey}`,
			// 		},
			// 	}
			// );
			// console.log(response);

			// const embedding = response.data.choices[0].text.trim();
			// console.log(embedding, "line 62");

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
}
