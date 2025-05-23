PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_message` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`chatId` integer NOT NULL,
	`role` integer NOT NULL,
	`content` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`chatId`) REFERENCES `chat`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_message`("id", "chatId", "role", "content", "createdAt") SELECT "id", "chatId", "role", "content", "createdAt" FROM `message`;--> statement-breakpoint
DROP TABLE `message`;--> statement-breakpoint
ALTER TABLE `__new_message` RENAME TO `message`;--> statement-breakpoint
PRAGMA foreign_keys=ON;