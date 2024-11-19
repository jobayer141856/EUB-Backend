import { Router } from 'express';

import SE from '../../util/swagger_example.js';
import * as otherOperations from './query/query.js';

const otherRouter = Router();
// hr
otherRouter.get('/department/value/label', otherOperations.selectDepartment);
otherRouter.get('/hr/user/value/label', otherOperations.selectHrUser);
otherRouter.get('/designation/value/label', otherOperations.selectDesignation);

const pathHr = {
	'/other/department/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all departments',
			description: 'All departments',
			operationId: 'getAllDepartments',
			responses: {
				200: {
					description: 'Returns a all departments.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: {
										type: 'string',
										example: '2ggcphnwHGzEUGy',
									},
									label: { type: 'string', example: 'Admin' },
								},
							},
						},
					},
				},
			},
		},
	},
	'/other/hr/user/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all HR users',
			description: 'All HR users',
			operationId: 'getAllHRUsers',
			parameters: [
				SE.parameter_query('designation', 'designation', [
					'driver',
					'executive',
				]),
			],
			responses: {
				200: {
					description: 'Returns a all HR users.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: {
										type: 'string',
										example: '2ggcphnwHGzEUGy',
									},
									label: { type: 'string', example: 'John' },
								},
							},
						},
					},
				},
			},
		},
	},
	'/other/designation/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all designation',
			description: 'All Designation',
			operationId: 'getAllDepartment',
			responses: {
				200: {
					description: 'Returns a all Designation.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: SE.uuid(),
									label: SE.string('Admin'),
								},
							},
						},
					},
				},
			},
		},
	},
};

export const pathOthers = {
	...pathHr,
};

export const tagOthers = [
	{
		name: 'others',
	},
];

export { otherRouter };
