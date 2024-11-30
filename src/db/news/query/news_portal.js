import { desc, eq } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createApi } from '../../../util/api.js';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { constructSelectAllQuery } from '../../variables.js';
import { news_portal } from '../schema.js';

const SERVER_URL = process.env.SERVER_URL;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { cover_image } = req.files;

	let cover_image_url = null;
	if (cover_image && cover_image.length > 0) {
		cover_image_url = path.join(
			'uploads',
			'cover_image',
			cover_image[0].filename
		);
	}

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
		.insert(news_portal)
		.values({
			uuid,
			title,
			subtitle,
			description,
			content,
			cover_image: cover_image_url,
			published_date,
			created_by,
			created_at,
			updated_at,
			remarks,
		})
		.returning({ insertedName: news_portal.title });

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

	const { cover_image } = req.files;

	let cover_imageString = null;
	if (cover_image && cover_image.length > 0) {
		cover_imageString = path.join(
			'uploads',
			'cover_image',
			cover_image[0].filename
		);
	}

	// delete the previous image from node local storage using fs
	if (cover_imageString) {
		const previousCoverImage = await db
			.select({ cover_image: news_portal.cover_image })
			.from(news_portal)
			.where(eq(news_portal.uuid, req.params.uuid));

		if (
			previousCoverImage.length > 0 &&
			previousCoverImage[0].cover_image
		) {
			const previousImagePath = path.join(
				__dirname,
				'../../../../',
				previousCoverImage[0].cover_image
			);
			console.log(previousImagePath);
			if (fs.existsSync(previousImagePath)) {
				fs.unlinkSync(previousImagePath);
				console.log('File deleted successfully');
			} else {
				console.log('File does not exist:', previousImagePath);
			}
		}
	}

	const cover_image_url = cover_imageString
		? cover_imageString
		: req.body.cover_image;

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
			cover_image: cover_image_url,
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
			status: 201,
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
	try {
		// also delete the cover_image from node local storage using fs
		const coverImage = await db
			.select({ cover_image: news_portal.cover_image })
			.from(news_portal)
			.where(eq(news_portal.uuid, req.params.uuid));

		console.log(coverImage);

		if (coverImage.length > 0 && coverImage[0].cover_image) {
			const deleteImagePath = path.join(
				__dirname,
				'../../../../',
				coverImage[0].cover_image
			);
			console.log(deleteImagePath);

			if (fs.existsSync(deleteImagePath)) {
				fs.unlinkSync(deleteImagePath);
				console.log('File deleted successfully');
			} else {
				console.log('File does not exist:', deleteImagePath);
			}
		}

		// delete the record from db
		const news_portalPromise = db
			.delete(news_portal)
			.where(eq(news_portal.uuid, req.params.uuid))
			.returning({ deletedName: news_portal.title });

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
			content: news_portal.content,
			description: news_portal.description,
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
		const resultPromiseForCount = news_portalPromise;

		const baseQuery = constructSelectAllQuery(
			news_portalPromise,
			req.query,
			'created_at',
			[hrSchema.users.name]
		);

		const pagination = {
			total_record: resultPromiseForCount.length,
			current_page: Number(req.query.page) || 1,
			total_page:
				Math.ceil(resultPromiseForCount.length / req.query.limit) || 1,
			next_page:
				Number(req.query.page) + 1 >
				Math.ceil(resultPromiseForCount.length / req.query.limit)
					? null
					: Number(req.query.page) + 1,
			prev_page: req.query.page - 1 <= 0 ? null : req.query.page - 1,
		};

		const data = await baseQuery;

		const newsItemsWithImageUrl = data.map((item) => ({
			...item,
			cover_image: item.cover_image
				? `${SERVER_URL}/${item.cover_image}`
				: null,
		}));

		const toast = {
			status: 200,
			type: 'select all',
			message: 'All news portal',
		};
		return await res.status(200).json({
			toast,
			data: newsItemsWithImageUrl,
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
			content: news_portal.content,
			description: news_portal.description,
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

		const newsItemsWithImageUrl = data.map((item) => ({
			...item,
			cover_image: item.cover_image
				? `${SERVER_URL}/${item.cover_image}`
				: null,
		}));

		const toast = {
			status: 200,
			type: 'select',
			message: 'News portal',
		};
		return await res
			.status(200)
			.json({ toast, data: newsItemsWithImageUrl[0] });
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
			content: news_portal.content,
			description: news_portal.description,
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
		.orderBy(desc(news_portal.created_at))
		.limit(10);

	try {
		const data = await news_portalPromise;

		const newsItemsWithImageUrl = data.map((item) => ({
			...item,
			cover_image: item.cover_image
				? `${SERVER_URL}/${item.cover_image}`
				: null,
		}));

		const toast = {
			status: 200,
			type: 'select',
			message: 'Latest post',
		};
		return await res
			.status(200)
			.json({ toast, data: newsItemsWithImageUrl });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function newsDetails(req, res, next) {
	if (!(await validateRequest(req, next))) return;
	try {
		const { news_portal_uuid } = req.params;
		const api = await createApi(req);

		const fetchData = async (endpoint) =>
			await api
				.get(`${endpoint}/${news_portal_uuid}`)
				.then((response) => response);

		const [news_portal, documents] = await Promise.all([
			fetchData('/news/news-portal'),
			fetchData('/news/documents-entry/by'),
		]);

		const response = {
			...news_portal?.data?.data,
			documents: documents?.data?.data || [],
		};

		const toast = {
			status: 200,
			type: 'select',
			message: 'News details',
		};

		return await res.status(200).json({ toast, data: response });
	} catch (error) {
		await handleError({ error, res });
	}
}
