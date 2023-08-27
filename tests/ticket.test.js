import { app } from '../app.js';
import request from 'supertest';
import { createClient } from '@supabase/supabase-js';
import { afterAll, describe, beforeAll } from 'vitest';
// const { generateToken } = require('../helpers/jwt.js');

import { SUPABASE_SERVICE_KEY, SUPABASE_URL } from '../config.js';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

let token;
let ticketId;
const Ticket = {
	type: 'technical issue',
	description:
		"What steps are involved in configuring my company's details and financial information using the accounting software?",
	resolution:
		"Configuring your company's details and financial information entails logging in to your account, accessing the 'Company Profile' or 'Settings' section, inputting essential company information, setting up accounts for various financial categories, configuring default currency and fiscal year, managing tax settings if applicable, adding bank accounts, and defining user access and permissions.",
	isSatisfactory: false,
	status: 'ongoing',
};

// +++++++++++++++++++++++++++++++++++++++++++++ widget version +++++++++++++++++++++++++++++++++++++++++++

beforeAll(async () => {
	try {
		const { data } = await supabase
			.from('Tickets')
			.insert({
				type: Ticket.type,
				description: Ticket.description,
				resolution: Ticket.name,
				isSatisfactory: Ticket.isSatisfactory,
				status: Ticket.status,
			})
			.select('id');
		// token = generateToken({
		// 	ticketId: data[0].id,
		// 	type: data.type
		// });
	} catch (error) {
		console.log(error);
	}
});

afterAll(async () => {
	try {
		await supabase.from('Ticket').delete().eq('type', Ticket.type);
	} catch (error) {
		console.log(error);
	}
});

describe('Ticket Routes Test', () => {
	describe('POST /createTicket - create new ticket', (test) => {
		test('201 Success create ticket - should create new Ticket', async ({
			expect,
		}) => {
			const res = await request(app).post('/createTicket').send(Ticket);
			const { body, status } = res;

			ticketId = body.id;
			expect(status).toBe(200);
			expect(body).toHaveProperty('access_token', expect.any(String));
		});
	});
});
