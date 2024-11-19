import { desc, eq } from 'drizzle-orm';
import { deleteFile, getFile, uploadFile } from '../../../util/aws.js';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { constructSelectAllQuery } from '../../variables.js';
import { news_portal } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	// aws upload file
	// document may have multiple files
	// cover_image may have only one file
	const { document, cover_image } = req.files;

	const documentPromise = await Promise.all(
		document.map(async (file) => {
			const filename = await uploadFile({
				file,
				folder: 'document/',
			});
			return filename;
		})
	);

	const cover_imagePromise = await uploadFile({
		file: cover_image[0],
		folder: 'cover_image/',
	});

	// join all the document file name with comma and insert into db
	const documentString = documentPromise.join(',');
	const cover_imageString = cover_imagePromise;

	const {
		uuid,
		title,
		subtitle,
		description,
		content,
		published_date,
		created_by,
		created_at,
		updated_at,
		remarks,
	} = req.body;

	const news_portalPromise = db.insert(news_portal).values({
		uuid,
		title,
		subtitle,
		description,
		content,
		document: documentString,
		cover_image: cover_imageString,
		published_date,
		created_by,
		created_at,
		updated_at,
		remarks,
	});

	try {
		const data = await news_portalPromise;
		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].insertedName} inserted`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		next(error);
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	// aws upload file
	// document may have multiple files
	// cover_image may have only one file
	const { document, cover_image } = req.files;

	// check if the file already exist in the db
	const news_portalPromiseForCheck = db
		.select({
			document: news_portal.document,
			cover_image: news_portal.cover_image,
		})
		.from(news_portal)
		.where(eq(news_portal.uuid, req.params.uuid));

	const { document: oldDocument, cover_image: oldCoverImage } =
		await news_portalPromiseForCheck;

	// Upload new document files only
	const documentPromise = await Promise.all(
		document.map(async (file) => {
			if (!oldDocument.includes(file.originalname)) {
				const filename = await uploadFile(file, 'document/');
				return filename;
			}
			return null;
		})
	);

	// Filter out null values
	const newDocumentFiles = documentPromise.filter((file) => file !== null);

	// Upload new cover image file only if it is different
	let coverImagePromise = oldCoverImage;
	if (cover_image[0].originalname !== oldCoverImage) {
		coverImagePromise = await uploadFile(cover_image[0], 'cover_image/');
	}

	// join all the document file name with comma and insert into db
	const documentString = documentPromise.join(',');
	const cover_imageString = coverImagePromise;

	const {
		uuid,
		title,
		subtitle,
		description,
		content,
		published_date,
		created_by,
		created_at,
		updated_at,
		remarks,
	} = req.body;

	const news_portalPromise = db
		.update(news_portal)
		.set({
			uuid,
			title,
			subtitle,
			description,
			content,
			document: documentString,
			cover_image: cover_imageString,
			published_date,
			created_by,
			created_at,
			updated_at,
			remarks,
		})
		.where(eq(news_portal.uuid, req.params.uuid))
		.returning({ updatedName: news_portal.title });

	try {
		const data = await news_portalPromise;
		const toast = {
			status: 200,
			type: 'update',
			message: `${data[0].updatedName} updated`,
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	// check if the file already exist in the db
	const news_portalPromiseForCheck = db
		.select({
			document: news_portal.document,
			cover_image: news_portal.cover_image,
		})
		.from(news_portal)
		.where(eq(news_portal.uuid, req.params.uuid));

	const { document: oldDocument, cover_image: oldCoverImage } =
		await news_portalPromiseForCheck;

	// delete the file from aws s3
	const documentPromise = await Promise.all(
		oldDocument.split(',').map(async (file) => {
			const filename = await deleteFile({
				filename: file,
				folder: 'document/',
			});
			return filename;
		})
	);

	const cover_imagePromise = await deleteFile({
		filename: oldCoverImage,
		folder: 'cover_image/',
	});

	// delete the record from db
	const news_portalPromise = db
		.delete(news_portal)
		.where(eq(news_portal.uuid, req.params.uuid))
		.returning({ deletedName: news_portal.title });

	try {
		const data = await news_portalPromise;
		const toast = {
			status: 200,
			type: 'delete',
			message: `${data[0].deletedName} deleted`,
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const news_portalPromise = db
		.select({
			uuid: news_portal.uuid,
			title: news_portal.title,
			subtitle: news_portal.subtitle,
			description: news_portal.description,
			document: news_portal.document,
			cover_image: news_portal.cover_image,
			published_date: news_portal.published_date,
			created_by: news_portal.created_by,
			created_by_name: hrSchema.users.name,
			created_at: news_portal.created_at,
			updated_at: news_portal.updated_at,
			remarks: news_portal.remarks,
		})
		.from(news_portal)
		.leftJoin(
			hrSchema.users,
			eq(news_portal.created_by, hrSchema.users.uuid)
		)
		.orderBy(desc(news_portal.created_at));

	try {
		const resultPromiseForCount = await news_portalPromise;

		// get files from aws s3
		const document_files = await Promise.all(
			resultPromiseForCount.map(async (news) => {
				const file = await getFile({
					filename: news.document,
					folder: 'document/',
				});
				return file;
			})
		);

		const cover_image_files = await Promise.all(
			resultPromiseForCount.map(async (news) => {
				const file = await getFile({
					filename: news.cover_image,
					folder: 'cover_image/',
				});
				return file;
			})
		);

		resultPromiseForCount.forEach((news, index) => {
			news.document = document_files[index];
			news.cover_image = cover_image_files
				? cover_image_files[index]
				: null;
		});

		const baseQuery = constructSelectAllQuery(
			resultPromiseForCount,
			req.query,
			'created_at',
			[hrSchema.users.name]
		);

		const pagination = {
			total_record: resultPromiseForCount.length,
			current_page: Number(req.query.page) || 1,
			total_page: Math.ceil(
				resultPromiseForCount.length / req.query.limit
			),
			next_page:
				Number(req.query.page) + 1 >
				Math.ceil(resultPromiseForCount.length / req.query.limit)
					? null
					: Number(req.query.page) + 1,
			prev_page: req.query.page - 1 <= 0 ? null : req.query.page - 1,
		};

		const data = await baseQuery;

		const toast = {
			status: 200,
			type: 'select all',
			message: 'All news portal',
		};
		return await res.status(200).json({
			toast,
			data,
			pagination,
		});
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const news_portalPromise = db
		.select({
			uuid: news_portal.uuid,
			title: news_portal.title,
			subtitle: news_portal.subtitle,
			description: news_portal.description,
			document: news_portal.document,
			cover_image: news_portal.cover_image,
			published_date: news_portal.published_date,
			created_by: news_portal.created_by,
			created_by_name: hrSchema.users.name,
			created_at: news_portal.created_at,
			updated_at: news_portal.updated_at,
			remarks: news_portal.remarks,
		})
		.from(news_portal)
		.leftJoin(
			hrSchema.users,
			eq(news_portal.created_by, hrSchema.users.uuid)
		)
		.where(eq(news_portal.uuid, req.params.uuid));

	try {
		const data = await news_portalPromise;

		// get files from aws s3
		const document_files = await getFile({
			filename: data[0].document,
			folder: 'document/',
		});

		const cover_image_files = await getFile({
			filename: data[0].cover_image,
			folder: 'cover_image/',
		});

		data[0].document = document_files;
		data[0].cover_image = cover_image_files ? cover_image_files : null;

		const toast = {
			status: 200,
			type: 'select',
			message: 'News portal',
		};
		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function latestPost(req, res, next) {
	const news_portalPromise = db
		.select({
			uuid: news_portal.uuid,
			title: news_portal.title,
			subtitle: news_portal.subtitle,
			description: news_portal.description,
			cover_image: news_portal.cover_image,
			published_date: news_portal.published_date,
			created_by: news_portal.created_by,
			created_at: news_portal.created_at,
			updated_at: news_portal.updated_at,
			remarks: news_portal.remarks,
		})
		.from(news_portal)
		.orderBy(desc(news_portal.created_at))
		.limit(10);

	try {
		const data = await news_portalPromise;

		// get files from aws s3
		const cover_image_files = await Promise.all(
			data.map(async (news) => {
				const file = await getFile({
					filename: news.cover_image,
					folder: 'cover_image/',
				});
				return file;
			})
		);

		data.forEach((news, index) => {
			news.cover_image = cover_image_files[index];
		});

		const toast = {
			status: 200,
			type: 'select',
			message: 'Latest post',
		};
		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}
