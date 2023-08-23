import type {
	NextFunction,
	Request as ExpressRequest,
	Response,
} from 'express';
import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database } from './supabase/types';

type Request = ExpressRequest & {
	db: SupabaseClient<Database, 'public', Database['public']>;
};

export type { NextFunction, Request, Response };
