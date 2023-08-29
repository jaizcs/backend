import { app } from '../app.js';
import request from 'supertest';
import { createClient } from '@supabase/supabase-js';
import { afterAll, describe, beforeAll, it, beforeEach } from 'vitest';
import { generateToken } from '../helpers/jwt.js';
import { SUPABASE_SERVICE_KEY, SUPABASE_URL } from '../config.js';
import { getRedisClient } from '../helpers/redis.js';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
let userAccessToken;
let ticketAccessToken;
let ticketId;
let UserId;
let widgetToken;
let widgetId;
let widgetName = 'test';
let userAccessTokenError = generateToken({
	id: 'idyangsalah',
	email: 'wrong@gmail.com',
	role: 'authenticated',
	app_metadata: {
		type: 'user',
	},
});
let errTestTokenTicket;
let errTicketId;
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

		const { data: user } = await supabase
			.from('Users')
			.select('id,email,name,role,createdAt,updatedAt')
			.eq('role', 'admin');
		UserId = user[0].id;

		userAccessToken = generateToken({
			id: user[0].id,
			email: user[0].email,
			role: 'authenticated',
			app_metadata: {
				type: 'user',
			},
		});

		const { data: widget } = await supabase
			.from('WidgetTokens')
			.insert({
				token: token,
				UserId,
				name: widgetName,
			})
			.select()
			.single();

		widgetId = widget.id;
		widgetToken = widget.token;

		const { data: errTicket } = await supabase
			.from('Tickets')
			.insert({
				description: 'Ini test null ai',
				embedding: [0.0057168347],
				type: 'error',
			})
			.select('id')
			.single();
		errTicketId = errTicket.id;
		errTestTokenTicket = generateToken({
			id: errTicket.id,
			role: 'authenticated',
			app_metadata: {
				type: 'ticket',
			},
		});
	} catch (error) {
		console.log(error);
	}
});

afterAll(async () => {
	try {
		await supabase.from('Tickets').delete().eq('id', ticketId);
		await supabase.from('Tickets').delete().eq('id', errTicketId);
		await supabase.from('WidgetTokens').delete().eq('id', widgetId);
	} catch (error) {
		console.log(error);
	}
});

describe('Ticket Routes Test', () => {
	describe('POST /tickets - create new ticket', () => {
		it('201 Success create ticket - should create new Ticket', async ({
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
		it('400 internal server - should create new Ticket', async ({ expect }) => {
			const res = await request(app)
				.post('/tickets')
				.set('authorization', widgetToken);
			const { body, status } = res;

			expect(status).toBe(400);
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
		it('500 fail fetch ticket - should return Tickets', async ({ expect }) => {
			const { body, status } = await request(app)
				.get('/tickets')
				.set('authorization', userAccessTokenError);
			expect(status).toBe(500);
		});
	});

	describe('GET /tickets/:id/similarity-search - generate similar search resolution', () => {
		it('200  generate similar search resolution - should return resolution', async ({
			expect,
		}) => {
			const res = await request(app)
				.get(`/tickets/${ticketId}/similarity-search`)
				.set('authorization', ticketAccessToken);
			const { body, status } = res;

			expect(status).toBe(200);
		}, 20000);

		it('200  generate similar search null resolution - should return null', async ({
			expect,
		}) => {
			await getRedisClient().sadd('user:available', UserId);
			await getRedisClient().lpush('user:queue', UserId);

			const res = await request(app)
				.get(`/tickets/${errTicketId}/similarity-search`)
				.set('authorization', errTestTokenTicket);
			const { body, status } = res;

			expect(status).toBe(200);
		}, 20000);
	});
	describe('PATCH /tickets/:id - resolve resolution from ai', () => {
		it('200  patch resolution', async ({ expect }) => {
			const res = await request(app)
				.patch(`/tickets/${ticketId}`)
				.send({ resolution: 'best resolution ever' })
				.set('authorization', ticketAccessToken);
			const { body, status } = res;
			expect(status).toBe(200);
		}, 20000);
		it('400 invalid syntax', async ({ expect }) => {
			const res = await request(app)
				.patch(`/tickets/ticketIdGagal`)
				.send({ resolution: 'best resolution ever' })
				.set('authorization', ticketAccessToken);
			const { body, status } = res;
			expect(status).toBe(400);
		});
	});
});
