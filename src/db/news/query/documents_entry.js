import { desc, eq } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createApi } from '../../../util/api.js';
import { handleError, validateRequest } from '../../../util/index.js';
import { generateSignedUrl } from '../../../util/signed_url.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { constructSelectAllQuery } from '../../variables.js';
import { documents_entry } from '../schema.js';

const SERVER_URL = process.env.SERVER_URL;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { documents } = req.files;

	let documents_url = null;
	if (documents && documents.length > 0) {
		documents_url = path.join('documents', documents[0].filename);
	}

	const { uuid, created_at, updated_at, remarks } = req.body;

	const documents_entryPromise = db
		.insert(documents_entry)
		.values({
			uuid,
			documents: documents_url,
			created_at,
			updated_at,
			remarks,
		})
		.returning({ insertedName: documents_entry.uuid });

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

	const { documents } = req.files;

	let documentString = null;
	if (documents && documents.length > 0) {
		documentString = path.join('documents', documents[0].filename);
	}

	if (documentString) {
		const oldDocument = await db
			.select({ documents: documents_entry.documents })
			.from(documents_entry)
			.where(eq(documents_entry.uuid, req.params.uuid));

		if (oldDocument && oldDocument.length > 0) {
			const oldDocumentPath = path.join(
				__dirname,
				'../../../../',
				'uploads',
				oldDocument[0].documents
			);

			if (fs.existsSync(oldDocumentPath)) {
				fs.unlinkSync(oldDocumentPath);
				console.log('file deleted successfully', oldDocumentPath);
			} else {
				console.log('file not found', oldDocumentPath);
			}
		}
	}

	const documents_url = documentString ? documentString : req.body.documents;

	const { uuid, created_at, updated_at, remarks } = req.body;

	const documents_entryPromise = db
		.update(documents_entry)
		.set({
			uuid,
			documents: documents_url,
			created_at,
			updated_at,
			remarks,
		})
		.where(eq(documents_entry.uuid, req.params.uuid))
		.returning({ updatedName: documents_entry.uuid });

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

	const documents = await db
		.select({ documents: documents_entry.documents })
		.from(documents_entry)
		.where(eq(documents_entry.uuid, req.params.uuid));

	if (documents && documents.length > 0) {
		const deleteDocumentPath = path.join(
			__dirname,
			'../../../../',
			'uploads',
			documents[0].documents
		);

		if (fs.existsSync(deleteDocumentPath)) {
			fs.unlinkSync(deleteDocumentPath);
			console.log('File deleted successfully');
		} else {
			console.error('File not found');
		}
	}

	// delete the record from db
	const documents_entryPromise = db
		.delete(documents_entry)
		.where(eq(documents_entry.uuid, req.params.uuid))
		.returning({ deletedName: documents_entry.uuid });

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
			documents: documents_entry.documents,
			created_at: documents_entry.created_at,
			updated_at: documents_entry.updated_at,
			remarks: documents_entry.remarks,
		})
		.from(documents_entry)
		.orderBy(desc(documents_entry.created_at));

	try {
		const resultPromiseForCount = await documents_entryPromise;

		const documentWithSignedUrl = resultPromiseForCount.map((item) => ({
			...item,
			documents: item.documents
				? generateSignedUrl(item.documents, 3600)
				: null,
		}));

		const toast = {
			status: 200,
			type: 'select all',
			message: 'All documents entry',
		};
		return await res.status(200).json({
			toast,
			data: documentWithSignedUrl,
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

		const documentWithSignedUrl = data.map((item) => ({
			...item,
			documents: item.documents
				? generateSignedUrl(item.documents, 3600)
				: null,
		}));

		const toast = {
			status: 200,
			type: 'select',
			message: 'documents entry',
		};
		return await res
			.status(200)
			.json({ toast, data: documentWithSignedUrl[0] });
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

		const documentWithSignedUrl = data.map((item) => ({
			...item,
			documents: item.documents
				? generateSignedUrl(item.documents, 3600)
				: null,
		}));

		const toast = {
			status: 200,
			type: 'select',
			message: 'documents entry',
		};
		return await res
			.status(200)
			.json({ toast, data: documentWithSignedUrl });
	} catch (error) {
		await handleError({ error, res });
	}
}
