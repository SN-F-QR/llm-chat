CREATE TABLE `user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`password` text NOT NULL,
	`avatar` text DEFAULT null,
	`stuNum` text NOT NULL,
	`department` text NOT NULL,
	`lastRevokedTime` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_stuNum_unique` ON `user` (`stuNum`);--> statement-breakpoint
CREATE UNIQUE INDEX `stu_num_idx` ON `user` (`stuNum`);