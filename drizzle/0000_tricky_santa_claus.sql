CREATE TABLE `test_cases` (
	`id` text PRIMARY KEY NOT NULL,
	`test_plan_id` text,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`prerequisites` text,
	`priority` text NOT NULL,
	`status` text NOT NULL,
	`module` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`assigned_to` text,
	FOREIGN KEY (`test_plan_id`) REFERENCES `test_plans`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `test_plans` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`start_date` text,
	`end_date` text,
	`status` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`created_by` text
);
--> statement-breakpoint
CREATE TABLE `test_steps` (
	`id` text PRIMARY KEY NOT NULL,
	`test_case_id` text NOT NULL,
	`instruction` text NOT NULL,
	`expected_result` text NOT NULL,
	`actual_result` text,
	`status` text,
	`comment` text,
	FOREIGN KEY (`test_case_id`) REFERENCES `test_cases`(`id`) ON UPDATE no action ON DELETE no action
);
