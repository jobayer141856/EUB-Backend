import SE from '../../../util/swagger_example.js';

export const pathNewsPortal = {
	'/news/news-portal': {
		get: {
			tags: ['news.news_portal'],
			summary: 'Get all news',
			description: 'Get all news',
			responses: {
				200: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/news/news_portal',
								},
							},
						},
					},
				},
			},
		},
		post: {
			tags: ['news.news_portal'],
			summary: 'Create a news',
			description: 'Create a news',
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/news/news_portal',
						},
					},
				},
				required: true,
			},
			responses: {
				201: {
					description: 'Created',
					content: {
						'application/json': {
							schema: {
								$ref: '##/definitions/news/news_portal',
							},
						},
					},
				},
			},
		},
	},
	'/news/news-portal/{uuid}': {
		get: {
			tags: ['news.news_portal'],
			summary: 'Get a news',
			description: 'Get a news',
			parameters: [
				{
					in: 'path',
					name: 'uuid',
					description: 'UUID of the news',
					required: true,
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			responses: {
				200: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/news/news_portal',
							},
						},
					},
				},
			},
		},
		put: {
			tags: ['news.news_portal'],
			summary: 'Update a news',
			description: 'Update a news',
			parameters: [
				{
					in: 'path',
					name: 'uuid',
					description: 'UUID of the news',
					required: true,
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/news/news_portal',
						},
					},
				},
				required: true,
			},
			responses: {
				200: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/news/news_portal',
							},
						},
					},
				},
			},
		},

		delete: {
			tags: ['news.news_portal'],
			summary: 'Delete a news',
			description: 'Delete a news',
			parameters: [
				{
					in: 'path',
					name: 'uuid',
					description: 'UUID of the news',
					required: true,
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			responses: {
				204: {
					description: 'Success',
				},
			},
		},
	},
	'/news/news-portal/latest-post': {
		get: {
			tags: ['news.news_portal'],
			summary: 'Get latest news',
			description: 'Get latest news',
			responses: {
				200: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/news/news_portal',
								},
							},
						},
					},
				},
			},
		},
	},
};

export const pathNews = {
	...pathNewsPortal,
};
