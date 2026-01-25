import dotenv from 'dotenv';

dotenv.config();

interface Config {
    port: number;
    nodeEnv: string;
    databaseUrl: string;
    minimumUpdateTime: number;
}

const config: Config = {
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    databaseUrl: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/mydb',
    minimumUpdateTime: Number(process.env.MIN_UPDATE_TIME) || 5 * 60 * 1000,
};

export default config;
