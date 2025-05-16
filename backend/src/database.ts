import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './drizzle/schema';
import dotenv from 'dotenv';
dotenv.config();

import path from 'path';

const dbUrl = process.env.DB_URL ?? path.resolve(__dirname, '../../db.sqlite');
console.log('Using DB at path:', dbUrl);
const sqlite = new Database(dbUrl);
const db = drizzle({ client: sqlite, schema: schema, logger: true });

export default db;
