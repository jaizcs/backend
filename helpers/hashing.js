import bcrypt from 'bcrypt';

export const hasingPassword = (password) => {
	let salt = bcrypt.genSaltSync(10);
	let hash = bcrypt.hashSync(password, salt);
	return hash;
};

export const comparePassword = (password, passwordDB) => {
	return bcrypt.compareSync(password, passwordDB);
};
