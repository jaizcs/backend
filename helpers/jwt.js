import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../config.js';

export function generateToken(payload, options) {
	return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token) {
	return jwt.verify(token, JWT_SECRET);
}
