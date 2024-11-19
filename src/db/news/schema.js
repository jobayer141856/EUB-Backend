import { sql } from 'drizzle-orm';
import { integer, jsonb, pgSchema, text } from 'drizzle-orm/pg-core';
import * as hrSchema from '../hr/schema.js';
import { DateTime, defaultUUID, uuid_primary } from '../variables.js';
const news = pgSchema('news');

export const news_portal_sequence = news.sequence('news_portal_sequence', {
	start: 1,
	increment: 1,
});

export const news_portal = news.table('news_portal', {
	uuid: uuid_primary,
	id: integer('id')
		.notNull()
		.default(sql`nextval('news.news_portal_sequence')`),
	title: text('title').notNull(),
	sub_title: text('sub_title').notNull(),
	cover_image: text('cover_image').default(null),
	date: DateTime('date').notNull(),
	document: jsonb('document').default([]),
	description: text('description').notNull(),
	short_description: text('short_description').notNull(),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export default news;
