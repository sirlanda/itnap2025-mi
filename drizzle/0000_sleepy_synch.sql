CREATE TABLE `test_cases` (
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
CREATE TABLE `test_executions` (
	`id` text PRIMARY KEY NOT NULL,
	`test_case_id` text NOT NULL,
	`test_plan_id` text,
	`status` text NOT NULL,
	`started_at` text NOT NULL,
	`completed_at` text,
	`updated_at` text NOT NULL,
	`executed_by` text,
	`environment` text,
	`notes` text,
	FOREIGN KEY (`test_case_id`) REFERENCES `test_cases`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`test_plan_id`) REFERENCES `test_plans`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
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
CREATE TABLE `test_step_results` (
	`id` text PRIMARY KEY NOT NULL,
	`execution_id` text NOT NULL,
	`step_id` text NOT NULL,
	`status` text NOT NULL,
	`actual_result` text,
	`comment` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`execution_id`) REFERENCES `test_executions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`step_id`) REFERENCES `test_steps`(`id`) ON UPDATE no action ON DELETE no action
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
