CREATE TABLE `prompt` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`publicId` text NOT NULL,
	`name` text NOT NULL,
	`content` text NOT NULL,
	`ownerId` integer NOT NULL,
	`category` text DEFAULT 'default' NOT NULL,
	FOREIGN KEY (`ownerId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `public_prompt_idx` ON `prompt` (`publicId`);