import {
	DeleteObjectCommand,
	PutObjectCommand,
	S3Client,
} from '@aws-sdk/client-s3';

export const s3Client = new S3Client({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	},
});

export const uploadFile = async ({ file, folder = '' }) => {
	const key = `${folder}${file.originalname}`;
	const params = {
		Bucket: process.env.AWS_BUCKET_NAME,
		Key: key,
		Body: file.buffer,
		ACL: 'public-read', // Set ACL to public-read
		ContentType: file.mimetype,
	};

	try {
		await s3Client.send(new PutObjectCommand(params));
		const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
		return url;
	} catch (err) {
		console.error(err);
		throw err;
	}
};

export const deleteFile = async ({ filename, folder = '' }) => {
	const key = `${folder}${filename}`;
	const params = {
		Bucket: process.env.AWS_BUCKET_NAME,
		Key: key,
	};

	try {
		const data = await s3Client.send(new DeleteObjectCommand(params));
		return data;
	} catch (err) {
		console.error(err);
		throw err;
	}
};

export const getFile = async ({ folder = '', filename }) => {
	const key = `${folder}${filename}`;
	const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

	try {
		console.log('File URL:', url);
		return url;
	} catch (err) {
		console.error(err);
		throw err;
	}
};
