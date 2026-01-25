// Tasks to do when the app is loaded to ensure correct work of application.

import logger from './core/logger';
import { updateProfessionsInDb } from './services/gw2.db.service';

async function main() {
    logger.info('Initializing preload module');
    await updateProfessionsInDb();
}

main();
