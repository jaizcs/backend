import { app } from '../app.js';
import request from 'supertest';
import { createClient } from '@supabase/supabase-js';
import { afterAll, beforeAll, describe } from 'vitest';

import { SUPABASE_SERVICE_KEY, SUPABASE_URL } from '../config.js';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

let ticketId;
beforeAll(async () => {
	try {
		const { data } = await supabase
			.from('Tickets')
			.insert({
				type: 'issue',
				description: 'pertanyaan coba coba',
			})
			.select('id')
			.single();

		ticketId = data.id;
	} catch (error) {
		console.log(error);
	}
});

afterAll(async () => {
	try {
		await supabase.from('Tickets').delete().eq('id', ticketId);
	} catch (error) {
		console.log(error);
	}
});

describe('POST /tickets/:id/resolutions - generate resolution', (test) => {
	test('200 Success generate resolution', async ({ expect }) => {
		const res = await request(app).post(`/ticket/${ticketId}/resolutions`);
		const { body, status } = res;

		expect(status).toBe(200);
	});
});
