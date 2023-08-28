import request from 'supertest';
import { afterAll, describe, it } from 'vitest';

import { app } from '../app.js';
import { createSupabaseClient } from '../helpers/supabase.js';

const supabase = createSupabaseClient();

let userId;
let userAccessToken;

const user1 = {
	email: 'user.test@mail.com',
	password: 'usertest',
	name: 'test',
	role: 'staff',
};

afterAll(async () => {
	try {
		await supabase.from('Users').delete().eq('email', user1.email);
	} catch (err) {
		console.log(err);
	}
});

describe('User Routes Test', () => {
	describe('POST /users - create new user', () => {
		it('201 Success register - should create new User', async ({ expect }) => {
			const { body, status } = await request(app).post('/users').send(user1);

			expect(status).toBe(201);
			expect(body).toHaveProperty('email', user1.email);

			userId = body.id;
		});
	});

	describe('POST /users/tokens - user login', () => {
		it('200 Success login - should return access token', async ({ expect }) => {
			const { body, status } = await request(app)
				.post('/users/tokens')
				.send(user1);

			expect(status).toBe(200);
			expect(body).toHaveProperty('accessToken', expect.any(String));

			userAccessToken = body.accessToken;
		});
	});

	describe('GET /users - fetch users', () => {
		it('200 fetch user - should return Users', async ({ expect }) => {
			const { body, status } = await request(app)
				.get('/users')
				.set('authorization', userAccessToken);

			expect(status).toBe(200);
			expect(Array.isArray(body)).toBeTruthy();
			expect(body.length).toBeGreaterThan(0);
		});
	});

	describe('GET /users/me - fetch my user data', () => {
		it('200 fetch my user data - should return my data user', async ({
			expect,
		}) => {
			const { body, status } = await request(app)
				.get(`/users/me`)
				.set('authorization', userAccessToken);

			expect(status).toBe(200);
			expect(body).toHaveProperty('email', expect.any(String));
			expect(body).toHaveProperty('name', expect.any(String));
		});
	});

	describe('GET /users - fetch user by id', () => {
		it('200 fetch user by id - should return User', async ({ expect }) => {
			const { body, status } = await request(app)
				.get(`/users/${userId}`)
				.set('authorization', userAccessToken);

			expect(status).toBe(200);
			expect(body).toHaveProperty('email', expect.any(String));
			expect(body).toHaveProperty('name', expect.any(String));
			expect(body).toHaveProperty('role', expect.any(String));
		});
	});
});
