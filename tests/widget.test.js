import { app } from '../app.js';
import request from 'supertest';
import { createClient } from '@supabase/supabase-js';
import { afterAll, beforeAll, describe } from 'vitest';

import { SUPABASE_SERVICE_KEY, SUPABASE_URL } from '../config.js';
import { hasingPassword } from '../helpers/hashing.js';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

let userId;
let access_token;
const user1 = {
	email: 'user.tes1@mail.com',
	password: 'usertest',
	name: 'test',
};
beforeAll(async () => {
	try {
		const hashPassword = hasingPassword(user1.password);
		const { data } = await supabase
			.from('Users')
			.insert({
				email: user1.email,
				password: hashPassword,
				name: user1.name,
				isAvaliable: false,
			})
			.select('id , email');
		userId = data[0].id;
	} catch (error) {
		console.log(error);
	}
});
afterAll(async () => {
	try {
		await supabase.from('WidgetTokens').delete().eq('UserId', userId);
		await supabase.from('Users').delete().eq('email', user1.email);
	} catch (error) {
		console.log(error);
	}
});

describe('POST /users/tokens - user login', (test) => {
	test('200 Success login - should return access_token', async ({ expect }) => {
		const res = await request(app).post('/users/tokens').send(user1);
		const { body, status } = res;

		expect(status).toBe(200);
		access_token = body.access_token;
	});
});
describe('POST /tokens - user create widget', (test) => {
	test('201 Success create widget - should return access_token', async ({
		expect,
	}) => {
		const res = await request(app)
			.post('/tokens')
			.set('access_token', access_token);
		const { body, status } = res;

		expect(status).toBe(201);
		expect(body).toHaveProperty('UserId', userId);
	});
});
describe('GET /tokens - fetch all Widget on users', (test) => {
	test('200 fetch Widget - should return Widgets', async ({ expect }) => {
		const res = await request(app)
			.get('/tokens')
			.set('access_token', access_token);
		const { body, status } = res;

		expect(status).toBe(200);
		expect(Array.isArray(body)).toBeTruthy();
		expect(body.length).toBeGreaterThan(0);
	});
});
