import SE, { SED } from '../../../util/swagger_example.js';

export const defNewsPortal = SED({
	required: [
		'uuid',
		'title',
		'subtitle',
		'description',
		'content',
		'published_date',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		title: SE.string(),
		subtitle: SE.string(),
		description: SE.string(),
		content: SE.string(),
		cover_image: SE.string(),
		published_date: SE.date_time(),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string(),
	},
	xml: 'News/News-Portal',
});

export const defDocumentsEntry = SED({
	required: ['uuid', 'news_portal_uuid', 'documents', 'created_at'],
	properties: {
		uuid: SE.uuid(),
		news_portal_uuid: SE.uuid(),
		documents: SE.string(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string(),
	},
	xml: 'News/Documents-Entry',
});

export const defNews = {
	news_portal: defNewsPortal,
	documents_entry: defDocumentsEntry,
};

export const tagNews = [
	{
		name: 'news.news_portal',
		description: 'Everything about your News Portal',
	},
	{
		name: 'news.documents_entry',
		description: 'Everything about your News Portal Entry',
	},
];
