'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.gw2Limiter = void 0;
// gw2Limiter.ts
const bottleneck_1 = __importDefault(require('bottleneck'));
exports.gw2Limiter = new bottleneck_1.default({
  reservoir: 300, // max burst
  reservoirRefreshAmount: 5, // refill tokens
  reservoirRefreshInterval: 1000, // per second
  maxConcurrent: 10, // parallel HTTP calls
});
exports.gw2Limiter.on('failed', async (error, jobInfo) => {
  if (jobInfo.retryCount < 5) {
    return 1000 * (jobInfo.retryCount + 1); // backoff
  }
});
