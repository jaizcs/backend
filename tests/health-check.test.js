'use strict';

import { describe } from 'vitest';
import { agent } from 'supertest';

import { app } from '../app.js';

const request = agent(app);

describe('/health-check', (test) => {
	test('it should return OK', async ({ expect }) => {
		const response = await request.get('/health-check');

		expect(response.text).eq('OK');
	});
});
