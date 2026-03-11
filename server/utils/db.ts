import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from "@neondatabase/serverless";
import * as schema from '../database/schema';

const { databaseUrl } = useRuntimeConfig()
const sql = neon(databaseUrl)

export const db = drizzle(sql, { schema });
