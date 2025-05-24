import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const testCases = sqliteTable('test_cases', {
  id: text('id').primaryKey(),
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

export async function seedTestCases() {
  const existing = sqlite.prepare('SELECT COUNT(*) as count FROM test_cases').get() as { count: number };
  if (existing.count === 0) {
    const now = new Date().toISOString();
    const cases = [
      { id: 'TC001', title: 'User Login with Valid Credentials', description: 'Verify user can log in.', priority: 'High', status: 'Ready', module: 'Authentication', createdAt: now, updatedAt: now },
      { id: 'TC002', title: 'User Login with Invalid Credentials', description: 'Verify user cannot log in with wrong password.', priority: 'High', status: 'Ready', module: 'Authentication', createdAt: now, updatedAt: now },
      { id: 'TC003', title: 'Create New Profile', description: 'Verify user can create a new profile.', priority: 'Medium', status: 'Draft', module: 'User Management', createdAt: now, updatedAt: now },
      { id: 'TC004', title: 'Update Profile Information', description: 'Verify profile information can be updated.', priority: 'Medium', status: 'Ready', module: 'User Management', createdAt: now, updatedAt: now },
      { id: 'TC005', title: 'Password Reset Functionality', description: 'Test the password reset flow.', priority: 'High', status: 'Obsolete', module: 'Authentication', createdAt: now, updatedAt: now },
    ];
    for (const tc of cases) {
      db.insert(testCases).values(tc).run?.() ?? db.insert(testCases).values(tc);
    }
    console.log('Seeded test cases');
  }
}

seedTestCases(); 