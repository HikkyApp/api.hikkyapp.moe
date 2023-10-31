import apicache from 'apicache';
import 'dotenv/config';
import express, { Request, Response } from 'express';
import VideoSourceController from './controllers/VideoSourceController';

const cache = apicache.middleware;

const successCache = (duration: string) =>
  cache(duration, (_req: Request, res: Response) => res.statusCode === 200);

const router = express.Router();

router.get('', (_req: Request, res: Response) => {
  res.send('Server is running');
});

router.get('/source', successCache('30 minutes'), VideoSourceController);

export default router;
