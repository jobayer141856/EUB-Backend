import { sql } from 'drizzle-orm';
import { jsonb, pgSchema, text } from 'drizzle-orm/pg-core';
import * as hrSchema from '../hr/schema.js';
import { DateTime, defaultUUID, uuid_primary } from '../variables.js';

const news = pgSchema('news');

export const news_portal = news.table('news_portal', {
	uuid: uuid_primary,
	title: text('title').notNull(),
	subtitle: text('subtitle').default(null),
	description: text('description').notNull(),
	content: jsonb('content').default([]),
	document: jsonb('document').default([]),
	cover_image: text('cover_image').default(null),
	published_date: DateTime('published_date').notNull(),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export default news;
