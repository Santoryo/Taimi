'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.db = exports.client = void 0;
const config_1 = __importDefault(require('../config/config'));
const postgres_js_1 = require('drizzle-orm/postgres-js');
const postgres_1 = __importDefault(require('postgres'));
let connectionString = config_1.default.databaseUrl;
// Disable prefetch as it is not supported for "Transaction" pool mode
// https://supabase.com/docs/guides/database/drizzle
exports.client = (0, postgres_1.default)(connectionString, { prepare: false });
exports.db = (0, postgres_js_1.drizzle)(exports.client);
