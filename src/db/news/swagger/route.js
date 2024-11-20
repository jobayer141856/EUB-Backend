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
				200: SE.response_schema_ref(200, 'news/news_portal'),
			},
		},
		post: {
			tags: ['news.news_portal'],
			summary: 'Create a news',
			description: 'Create a news',
			requestBody: SE.requestBody_schema_ref('news/news_portal'),
			responses: {
				201: SE.response_schema_ref(201, 'news/news_portal'),
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
				200: SE.response_schema_ref(200, 'news/news_portal'),
			},
		},
		put: {
			tags: ['news.news_portal'],
			summary: 'Update a news',
			description: 'Update a news',
			parameters: [SE.parameter_params('Get news uuid', 'uuid')],
			requestBody: SE.requestBody_schema_ref('news/news_portal'),
			responses: {
				200: SE.response_schema_ref(200, 'news/news_portal'),
			},
		},

		delete: {
			tags: ['news.news_portal'],
			summary: 'Delete a news',
			description: 'Delete a news',
			parameters: [SE.parameter_params('Get news uuid', 'uuid')],
			responses: {
				204: SE.response_schema_ref(204, 'news/news_portal'),
			},
		},
	},
	'/news/news-portal/latest-post': {
		get: {
			tags: ['news.news_portal'],
			summary: 'Get latest news',
			description: 'Get 10 latest news',
			responses: {
				200: SE.response_schema_ref(200, 'news/news_portal'),
			},
		},
	},
	'/news/news-portal-details/by/{news_portal_uuid}': {
		get: {
			tags: ['news.news_portal'],
			summary: 'Get news details',
			description: 'Get news details',
			parameters: [
				SE.parameter_params('Get news uuid', 'news_portal_uuid'),
			],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					title: SE.string('title'),
					subtitle: SE.string('subtitle'),
					description: SE.string('description'),
					content: SE.string('content'),
					cover_image: SE.string('url of image'),
					published_date: SE.date_time(),
					created_by: SE.uuid(),
					created_by_name: SE.string('name'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('remarks'),
					documents: SE.sub_response_schema({
						uuid: SE.uuid(),
						news_portal_uuid: SE.uuid(),
						documents: SE.string('url of document'),
						created_at: SE.date_time(),
						updated_at: SE.date_time(),
						remarks: SE.string('remarks'),
					}),
				}),
			},
		},
	},
};

export const pathNewsPortalEntry = {
	'/news/documents-entry': {
		get: {
			tags: ['news.documents_entry'],
			summary: 'Get all news entry',
			description: 'Get all news entry',
			responses: {
				200: SE.response_schema_ref(200, 'news/documents_entry'),
			},
		},
		post: {
			tags: ['news.documents_entry'],
			summary: 'Create a news entry',
			description: 'Create a news entry',
			requestBody: SE.requestBody_schema_ref('news/documents_entry'),
			responses: {
				201: SE.response_schema_ref(201, 'news/documents_entry'),
			},
		},
	},
	'/news/documents-entry/{uuid}': {
		get: {
			tags: ['news.documents_entry'],
			summary: 'Get a news entry',
			description: 'Get a news entry',
			parameters: [SE.parameter_params('Get news uuid', 'uuid')],
			responses: {
				200: SE.response_schema_ref(200, 'news/documents_entry'),
			},
		},
		put: {
			tags: ['news.documents_entry'],
			summary: 'Update a news entry',
			description: 'Update a news entry',
			parameters: [SE.parameter_params('Get news uuid', 'uuid')],
			requestBody: SE.requestBody_schema_ref('news/documents_entry'),
			responses: {
				200: SE.response_schema_ref(200, 'news/documents_entry'),
			},
		},
	},
	'/news/documents-entry/by/{news_portal_uuid}': {
		get: {
			tags: ['news.documents_entry'],
			summary: 'Get all news entry by news portal uuid',
			description: 'Get all news entry by news portal uuid',
			parameters: [
				SE.parameter_params(
					'get news news_portal_uuid',
					'news_portal_uuid'
				),
			],
			responses: {
				200: SE.response_schema_ref(200, 'news/documents_entry'),
			},
		},
	},
};

export const pathNews = {
	...pathNewsPortal,
	...pathNewsPortalEntry,
};
