import { eq, sql } from 'drizzle-orm';
import { handleError } from '../../../util/index.js';
import db from '../../index.js';

import * as hrSchema from '../../hr/schema.js';

// * HR * //
//* HR Department *//
export async function selectDepartment(req, res, next) {
	const departmentPromise = db
		.select({
			value: hrSchema.department.uuid,
			label: hrSchema.department.department,
		})
		.from(hrSchema.department);

	try {
		const data = await departmentPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Department list',
		};

		return await res.status(200).json({ toast, data: data });
	} catch (error) {
		await handleError({ error, res });
	}
}
//* HR User *//
export async function selectHrUser(req, res, next) {
	const { designation } = req.query;

	const userPromise = db
		.select({
			value: hrSchema.users.uuid,
			label: hrSchema.users.name,
			designation: hrSchema.designation.designation,
		})
		.from(hrSchema.users)
		.leftJoin(
			hrSchema.designation,
			eq(hrSchema.users.designation_uuid, hrSchema.designation.uuid)
		)
		.where(
			designation
				? eq(sql`lower(designation.designation)`, designation)
				: null
		);

	try {
		const data = await userPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'User list',
		};

		res.status(200).json({ toast, data: data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectDesignation(req, res, next) {
	const Designation = db
		.select({
			value: hrSchema.designation.uuid,
			label: hrSchema.designation.designation,
		})
		.from(hrSchema.designation);

	try {
		const data = await Designation;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Designation list',
		};

		return await res.status(200).json({ toast, data: data });
	} catch (error) {
		await handleError({ error, res });
	}
}
