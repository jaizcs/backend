import request from 'supertest';
import { afterAll, describe, it } from 'vitest';
import { app } from '../app.js';
import { getSupabaseClient } from '../helpers/supabase.js';

const supabase = getSupabaseClient();

let userId;
let userAccessToken;

const user1 = {
	email: 'user.test.register@mail.com',
	password: 'usertest',
	name: 'test',
	role: 'admin',
};
const errorUser1 = {
	email: 'user.test5@mail.com',
	password: 'usertest',
	name: 'test',
	role: 'admin',
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
		it('409 error email alredy exist - should error create new User', async ({
			expect,
		}) => {
			const { body, status } = await request(app).post('/users').send(user1);

			expect(status).toBe(409);
			expect(body).toHaveProperty('message', 'Email alredy exist');
		});
		it('400 error email require', async ({ expect }) => {
			const { body, status } = await request(app).post('/users').send({
				password: 'usertest',
				name: 'test',
				role: 'admin',
			});
			expect(status).toBe(400);
		});
		it('400 error password require', async ({ expect }) => {
			const { body, status } = await request(app).post('/users').send({
				email: 'user.test5@mail.com',
				name: 'test',
				role: 'admin',
			});
			expect(status).toBe(400);
		});
		it('400 error name require', async ({ expect }) => {
			const { body, status } = await request(app).post('/users').send({
				email: 'user.test5@mail.com',
				password: 'usertest',
				role: 'admin',
			});
			expect(status).toBe(400);
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
		it('401 error wrong email - should erroruser login', async ({ expect }) => {
			const { body, status } = await request(app)
				.post('/users/tokens')
				.send(errorUser1);

			expect(status).toBe(401);
			expect(body).toHaveProperty('message', 'Wrong Email or Password');
		});
		it('401 error password - should erroruser login', async ({ expect }) => {
			const { body, status } = await request(app).post('/users/tokens').send({
				email: 'user.test.register@mail.com',
				password: 'usertest1',
				name: 'test',
				role: 'admin',
			});

			expect(status).toBe(401);
			expect(body).toHaveProperty('message', 'Wrong Email or Password');
		});
		it('400 error require email', async ({ expect }) => {
			const { body, status } = await request(app).post('/users/tokens').send({
				password: 'usertest',
			});
			expect(status).toBe(400);
		});
		it('400 error require password', async ({ expect }) => {
			const { body, status } = await request(app).post('/users/tokens').send({
				email: 'user.test5@mail.com',
			});
			expect(status).toBe(400);
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
		it('404 fetch my user data not found', async ({ expect }) => {
			const { body, status } = await request(app)
				.get(`/users/idyangsalah`)
				.set('authorization', userAccessToken);

			expect(status).toBe(404);
		});
	});
});
