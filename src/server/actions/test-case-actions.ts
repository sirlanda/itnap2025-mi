'use server';

import type { TestCaseFormData } from '@/lib/types';

// This is a mock database. In a real app, you'd use a proper database.
let mockTestCases: Array<TestCaseFormData & { id: string; createdAt: string; updatedAt: string }> = [
    { id: 'TC001', title: 'User Login with Valid Credentials', description: 'Verify user can log in.', priority: 'High', status: 'Ready', module: 'Authentication', steps: [{instruction: 'Enter valid username', expectedResult: 'Username field accepts input'}, {instruction: 'Enter valid password', expectedResult: 'Password field accepts input'}, {instruction: 'Click login', expectedResult: 'User is logged in'}], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'TC003', title: 'Create New Profile', description: 'Verify user can create a new profile.', priority: 'Medium', status: 'Draft', module: 'User Management', steps: [{instruction: 'Navigate to registration page', expectedResult: 'Registration page loads'}, {instruction: 'Fill form', expectedResult: 'Form is filled'}, {instruction: 'Submit form', expectedResult: 'Profile created'}], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];
let nextId = 4;

export async function saveTestCaseAction(data: TestCaseFormData, id?: string): Promise<TestCaseFormData & { id: string }> {
  console.log('Saving test case:', data, 'with ID:', id);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (id) {
    // Update existing test case
    const index = mockTestCases.findIndex(tc => tc.id === id);
    if (index !== -1) {
      mockTestCases[index] = { ...mockTestCases[index], ...data, updatedAt: new Date().toISOString() };
      console.log('Updated test case:', mockTestCases[index]);
      return mockTestCases[index];
    } else {
      throw new Error('Test case not found for update.');
    }
  } else {
    // Create new test case
    const newId = `TC${String(nextId++).padStart(3, '0')}`;
    const newTestCase = { ...data, id: newId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    mockTestCases.push(newTestCase);
    console.log('Created new test case:', newTestCase);
    return newTestCase;
  }
}

export async function getTestCaseAction(id: string): Promise<(TestCaseFormData & { id: string }) | null> {
  console.log('Fetching test case with ID:', id);
  await new Promise(resolve => setTimeout(resolve, 500));
  const testCase = mockTestCases.find(tc => tc.id === id);
  return testCase || null;
}
