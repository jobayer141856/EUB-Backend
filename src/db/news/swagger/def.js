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
		document: SE.string(),
		cover_image: SE.string(),
		published_date: SE.date_time(),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string(),
	},
	xml: 'News/Portal',
});

export const defNews = {
	news_portal: defNewsPortal,
};

export const tagNews = [
	{
		name: 'news.news_portal',
		description: 'Everything about your News Portal',
	},
];
