import { desc, eq } from 'drizzle-orm';
import { deleteFile, getFile, uploadFile } from '../../../util/aws.js';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { constructSelectAllQuery } from '../../variables.js';
import { documents_entry } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	// aws upload file
	// document have only one file
	// const { documents } = req.file;

	// const documentPromise = await uploadFile({
	// 	file: documents,
	// 	folder: 'document/',
	// });

	const { uuid, created_at, updated_at, remarks } = req.body;

	const documents_entryPromise = db.insert(documents_entry).values({
		uuid,
		// documents: documentPromise,
		created_at,
		updated_at,
		remarks,
	});

	try {
		const data = await documents_entryPromise;
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
	// document may have only one file
	// const { new_documents } = req.file;

	// let documentString = null;

	// if (!new_documents) {
	// 	// Upload new cover image file only if it is different
	// 	let coverImagePromise = new_documents;
	// 	coverImagePromise = await uploadFile({
	// 		file: new_documents,
	// 		folder: 'document/',
	// 	});

	// 	documentString = coverImagePromise;
	// }

	const { uuid, documents, created_at, updated_at, remarks } = req.body;

	const documents_entryPromise = db
		.update(documents_entry)
		.set({
			uuid,
			// documents: documentString ? documentString : documents,
			created_at,
			updated_at,
			remarks,
		})
		.where(eq(documents_entry.uuid, req.params.uuid))
		.returning({ updatedName: documents_entry.title });

	try {
		const data = await documents_entryPromise;
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
	const documents_entryPromise = db
		.delete(documents_entry)
		.where(eq(documents_entry.uuid, req.params.uuid))
		.returning({ deletedName: documents_entry.title });

	try {
		const data = await documents_entryPromise;
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
	const documents_entryPromise = db
		.select({
			uuid: documents_entry.uuid,
			document: documents_entry.documents,
			created_at: documents_entry.created_at,
			updated_at: documents_entry.updated_at,
			remarks: documents_entry.remarks,
		})
		.from(documents_entry)
		.orderBy(desc(documents_entry.created_at));

	try {
		const resultPromiseForCount = await documents_entryPromise;

		const toast = {
			status: 200,
			type: 'select all',
			message: 'All documents entry',
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

	const documents_entryPromise = db
		.select({
			uuid: documents_entry.uuid,
			documents: documents_entry.documents,
			created_at: documents_entry.created_at,
			updated_at: documents_entry.updated_at,
			remarks: documents_entry.remarks,
		})
		.from(documents_entry)
		.where(eq(documents_entry.uuid, req.params.uuid));

	try {
		const data = await documents_entryPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'documents entry',
		};
		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectByNewsPortalUuid(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	console.log('req.params.uuid', req.params.news_portal_uuid);

	const documents_entryPromise = db
		.select({
			uuid: documents_entry.uuid,
			document: documents_entry.documents,
			created_at: documents_entry.created_at,
			updated_at: documents_entry.updated_at,
			remarks: documents_entry.remarks,
		})
		.from(documents_entry)
		.where(
			eq(documents_entry.news_portal_uuid, req.params.news_portal_uuid)
		);

	try {
		const data = await documents_entryPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'documents entry',
		};
		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}
