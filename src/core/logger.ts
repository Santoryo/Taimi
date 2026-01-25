import pino from 'pino';

const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport: {
        target: 'pino-pretty', // optional for readable logs in dev
        options: { colorize: true },
    },
});

export default logger;
