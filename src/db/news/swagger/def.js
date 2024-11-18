import SE, { SED } from '../../../util/swagger_example.js';

export const defNewsPortal = SED({
	required: [
		'uuid',
		'id',
		'title',
		'sub_title',
		'date',
		'document',
		'description',
		'short_description',
		'created_by',
		'created_at',
		'updated_at',
		'remarks',
	],
	properties: {
		uuid: SE.uuid(),
		id: SE.integer(1),
		title: SE.string('title'),
		sub_title: SE.string('sub_title'),
		date: SE.date_time(),
		document: SE.jsonb([]),
		description: SE.string('description'),
		short_description: SE.string('short_description'),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
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
