import request from 'supertest';
import { afterAll, describe, it, beforeAll } from 'vitest';
import { app } from '../app.js';
import { getSupabaseClient } from '../helpers/supabase.js';
import { generateToken } from '../helpers/jwt.js';

const supabase = getSupabaseClient();

let userId;
let userAccessToken;

const user1 = {
	email: 'user.test@mail.com',
	password: 'usertest',
	name: 'test',
	role: 'admin',
};

beforeAll(async () => {
	try {
		const { data: user } = await supabase
			.from('Users')
			.insert(user1)
			.select('id,email,name,role')
			.single();
		userAccessToken = generateToken({
			id: user.id,
			email: user.email,
			role: 'authenticated',
			app_metadata: {
				type: 'user',
			},
		});
		userId = user.id;
	} catch (err) {
		console.log(err);
	}
});

afterAll(async () => {
	try {
		await supabase.from('Users').delete().eq('email', user1.email);
	} catch (err) {
		console.log(err);
	}
});

describe('User Routes Test', () => {
	describe('POST /user-queue - create new user-queue', () => {
		it('201 Success create new user-queue - should create new user-queue', async ({
			expect,
		}) => {
			const { body, status } = await request(app)
				.post('/user-queue')
				.set('authorization', userAccessToken);
			expect(status).toBe(200);
		});
		it('400 user alredy in queue', async ({ expect }) => {
			const { body, status } = await request(app)
				.post('/user-queue')
				.set('authorization', userAccessToken);
			expect(status).toBe(400);
		});
	});
});

describe('User Routes Test', () => {
	describe('GET /user-queue - create new user', () => {
		it('200 Success get user-in-queue', async ({ expect }) => {
			const { body, status } = await request(app)
				.get('/user-queue')
				.set('authorization', userAccessToken);
			expect(status).toBe(200);
			expect(body).toHaveProperty('isAvailable', true);
		});
	});
});

describe('User-queue Routes Test', () => {
	describe('delete /user-queue', () => {
		it('200 Success delete user from queue', async ({ expect }) => {
			const { body, status } = await request(app)
				.delete('/user-queue')
				.set('authorization', userAccessToken);
			expect(status).toBe(200);
		});
		it('404 User not found in queue', async ({ expect }) => {
			const { body, status } = await request(app)
				.delete('/user-queue')
				.set('authorization', userAccessToken);
			expect(status).toBe(404);
		});
		it('200 user not available', async ({ expect }) => {
			const { body, status } = await request(app)
				.get('/user-queue')
				.set('authorization', userAccessToken);
			expect(status).toBe(200);
			expect(body).toHaveProperty('isAvailable', false);
		});
	});
});
