import { compare, genSalt, hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PRIVATE_KEY, SALT } from '../lib/secret.js';

const { sign, verify } = jwt;

export const HashPass = async (password) => {
	const salt = await genSalt(Number(SALT));
	const hashPassword = await hash(password.toString(), parseInt(salt));
	return hashPassword;
};

export const ComparePass = async (password, hashPassword) => {
	return await compare(password, hashPassword);
};

export const CreateToken = (user, time = '24h') => {
	const { uuid, name, email, department } = user;
	const payload = {
		uuid,
		name,
		email,
		department,
	};

	const token = sign(payload, PRIVATE_KEY, { expiresIn: time });

	if (!token)
		return {
			success: false,
			error: 'Error Signing Token',
			raw: err,
		};

	user.token = token;
	return {
		success: true,
		token: token,
	};
};

export const VerifyToken = (req, res, next) => {
	// * no need to verify token for login, api-docs, and public files
	const { originalUrl, method } = req;
	if (
		(originalUrl === '/hr/user/login' && method === 'POST') ||
		originalUrl.startsWith('/api-docs') ||
		originalUrl.startsWith('/public') ||
		originalUrl.startsWith('/news')
	) {
		return next();
	}

	// * get token from headers or query
	const { authorization } = req?.headers;
	const { token: uploadToken } = req?.query;
	const token = uploadToken || authorization?.split(' ')[1];

	if (typeof token === 'undefined') {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	verify(token, PRIVATE_KEY, (err, user) => {
		if (err) {
			return res.status(403).json({ error: 'Forbidden' });
		}

		req.user = user;

		next();
	});
};
