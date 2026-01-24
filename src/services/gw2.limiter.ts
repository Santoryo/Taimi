// gw2Limiter.ts
import Bottleneck from "bottleneck";

export const gw2Limiter = new Bottleneck({
  reservoir: 300,               // max burst
  reservoirRefreshAmount: 5,    // refill tokens
  reservoirRefreshInterval: 1000, // per second
  maxConcurrent: 10,            // parallel HTTP calls
});

gw2Limiter.on("failed", async (error, jobInfo) => {
  if (jobInfo.retryCount < 5) {
    return 1000 * (jobInfo.retryCount + 1); // backoff
  }
});