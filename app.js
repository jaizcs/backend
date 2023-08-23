'use strict';

import cors from 'cors';
import express from 'express';

import { handleError } from './middlewares/error.js';
import { supabase } from './middlewares/supabase.js';
import { router } from './routers/index.js';

export const app = express()
	.use(cors())
	.use(express.json())
	.use(express.urlencoded({ extended: true }))
	.use(supabase())
	.use(router)
	.use(handleError);
