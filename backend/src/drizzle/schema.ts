import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, real, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const userTable = sqliteTable(
  'user',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    password: text('password').notNull(),
    money: real('money').default(0).notNull(),
    avatar: text('avatar').default(sql`null`),
    stuNum: text('stuNum').unique().notNull(),
    department: text('department').notNull(),
    lastRevokedTime: integer('lastRevokedTime').default(0).notNull(),
  },
  (table) => [uniqueIndex('stu_num_idx').on(table.stuNum)]
);
