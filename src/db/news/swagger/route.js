import SE from '../../../util/swagger_example.js';

export const pathNewsPortal = {
	'/news/news-portal': {
		get: {
			tags: ['news.news_portal'],
			summary: 'Get all news',
			description: 'Get all news',
			parameters: [
				SE.parameter_query('search', 'q'),
				SE.parameter_query('page', 'page'),
				SE.parameter_query('limit', 'limit'),
				SE.parameter_query('sort', 'sort'),
				SE.parameter_query('orderby', 'orderby'),
			],
			responses: {
				200: SE.response_schema_ref('news/news_portal'),
			},
		},
		post: {
			tags: ['news.news_portal'],
			summary: 'Create a news',
			description: 'Create a news',
			requestBody: SE.requestBody_schema_ref('news/news_portal'),
			responses: {
				201: SE.response_schema_ref('news/news_portal'),
			},
		},
	},
	'/news/news-portal/{uuid}': {
		get: {
			tags: ['news.news_portal'],
			summary: 'Get a news',
			description: 'Get a news',
			parameters: [SE.parameter_params('Get news uuid', 'uuid')],
			responses: {
				200: SE.response_schema_ref('news/news_portal'),
			},
		},
		put: {
			tags: ['news.news_portal'],
			summary: 'Update a news',
			description: 'Update a news',
			parameters: [SE.parameter_params('Get news uuid', 'uuid')],
			requestBody: SE.requestBody_schema_ref('news/news_portal'),
			responses: {
				200: SE.response_schema_ref('news/news_portal'),
			},
		},

		delete: {
			tags: ['news.news_portal'],
			summary: 'Delete a news',
			description: 'Delete a news',
			parameters: [SE.parameter_params('Get news uuid', 'uuid')],
			responses: {
				204: SE.response_schema_ref('news/news_portal'),
			},
		},
	},
	'/news/news-portal/latest-post': {
		get: {
			tags: ['news.news_portal'],
			summary: 'Get latest news',
			description: 'Get 10 latest news',
			responses: {
				200: SE.response_schema_ref('news/news_portal'),
			},
		},
	},
};

export const pathNewsPortalEntry = {
	'/news/news-portal-entry': {
		get: {
			tags: ['news.news_portal_entry'],
			summary: 'Get all news entry',
			description: 'Get all news entry',
			parameters: [
				SE.parameter_query('search', 'q'),
				SE.parameter_query('page', 'page'),
				SE.parameter_query('limit', 'limit'),
				SE.parameter_query('sort', 'sort'),
				SE.parameter_query('orderby', 'orderby'),
			],
			responses: {
				200: SE.response_schema_ref('news/news_portal_entry'),
			},
		},
		post: {
			tags: ['news.news_portal_entry'],
			summary: 'Create a news entry',
			description: 'Create a news entry',
			requestBody: SE.requestBody_schema_ref('news/news_portal_entry'),
			responses: {
				201: {
					description: 'Created',
					content: {
						'application/json': {
							schema: {
								$ref: '##/definitions/news/news_portal_entry',
							},
						},
					},
				},
			},
		},
	},
	'/news/news-portal-entry/{uuid}': {
		get: {
			tags: ['news.news_portal_entry'],
			summary: 'Get a news entry',
			description: 'Get a news entry',
			parameters: [SE.parameter_params('Get news uuid', 'uuid')],
			responses: {
				200: SE.response_schema_ref('news/news_portal_entry'),
			},
		},
		put: {
			tags: ['news.news_portal_entry'],
			summary: 'Update a news entry',
			description: 'Update a news entry',
			parameters: [SE.parameter_params('Get news uuid', 'uuid')],
			requestBody: SE.requestBody_schema_ref('news/news_portal_entry'),
			responses: {
				200: SE.response_schema_ref('news/news_portal_entry'),
			},
		},
	},
	'/news/news-portal-entry/by/{news_portal_uuid}': {
		get: {
			tags: ['news.news_portal_entry'],
			summary: 'Get all news entry by news portal uuid',
			description: 'Get all news entry by news portal uuid',
			parameters: [
				SE.parameter_query(
					'get news news_portal_uuid',
					'news_portal_uuid'
				),
			],
			responses: {
				200: SE.response_schema_ref('news/news_portal_entry'),
			},
		},
	},
};

export const pathNews = {
	...pathNewsPortal,
	...pathNewsPortalEntry,
};
