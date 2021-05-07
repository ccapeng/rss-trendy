import express from 'express';
import { getRssFeeds } from '../controllers/rssfeed.js';

const router = express.Router(); 

router.get('/', getRssFeeds);

// read all
router.get('/api/rss', getRssFeeds);

export default router;