import {
	DeleteObjectCommand,
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	},
});

export const uploadFile = async (file, folder) => {
	const key = `${folder}/${file.originalname}`;
	const params = {
		Bucket: process.env.AWS_BUCKET_NAME,
		Key: key,
		Body: file.buffer,
	};

	try {
		const data = await s3Client.send(new PutObjectCommand(params));
		return file.originalname;
	} catch (err) {
		console.error(err);
		throw err;
	}
};

export const deleteFile = async (file, folder) => {
	const key = `${folder}/${file.originalname}`;
	const params = {
		Bucket: process.env.AWS_BUCKET_NAME,
		Key: key,
	};

	try {
		const data = await s3Client.send(new DeleteObjectCommand(params));
		return file.originalname;
	} catch (err) {
		console.error(err);
		throw err;
	}
};

export const getFile = async ({ folder = '', fileKey }) => {
	const params = {
		Bucket: process.env.AWS_BUCKET_NAME,
		Key: `${folder}${fileKey}`,
	};

	try {
		const command = new GetObjectCommand(params);
		const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour
		console.log('File URL:', url);
		return url;
	} catch (err) {
		console.error(err);
		throw err;
	}
};
