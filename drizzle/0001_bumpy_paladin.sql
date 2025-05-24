CREATE TABLE `test_plan_test_cases` (
	`test_plan_id` text NOT NULL,
	`test_case_id` text NOT NULL,
	`added_at` text NOT NULL,
	`added_by` text,
	PRIMARY KEY(`test_plan_id`, `test_case_id`),
	FOREIGN KEY (`test_plan_id`) REFERENCES `test_plans`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`test_case_id`) REFERENCES `test_cases`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_test_cases` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`prerequisites` text,
	`priority` text NOT NULL,
	`status` text NOT NULL,
	`module` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`assigned_to` text
);
--> statement-breakpoint
INSERT INTO `__new_test_cases`("id", "title", "description", "prerequisites", "priority", "status", "module", "created_at", "updated_at", "assigned_to") SELECT "id", "title", "description", "prerequisites", "priority", "status", "module", "created_at", "updated_at", "assigned_to" FROM `test_cases`;--> statement-breakpoint
DROP TABLE `test_cases`;--> statement-breakpoint
ALTER TABLE `__new_test_cases` RENAME TO `test_cases`;--> statement-breakpoint
PRAGMA foreign_keys=ON;