import jwt from 'jsonwebtoken';
const SECRET = 'secret';

export function generateToken(payload) {
	return jwt.sign(payload, SECRET);
}
export function verifyToken(token) {
	return jwt.verify(token, SECRET);
}
