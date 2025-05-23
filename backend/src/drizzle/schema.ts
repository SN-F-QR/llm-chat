import { sql, InferSelectModel, relations } from 'drizzle-orm';
import {
  sqliteTable,
  text,
  integer,
  real,
  uniqueIndex,
  index,
  primaryKey,
} from 'drizzle-orm/sqlite-core';

export enum Role {
  user = 0,
  assistant = 1,
  system = 2,
}

export const userTable = sqliteTable(
  'user',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    password: text('password').notNull(),
    money: real('money').default(0).notNull(),
    avatar: text('avatar').default(sql`null`),
    stuNum: text('stuNum').notNull(),
    department: text('department').notNull(),
    lastRevokedTime: integer('lastRevokedTime').default(0).notNull(),
  },
  (table) => [uniqueIndex('stu_num_idx').on(table.stuNum)]
);

export const chatTable = sqliteTable(
  'chat',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    title: text('title').notNull(),
    publicId: text('publicId').notNull(),
    ownerId: integer('ownerId')
      .notNull()
      .references(() => userTable.id),
    createdAt: integer('createdAt')
      .default(sql`(unixepoch())`)
      .notNull(),
    lastUseAt: integer('lastUseAt')
      .default(sql`(unixepoch())`) // time since 1970 without ms
      .notNull(),
  },
  (table) => [index('public_id_idx').on(table.publicId)]
);

export const messageTable = sqliteTable('message', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  chatId: integer('chatId')
    .notNull()
    .references(() => chatTable.id),
  role: integer('role').notNull(),
  content: text('content').notNull(),
  createdAt: integer('createdAt')
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const tagTable = sqliteTable('tag', {
  name: text('name').notNull().primaryKey(),
  ownerId: integer('ownerId')
    .notNull()
    .references(() => userTable.id),
});

export const tagToChatTable = sqliteTable(
  'tagToChat',
  {
    tagName: text('tagName')
      .notNull()
      .references(() => tagTable.name),
    chatId: integer('chatId')
      .notNull()
      .references(() => chatTable.id),
  },
  (table) => [primaryKey({ columns: [table.tagName, table.chatId] })]
);

export const userRelation = relations(userTable, ({ many }) => ({
  chats: many(chatTable),
  tags: many(tagTable), // named tags when don't use middle table
}));

export const chatRelation = relations(chatTable, ({ one, many }) => ({
  owner: one(userTable, { fields: [chatTable.ownerId], references: [userTable.id] }),
  messages: many(messageTable),
  chatToTags: many(tagToChatTable),
}));

export const messageRelation = relations(messageTable, ({ one }) => ({
  chat: one(chatTable, { fields: [messageTable.chatId], references: [chatTable.id] }),
}));

export const tagRelation = relations(tagTable, ({ one, many }) => ({
  tagToChats: many(tagToChatTable),
  owner: one(userTable, { fields: [tagTable.ownerId], references: [userTable.id] }),
}));

export const tagToChatRelation = relations(tagToChatTable, ({ one }) => ({
  tag: one(tagTable, { fields: [tagToChatTable.tagName], references: [tagTable.name] }),
  chat: one(chatTable, { fields: [tagToChatTable.chatId], references: [chatTable.id] }),
}));

type User = InferSelectModel<typeof userTable>;
type Chat = InferSelectModel<typeof chatTable>;
type Message = InferSelectModel<typeof messageTable>;

export { User, Chat, Message };
