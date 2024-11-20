import { Router } from 'express';

import { validateUuidParam } from '../../lib/validator.js';

import * as newsOperations from './query/news_portal.js';
import * as newsPortalEntryOperations from './query/documents_entry.js';

// news routes
const newsRouter = Router();

// NOTE: news_portal routes
newsRouter.get('/news-portal', newsOperations.selectAll);
newsRouter.get('/news-portal/:uuid', validateUuidParam, newsOperations.select);
newsRouter.post('/news-portal', newsOperations.insert);
newsRouter.put('/news-portal/:uuid', validateUuidParam, newsOperations.update);
newsRouter.delete(
	'/news-portal/:uuid',
	validateUuidParam,
	newsOperations.remove
);
newsRouter.get('/news-portal/latest-post', newsOperations.latestPost);

// NOTE: news_portal_entry routes
newsRouter.get('/news-portal-entry', newsPortalEntryOperations.selectAll);
newsRouter.get(
	'/news-portal-entry/:uuid',
	validateUuidParam,
	newsPortalEntryOperations.select
);
newsRouter.post('/news-portal-entry', newsPortalEntryOperations.insert);
newsRouter.put(
	'/news-portal-entry/:uuid',
	validateUuidParam,
	newsPortalEntryOperations.update
);
newsRouter.delete(
	'/news-portal-entry/:uuid',
	validateUuidParam,
	newsPortalEntryOperations.remove
);
newsRouter.get(
	'/news-portal-entry/by/:news_portal_uuid',
	newsPortalEntryOperations.selectByNewsPortalUuid
);

export { newsRouter };
