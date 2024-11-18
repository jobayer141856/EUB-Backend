import { integer, pgSchema, text, jsonb } from 'drizzle-orm/pg-core';
import { DateTime, defaultUUID, uuid_primary } from '../variables.js';
import * as hrSchema from '../hr/schema.js';
const news = pgSchema('news');

export const news_portal = news.table('news_portal', {
	uuid: uuid_primary,
	id: integer('id').notNull(),
	title: text('title').notNull(),
	sub_title: text('sub_title').notNull(),
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
