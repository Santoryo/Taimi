'use strict';
// Tasks to do when the app is loaded to ensure correct work of application.
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const logger_1 = __importDefault(require('./core/logger'));
const gw2_db_service_1 = require('./services/gw2.db.service');
async function main() {
  logger_1.default.info('Initializing preload module');
  await (0, gw2_db_service_1.updateProfessionsInDb)();
}
main();
