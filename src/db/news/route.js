import { Router } from 'express';

import { validateUuidParam } from '../../lib/validator.js';

import * as newsOperations from './query/news_portal.js';

const newsRouter = Router();

// news routes

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

export { newsRouter };
