import { app } from '../app.js';
import request from 'supertest';
import { createClient } from '@supabase/supabase-js';
import { afterAll, describe, beforeAll, it } from 'vitest';
import { generateToken } from '../helpers/jwt.js';
import { SUPABASE_SERVICE_KEY, SUPABASE_URL } from '../config.js';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
let userAccessToken;
let ticketAccessToken;
let ticketId;
let UserId;
let widgetToken;
let widgetName = 'test';

const Ticket = {
	type: 'technical issue',
	description:
		"What steps are involved in configuring my company's details and financial information using the accounting software?",
	resolution:
		"Configuring your company's details and financial information entails logging in to your account, accessing the 'Company Profile' or 'Settings' section, inputting essential company information, setting up accounts for various financial categories, configuring default currency and fiscal year, managing tax settings if applicable, adding bank accounts, and defining user access and permissions.",
	isSatisfactory: false,
	status: 'in progress',
	UserId: UserId,
};
beforeAll(async () => {
	try {
		const token = generateToken({
			role: 'anon',
			app_metadata: {
				type: 'widget',
			},
		});
		console.log(token, 'line 37');

		const { data: user } = await supabase
			.from('Users')
			.select('id,email,name,role,createdAt,updatedAt')
			.eq('role', 'admin')
			.single();
		console.log(user.id, 'line 40');
		UserId = user.id;

		userAccessToken = generateToken({
			id: user.id,
			email: user.email,
			role: 'authenticated',
			app_metadata: {
				type: 'user',
			},
		});
		console.log(userAccessToken, 'line53');

		const { data: widget } = await supabase
			.from('WidgetTokens')
			.insert({
				token: token,
				UserId,
				name: widgetName,
			})
			.select()
			.single();

		ticketId = widget.id;
		widgetToken = widget.token;
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

describe('Ticket Routes Test', () => {
	describe('POST /tickets - create new ticket', (test) => {
		test('201 Success create ticket - should create new Ticket', async ({
			expect,
		}) => {
			const res = await request(app)
				.post('/tickets')
				.send(Ticket)
				.set('authorization', widgetToken);
			const { body, status } = res;

			expect(status).toBe(201);
			expect(body).toHaveProperty('accessToken', expect.any(String));
			ticketAccessToken = body.accessToken;
			ticketId = body.id;
		});
	});

	describe('GET /tickets - fetch tickets', () => {
		it('200 fetch ticket - should return Tickets', async ({ expect }) => {
			const { body, status } = await request(app)
				.get('/tickets')
				.set('authorization', userAccessToken);
			expect(status).toBe(200);
			expect(Array.isArray(body.data)).toBeTruthy();
			expect(body.data.length).toBeGreaterThan(0);
		});
	});
});
