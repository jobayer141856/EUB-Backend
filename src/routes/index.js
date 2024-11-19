import express from 'express';

import { hrRouter } from '../db/hr/route.js';
import { newsRouter } from '../db/news/route.js';
import { otherRouter } from '../db/other/route.js';

const route = express.Router();

// All the routes are defined here

// TODO: Add your routes here
// FIXME: Add your routes here
// NOTE: Add your routes here
// INFO: Add your routes here
// WARNING: Add your routes here
// REVIEW: Add your routes here

// INFO: hr routes
route.use('/hr', hrRouter);

// INFO: news routes
route.use('/news', newsRouter);

// INFO: other routes
route.use('/other', otherRouter);

export default route;
