import { desc, eq } from 'drizzle-orm';
import multer from 'multer';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { constructSelectAllQuery } from '../../variables.js';
import { news_portal } from '../schema.js';

// Configure multer for file uploads
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/');
	},
	filename: function (req, file, cb) {
		cb(null, `${Date.now()}-${file.originalname}`);
	},
});

const upload = multer({ storage: storage });

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	upload.fields([
		{ name: 'cover_image', maxCount: 1 },
		{ name: 'documents', maxCount: 10 },
	])(req, res, async function (err) {
		if (err) {
			return next(err);
		}

		if (!(await validateRequest(req, next))) return;

		const {
			uuid,
			id,
			title,
			sub_title,
			date,
			description,
			short_description,
			created_by,
			created_at,
			updated_at,
			remarks,
		} = req.body;

		const cover_image = req.files['cover_image']
			? req.files['cover_image'][0].path
			: null;
		const documents = req.files['documents']
			? req.files['documents'].map((file) => file.path)
			: [];

		const news_portalPromise = db.insert(news_portal).values({
			uuid,
			id,
			title,
			sub_title,
			date,
			cover_image,
			documents: JSON.stringify(documents),
			description,
			short_description,
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
	});
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const {
		uuid,
		id,
		title,
		sub_title,
		date,
		document,
		description,
		short_description,
		created_by,
		created_at,
		updated_at,
		remarks,
	} = req.body;

	const news_portalPromise = db
		.update(news_portal)
		.set({
			uuid,
			id,
			title,
			sub_title,
			date,
			document,
			description,
			short_description,
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
			id: news_portal.id,
			title: news_portal.title,
			sub_title: news_portal.sub_title,
			cover_image: news_portal.cover_image,
			date: news_portal.date,
			document: news_portal.document,
			description: news_portal.description,
			short_description: news_portal.short_description,
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
		return await res.status(200).json({ toast, data, pagination });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const news_portalPromise = db
		.select({
			uuid: news_portal.uuid,
			id: news_portal.id,
			title: news_portal.title,
			sub_title: news_portal.sub_title,
			cover_image: news_portal.cover_image,
			date: news_portal.date,
			document: news_portal.document,
			description: news_portal.description,
			short_description: news_portal.short_description,
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
		const toast = {
			status: 200,
			type: 'select',
			message: 'News portal',
		};
		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function latestPost(req, res, next) {
	const news_portalPromise = db
		.select({
			title: news_portal.title,
			sub_title: news_portal.sub_title,
			date: news_portal.date,
			document: news_portal.document,
			description: news_portal.description,
			short_description: news_portal.short_description,
			created_by: news_portal.created_by,
			created_at: news_portal.created_at,
		})
		.from(news_portal)
		.orderBy(desc(news_portal.created_at))
		.limit(10);

	try {
		const data = await news_portalPromise;
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
