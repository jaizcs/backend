import { app } from '../app.js';
import request from 'supertest';
import { createClient } from '@supabase/supabase-js';
import { afterAll, describe } from 'vitest';

import { SUPABASE_SERVICE_KEY, SUPABASE_URL } from '../config.js';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

let ticketAccessToken;
let ticketId;

const Ticket = {
	type: 'technical issue',
	description:
		"What steps are involved in configuring my company's details and financial information using the accounting software?",
	resolution:
		"Configuring your company's details and financial information entails logging in to your account, accessing the 'Company Profile' or 'Settings' section, inputting essential company information, setting up accounts for various financial categories, configuring default currency and fiscal year, managing tax settings if applicable, adding bank accounts, and defining user access and permissions.",
	isSatisfactory: false,
	status: 'in progress',
};

afterAll(async () => {
	try {
		await supabase.from('Tickets').delete().eq('type', Ticket.type);
	} catch (error) {
		console.log(error);
	}
});

describe('Ticket Routes Test', () => {
	describe('POST /createTicket - create new ticket', (test) => {
		test('201 Success create ticket - should create new Ticket', async ({
			expect,
		}) => {
			const res = await request(app).post('/tickets').send(Ticket);
			const { body, status } = res;

			expect(status).toBe(201);
			expect(body).toHaveProperty('accessToken', expect.any(String));

			ticketAccessToken = body.accessToken;
			ticketId = body.id;
		});
	});
});
