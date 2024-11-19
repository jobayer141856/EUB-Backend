import { S3 } from 'aws-sdk';

export const s3 = new S3({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export const uploadFile = async (file) => {
	const params = {
		Bucket: process.env.AWS_BUCKET_NAME,
		Key: file.originalname,
		Body: file.buffer,
	};

	return s3.upload(params).promise();
};

export const deleteFile = async (file) => {
	const params = {
		Bucket: process.env.AWS_BUCKET_NAME,
		Key: file,
	};

	return s3.deleteObject(params).promise();
};
