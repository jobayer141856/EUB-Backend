import { desc, eq } from 'drizzle-orm';
import { deleteFile, getFile, uploadFile } from '../../../util/aws.js';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { constructSelectAllQuery } from '../../variables.js';
import { news_portal_entry } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	// aws upload file
	// document may have multiple files
	// document may have only one file
	const { document } = req.files;

	const documentPromise = await uploadFile({
		file: document[0],
		folder: 'document/',
	});

	const { uuid, created_at, updated_at, remarks } = req.body;

	const news_portal_entryPromise = db.insert(news_portal_entry).values({
		uuid,
		document: documentPromise,
		created_at,
		updated_at,
		remarks,
	});

	try {
		const data = await news_portal_entryPromise;
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
	// document may have only one file
	const { new_document } = req.files;

	let documentString = null;

	if (!new_document) {
		// Upload new cover image file only if it is different
		let coverImagePromise = new_document;
		coverImagePromise = await uploadFile({
			file: new_document[0],
			folder: 'document/',
		});

		documentString = coverImagePromise;
	}

	const { uuid, document, created_at, updated_at, remarks } = req.body;

	const news_portal_entryPromise = db
		.update(news_portal_entry)
		.set({
			uuid,
			document: documentString ? documentString : document,
			created_at,
			updated_at,
			remarks,
		})
		.where(eq(news_portal_entry.uuid, req.params.uuid))
		.returning({ updatedName: news_portal_entry.title });

	try {
		const data = await news_portal_entryPromise;
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
	// delete the record from db
	const news_portal_entryPromise = db
		.delete(news_portal_entry)
		.where(eq(news_portal_entry.uuid, req.params.uuid))
		.returning({ deletedName: news_portal_entry.title });

	try {
		const data = await news_portal_entryPromise;
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
	const news_portal_entryPromise = db
		.select({
			uuid: news_portal_entry.uuid,
			document: news_portal_entry.document,
			created_at: news_portal_entry.created_at,
			updated_at: news_portal_entry.updated_at,
			remarks: news_portal_entry.remarks,
		})
		.from(news_portal_entry)
		.orderBy(desc(news_portal_entry.created_at));

	try {
		const resultPromiseForCount = await news_portal_entryPromise;

		const toast = {
			status: 200,
			type: 'select all',
			message: 'All news portal entry',
		};
		return await res.status(200).json({
			toast,
			data: resultPromiseForCount,
		});
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const news_portal_entryPromise = db
		.select({
			uuid: news_portal_entry.uuid,
			document: news_portal_entry.document,
			created_at: news_portal_entry.created_at,
			updated_at: news_portal_entry.updated_at,
			remarks: news_portal_entry.remarks,
		})
		.from(news_portal_entry)
		.where(eq(news_portal_entry.uuid, req.params.uuid));

	try {
		const data = await news_portal_entryPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'News portal entry',
		};
		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectByNewsPortalUuid(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const news_portal_entryPromise = db
		.select({
			uuid: news_portal_entry.uuid,
			document: news_portal_entry.document,
			created_at: news_portal_entry.created_at,
			updated_at: news_portal_entry.updated_at,
			remarks: news_portal_entry.remarks,
		})
		.from(news_portal_entry)
		.where(eq(news_portal_entry.news_portal_uuid, req.params.uuid));

	try {
		const data = await news_portal_entryPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'News portal entry',
		};
		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}
