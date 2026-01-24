import express from 'express';
import { errorHandler } from './middlewares/errorHandler';
import config from './config/config';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from '../build/swagger.json'
import { RegisterRoutes } from "../build/routes";
import morgan from 'morgan';
import logger from './core/logger';
import './preload';

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(morgan("common"));

RegisterRoutes(app);

app.use(errorHandler);

app.listen(config.port, () => {
  logger.info(`Running on http://localhost:${config.port}`);
});