'use strict';

import OpenAI from 'openai';
import { OPENAI_API_KEY } from '../config';

let ai;

export const openai = (req, _res, next) => {
	try {
		if (!ai) {
			ai = new OpenAI({
				apiKey: OPENAI_API_KEY,
			});
		}

		req.ai = ai;
		next();
	} catch (err) {
		next(err);
	}
};
