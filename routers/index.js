import { Router } from 'express';

export const router = Router().get('/health-check', (_req, res, _next) => {
	res.set('content-type', 'text/plain').status(200).send('OK');
});
