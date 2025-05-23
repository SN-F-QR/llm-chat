PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_chat` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`publicId` text NOT NULL,
	`ownerId` integer NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`lastUseAt` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`ownerId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_chat`("id", "title", "publicId", "ownerId", "createdAt", "lastUseAt") SELECT "id", "title", "publicId", "ownerId", "createdAt", "lastUseAt" FROM `chat`;--> statement-breakpoint
DROP TABLE `chat`;--> statement-breakpoint
ALTER TABLE `__new_chat` RENAME TO `chat`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `public_id_idx` ON `chat` (`publicId`);--> statement-breakpoint
CREATE TABLE `__new_message` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`chatId` integer NOT NULL,
	`role` integer NOT NULL,
	`content` text NOT NULL,
	`createdAt` integer DEFAULT 1748004547874 NOT NULL,
	FOREIGN KEY (`chatId`) REFERENCES `chat`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_message`("id", "chatId", "role", "content", "createdAt") SELECT "id", "chatId", "role", "content", "createdAt" FROM `message`;--> statement-breakpoint
DROP TABLE `message`;--> statement-breakpoint
ALTER TABLE `__new_message` RENAME TO `message`;