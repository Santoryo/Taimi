import express from 'express';
import { errorHandler } from './middlewares/errorHandler';
import config from './config/config';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from '../build/swagger.json';
import { RegisterRoutes } from '../build/routes';
import morgan from 'morgan';
import logger from './core/logger';
import './preload';
import pkg from '../package.json'
import cors from 'cors';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { characterQueue } from './worker/queue';

const app = express();

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
    queues: [new BullMQAdapter(characterQueue)],
    serverAdapter,
});
app.use(cors());

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/health', (req, res) => {
    res.send({ version: pkg.version, status: 'ok', uptime: process.uptime() });
});
app.use(morgan('common'));
app.use('/admin/queues', serverAdapter.getRouter());

RegisterRoutes(app);

app.use(errorHandler);

app.listen(config.port, () => {
    logger.info(`Running on http://localhost:${config.port}`);
});
