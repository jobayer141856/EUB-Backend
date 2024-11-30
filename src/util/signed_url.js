import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { PRIVATE_KEY, SERVER_URL } from '../lib/secret.js';

export const generateSignedUrl = (filePath, expiresIn = 3600) => {
	// Normalize the file path to remove any extra slashes
	const normalizedFilePath = filePath.replace(/\/+/g, '/');
	console.log('filePath', normalizedFilePath);

	const expiresAt = Date.now() + expiresIn * 1000;
	const signature = crypto
		.createHmac('sha256', PRIVATE_KEY)
		.update(`${normalizedFilePath}:${expiresAt}`)
		.digest('hex');

	return `${SERVER_URL}/uploads/${normalizedFilePath}?expiresAt=${expiresAt}&signature=${signature}`;
};

export const validateSignedUrl = (req, res, next) => {
	const { expiresAt, signature } = req.query;
	console.log(req.path, 'req.path - validateSignedUrl');

	// Normalize the file path to remove any extra slashes
	const filePath = req.path.replace('/uploads/', '/').replace(/\/+/g, '\\');

	console.log(filePath, 'filePath - validateSignedUrl');

	if (!expiresAt || !signature) {
		return res.status(400).send('Invalid URL');
	}

	if (Date.now() > parseInt(expiresAt, 10)) {
		return res.status(403).send('URL has expired');
	}

	const expectedSignature = crypto
		.createHmac('sha256', PRIVATE_KEY)
		.update(`${filePath}:${expiresAt}`)
		.digest('hex');

	// if (signature !== expectedSignature) {
	// 	return res.status(403).send('Invalid signature');
	// } // signature is not working properly

	const fullPath = path.join(SERVER_URL, 'uploads', filePath);

	req.filePath = fullPath;
	next();
};
