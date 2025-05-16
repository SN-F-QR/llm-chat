import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './drizzle/schema';

import path from 'path';

const sqlite = new Database(path.resolve(__dirname, '../../db.sqlite'));
const db = drizzle({ client: sqlite, schema: schema, logger: true });

export default db;
