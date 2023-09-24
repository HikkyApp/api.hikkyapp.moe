import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Worker } from 'worker_threads';
import { handlePath } from './utils';
import { logError } from './errors/errorHandler';
dotenv.config();

const app: Express = express();
const port = process.env.PORT;

const workerMain = new Worker(handlePath('./crawl-woker.js'));

workerMain.on('message', console.log);
workerMain.on('error', logError);

app.use(cors());

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
