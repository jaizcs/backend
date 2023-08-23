'use strict';

import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

import { SUPABASE_SERVICE_KEY, SUPABASE_URL } from '../config.js';

const [command, ...args] = process.argv.slice(2);

const seedTemplate = `
'use strict'

/** 
 * @param { import('@supabase/supabase-js').SupabaseClient<any, 'public', any> } supabase
 **/
export const up = async (supabase) => {
	// insert data
}

/** 
 * @param { import('@supabase/supabase-js').SupabaseClient<any, 'public', any> } supabase
 **/
export const down = async (supabase) => {
	// remove data
}
`;
switch (command) {
	case 'seed': {
		const [name] = args;

		if (/[^a-zA-Z1-9-_]/.test(name)) {
			console.error(
				'ERROR: Seed name may only contains lowercase and uppercase letter, number, dash, and underscore',
			);
			process.exit(1);
		}

		const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
			auth: {
				autoRefreshToken: false,
				persistSession: false,
			},
		});

		const seedPaths = fs.readdirSync(
			path.resolve(process.cwd(), 'supabase/seed'),
			{ encoding: 'utf-8' },
		);

		const seedPath = seedPaths.find((seedPath) =>
			RegExp(`^\\d+-${name}\\.js$`).test(seedPath),
		);

		if (!seedPath) {
			console.error(`ERROR: ${name} seed does not exist`);
			process.exit(1);
		}

		const { up } = await import(
			path.resolve(process.cwd(), 'supabase/seed', seedPath)
		);
		await up(supabase);

		break;
	}
	case 'seed:all': {
		const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
			auth: {
				autoRefreshToken: false,
				persistSession: false,
			},
		});

		const seedPaths = fs.readdirSync(
			path.resolve(process.cwd(), 'supabase/seed'),
			{ encoding: 'utf-8' },
		);

		for (const seedPath of seedPaths.reverse()) {
			const { up } = await import(
				path.resolve(process.cwd(), 'supabase/seed', seedPath)
			);
			await up(supabase);
		}

		break;
	}
	case 'seed:undo': {
		const [name] = args;

		if (/[^a-zA-Z1-9-_]/.test(name)) {
			console.error(
				'ERROR: Seed name may only contains lowercase and uppercase letter, number, dash, and underscore',
			);
			process.exit(1);
		}

		const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
			auth: {
				autoRefreshToken: false,
				persistSession: false,
			},
		});

		const seedPaths = fs.readdirSync(
			path.resolve(process.cwd(), 'supabase/seed'),
			{ encoding: 'utf-8' },
		);

		const seedPath = seedPaths.find((seedPath) =>
			RegExp(`^\\d+-${name}\\.js$`).test(seedPath),
		);

		if (!seedPath) {
			console.error(`ERROR: ${name} seed does not exist`);
			process.exit(1);
		}

		const { down } = await import(
			path.resolve(process.cwd(), 'supabase/seed', seedPath)
		);
		await down(supabase);

		break;
	}
	case 'seed:undo:all': {
		const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
			auth: {
				autoRefreshToken: false,
				persistSession: false,
			},
		});

		const seedPaths = fs.readdirSync(
			path.resolve(process.cwd(), 'supabase/seed'),
			{ encoding: 'utf-8' },
		);

		for (const seedPath of seedPaths) {
			const { down } = await await import(
				path.resolve(process.cwd(), 'supabase/seed', seedPath)
			);
			await down(supabase);
		}

		break;
	}
	case 'seed:create': {
		const [name] = args;

		if (/[^a-zA-Z1-9-_]/.test(name)) {
			console.error(
				'ERROR: Seed name may only contains lowercase and uppercase letter, number, dash, and underscore',
			);
			process.exit(1);
		}

		fs.writeFileSync(
			path.resolve(process.cwd(), `supabase/seed/${Date.now()}-${name}.js`),
			seedTemplate.trim(),
			{
				encoding: 'utf-8',
			},
		);

		break;
	}
	case 'help':
	default:
		console.log('');
		console.log('COMMANDS:');
		console.log('');
		console.log('npm run db:seed <name>');
		console.log('npm run db:seed:all');
		console.log('npm run db:seed:undo <name>');
		console.log('npm run db:seed:undo:all');
		console.log('npm run db:seed:create <name>');
}
