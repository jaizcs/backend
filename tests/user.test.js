import request from 'supertest';
import { afterAll, describe } from 'vitest';

import { app } from '../app.js';
import { createSupabaseClient } from '../helpers/supabase.js';

const supabase = createSupabaseClient();

let userId;
const user1 = {
	email: 'user.test@mail.com',
	password: 'usertest',
	name: 'test',
	role: 'admin',
};

afterAll(async () => {
	try {
		await supabase.from('Users').delete().eq('email', user1.email);
	} catch (error) {
		console.log(error);
	}
});

describe('User Routes Test', () => {
	describe('POST /users - create new user', (test) => {
		test('201 Success register - should create new User', async ({
			expect,
		}) => {
			const res = await request(app).post('/users').send(user1);
			const { body, status } = res;

			userId = body.id;
			expect(status).toBe(201);
			expect(body).toHaveProperty('email', user1.email);
		});
	});

	describe('POST /users/tokens - user login', (test) => {
		test('200 Success login - should return access_token', async ({
			expect,
		}) => {
			const res = await request(app).post('/users/tokens').send(user1);
			const { body, status } = res;

			expect(status).toBe(200);
			expect(body).toHaveProperty('access_token', expect.any(String));
		});
	});

	describe('GET /users - fetch users', (test) => {
		test('200 fetch user - should return Users', async ({ expect }) => {
			const res = await request(app).get('/users');
			const { body, status } = res;
			expect(status).toBe(200);
			expect(Array.isArray(body)).toBeTruthy();
			expect(body.length).toBeGreaterThan(0);
		});
	});

	describe('GET /users - fetch user by id', (test) => {
		test('200 fetch user by id - should return User', async ({ expect }) => {
			const res = await request(app).get(`/users/${userId}`);
			const { body, status } = res;

			expect(status).toBe(200);
			expect(body).toHaveProperty('email', expect.any(String));
			expect(body).toHaveProperty('name', expect.any(String));
		});
	});
});
