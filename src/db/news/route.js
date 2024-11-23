import { Router } from 'express';

import multer from 'multer';
import { validateUuidParam } from '../../lib/validator.js';

import * as documentsEntryOperations from './query/documents_entry.js';
import * as newsOperations from './query/news_portal.js';

// news routes
const newsRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// NOTE: news_portal routes
newsRouter.get('/news-portal', newsOperations.selectAll);
newsRouter.get('/news-portal/:uuid', newsOperations.select);
newsRouter.post(
	'/news-portal',
	upload.single('cover_image'),
	newsOperations.insert
);
newsRouter.put('/news-portal/:uuid', newsOperations.update);
newsRouter.delete('/news-portal/:uuid', newsOperations.remove);
newsRouter.get('/news-portal/latest-post', newsOperations.latestPost);
newsRouter.get(
	'/news-portal-details/by/:news_portal_uuid',
	newsOperations.newsDetails
);

// NOTE: news_portal_entry routes
newsRouter.get('/documents-entry', documentsEntryOperations.selectAll);
newsRouter.get('/documents-entry/:uuid', documentsEntryOperations.select);
newsRouter.post('/documents-entry', documentsEntryOperations.insert);
newsRouter.put('/documents-entry/:uuid', documentsEntryOperations.update);
newsRouter.delete('/documents-entry/:uuid', documentsEntryOperations.remove);
newsRouter.get(
	'/documents-entry/by/:news_portal_uuid',
	documentsEntryOperations.selectByNewsPortalUuid
);

export { newsRouter };
