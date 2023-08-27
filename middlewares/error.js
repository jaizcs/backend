'use strict';

export const handleError = async (err, req, res, _next) => {
	console.log(err, 'dari eror handle');
  
	let statusCode = 500;
	let message = 'Internal server error';

	switch (err.name) {
		case 'requireEmail':
			statusCode = 400;
			message = 'Email harus diisi!';
			break;
		case 'requirePassword':
			statusCode = 400;
			message = 'Password harus diisi!';
			break;
		case 'requireName':
			statusCode = 400;
			message = 'Name harus diisi!';
			break;
		case 'InvalidUser':
			statusCode = 401;
			message = 'Email / Password Salah!';
			break;
		case 'userNotFound':
			statusCode = 404;
			message = 'User tidak ditemukan';
			break;
		case 'loginFirst':
			statusCode = 401;
			message = 'Harus login terlebih dahulu';
			break;
		default:
			break;
	}
	res.status(statusCode).json({
		message,
	});
};
