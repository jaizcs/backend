'use strict';

import cors from 'cors';
import express from 'express';

import { authenticate } from './middlewares/auth.js';
import { handleError } from './middlewares/error.js';
import { openai } from './middlewares/openai.js';
import { redis } from './middlewares/redis.js';
import { supabase } from './middlewares/supabase.js';
import { router } from './routers/index.js';

export const app = express()
	.use(cors())
	.use(express.json())
	.use(express.urlencoded({ extended: true }))
	.use(openai)
	.use(redis)
	.use(supabase)
	.use(authenticate)
	.use(router)
	.use(handleError);
