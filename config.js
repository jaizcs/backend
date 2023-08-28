'use strict';

import { config } from 'dotenv';
import invariant from 'tiny-invariant';

config();

invariant(
	process.env.JWT_SECRET,
	'JWT_SECRET environment variable is required',
);
invariant(
	process.env.OPENAI_API_KEY,
	'OPENAI_API_KEY environment variable is required',
);
invariant(
	process.env.SUPABASE_SERVICE_KEY,
	'SUPABASE_SERVICE_KEY environment variable is required',
);
invariant(
	process.env.SUPABASE_URL,
	'SUPABASE_URL environment variable is required',
);

export const JWT_SECRET = process.env.JWT_SECRET;
export const PORT = Number(process.env.PORT) || 4000;
export const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
export const SUPABASE_URL = process.env.SUPABASE_URL;
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
