import config from '../config/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

let connectionString = config.databaseUrl;

// Disable prefetch as it is not supported for "Transaction" pool mode
// https://supabase.com/docs/guides/database/drizzle
export const client = postgres(connectionString, { prepare: false })
export const db = drizzle(client);