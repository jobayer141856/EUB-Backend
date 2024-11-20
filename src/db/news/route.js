import { Router } from 'express';

import { validateUuidParam } from '../../lib/validator.js';

import * as documentsEntryOperations from './query/documents_entry.js';
import * as newsOperations from './query/news_portal.js';

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
newsRouter.get('/documents-entry', documentsEntryOperations.selectAll);
newsRouter.get(
	'/documents-entry/:uuid',
	validateUuidParam,
	documentsEntryOperations.select
);
newsRouter.post('/documents-entry', documentsEntryOperations.insert);
newsRouter.put(
	'/documents-entry/:uuid',
	validateUuidParam,
	documentsEntryOperations.update
);
newsRouter.delete(
	'/documents-entry/:uuid',
	validateUuidParam,
	documentsEntryOperations.remove
);
newsRouter.get(
	'/documents-entry/by/:news_portal_uuid',
	documentsEntryOperations.selectByNewsPortalUuid
);

export { newsRouter };
