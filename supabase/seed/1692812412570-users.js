'use strict';

/**
 * @param { import('@supabase/supabase-js').SupabaseClient<any, 'public', any> } supabase
 **/
export const up = async (supabase) => {
	// insert data
	console.log('up');
};

/**
 * @param { import('@supabase/supabase-js').SupabaseClient<any, 'public', any> } supabase
 **/
export const down = async (supabase) => {
	// remove data
	console.log('down');
};
