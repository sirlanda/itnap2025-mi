import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const testPlans = sqliteTable('test_plans', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  startDate: text('start_date'),
  endDate: text('end_date'),
  status: text('status').notNull(), // 'Active', 'Completed', 'Cancelled', 'Draft'
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  createdBy: text('created_by'),
});

export const testCases = sqliteTable('test_cases', {
  id: text('id').primaryKey(),
  testPlanId: text('test_plan_id').references(() => testPlans.id),
  title: text('title').notNull(),
  description: text('description').notNull(),
  prerequisites: text('prerequisites'),
  priority: text('priority').notNull(),
  status: text('status').notNull(),
  module: text('module'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  assignedTo: text('assigned_to'),
});

export const testSteps = sqliteTable('test_steps', {
  id: text('id').primaryKey(),
  testCaseId: text('test_case_id').notNull().references(() => testCases.id),
  instruction: text('instruction').notNull(),
  expectedResult: text('expected_result').notNull(),
  actualResult: text('actual_result'),
  status: text('status'),
  comment: text('comment'),
});

const sqlite = new Database('sqlite.db');
export const db = drizzle(sqlite);

export async function seedTestPlans() {
  const existing = sqlite.prepare('SELECT COUNT(*) as count FROM test_plans').get() as { count: number };
  if (existing.count === 0) {
    const now = new Date().toISOString();
    const plans = [
      { id: 'TP001', name: 'Sprint 1 - Authentication', description: 'Testing all authentication features for sprint 1', startDate: '2024-01-15', endDate: '2024-01-30', status: 'Active', createdAt: now, updatedAt: now, createdBy: 'john.doe' },
      { id: 'TP002', name: 'User Management Release', description: 'Comprehensive testing of user management module', startDate: '2024-02-01', endDate: '2024-02-15', status: 'Draft', createdAt: now, updatedAt: now, createdBy: 'jane.smith' },
      { id: 'TP003', name: 'Regression Testing', description: 'Full regression test suite', startDate: '2024-02-20', endDate: '2024-03-05', status: 'Draft', createdAt: now, updatedAt: now, createdBy: 'admin' },
    ];
    for (const tp of plans) {
      db.insert(testPlans).values(tp).run?.() ?? db.insert(testPlans).values(tp);
    }
    console.log('Seeded test plans');
  }
}

export async function seedTestCases() {
  const existing = sqlite.prepare('SELECT COUNT(*) as count FROM test_cases').get() as { count: number };
  if (existing.count === 0) {
    const now = new Date().toISOString();
    const cases = [
      { id: 'TC001', testPlanId: 'TP001', title: 'User Login with Valid Credentials', description: 'Verify user can log in.', priority: 'High', status: 'Ready', module: 'Authentication', createdAt: now, updatedAt: now },
      { id: 'TC002', testPlanId: 'TP001', title: 'User Login with Invalid Credentials', description: 'Verify user cannot log in with wrong password.', priority: 'High', status: 'Ready', module: 'Authentication', createdAt: now, updatedAt: now },
      { id: 'TC003', testPlanId: 'TP002', title: 'Create New Profile', description: 'Verify user can create a new profile.', priority: 'Medium', status: 'Draft', module: 'User Management', createdAt: now, updatedAt: now },
      { id: 'TC004', testPlanId: 'TP002', title: 'Update Profile Information', description: 'Verify profile information can be updated.', priority: 'Medium', status: 'Ready', module: 'User Management', createdAt: now, updatedAt: now },
      { id: 'TC005', testPlanId: 'TP003', title: 'Password Reset Functionality', description: 'Test the password reset flow.', priority: 'High', status: 'Obsolete', module: 'Authentication', createdAt: now, updatedAt: now },
    ];
    for (const tc of cases) {
      db.insert(testCases).values(tc).run?.() ?? db.insert(testCases).values(tc);
    }
    console.log('Seeded test cases');
  }
} 