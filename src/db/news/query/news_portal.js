import { desc, eq } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import db from '../../index.js';

import { news_portal } from '../schema.js';

export async function insert(req, res, next) {
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
		.insert(news_portal)
		.values({
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
		await handleError({ error, res });
	}
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
			date: news_portal.date,
			document: news_portal.document,
			description: news_portal.description,
			short_description: news_portal.short_description,
			created_by: news_portal.created_by,
			created_at: news_portal.created_at,
			updated_at: news_portal.updated_at,
			remarks: news_portal.remarks,
		})
		.from(news_portal)
		.orderBy(desc(news_portal.created_at));

	try {
		const data = await news_portalPromise;
		const toast = {
			status: 200,
			type: 'select all',
			message: 'All news portal',
		};
		return await res.status(200).json({ toast, data });
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
			date: news_portal.date,
			document: news_portal.document,
			description: news_portal.description,
			short_description: news_portal.short_description,
			created_by: news_portal.created_by,
			created_at: news_portal.created_at,
			updated_at: news_portal.updated_at,
			remarks: news_portal.remarks,
		})
		.from(news_portal)
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
