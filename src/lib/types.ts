export type Priority = 'Low' | 'Medium' | 'High';
export type TestCaseStatus = 'Draft' | 'Ready' | 'Obsolete';
export type TestExecutionStatus = 'Not Started' | 'In Progress' | 'Passed' | 'Failed' | 'Blocked' | 'Skipped';

export interface TestStep {
  id: string;
  instruction: string;
  expectedResult: string;
  actualResult?: string;
  status?: TestExecutionStatus;
  comment?: string;
  attachments?: File[]; // For client-side handling
}

export interface TestCase {
  id: string; // Unique identifier
  title: string;
  description: string;
  prerequisites?: string;
  steps: TestStep[];
  priority: Priority;
  status: TestCaseStatus;
  module?: string; // For categorization
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  assignedTo?: string; // User ID or name
}

export interface TestPlan {
  id: string; // Unique identifier
  name: string;
  description: string;
  testCaseIds: string[]; // List of test case IDs
  plannedStartDate?: string; // ISO Date string
  plannedEndDate?: string; // ISO Date string
  executionStatus?: TestExecutionStatus; // Overall status
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
}

export interface TestResultSummary {
  totalTestCases: number;
  passed: number;
  failed: number;
  skipped: number;
  inProgress: number;
  notStarted: number;
}

export interface Report {
  id: string;
  title: string;
  generatedAt: string; // ISO Date string
  summary: TestResultSummary;
  detailedResults: TestCase[]; // Could be a subset of test cases with their execution details
  format?: 'XML' | 'Excel' | 'PDF' | 'DOCX';
}

// For react-hook-form
export interface TestCaseFormData {
  title: string;
  description: string;
  prerequisites?: string;
  priority: Priority;
  status: TestCaseStatus;
  module?: string;
  steps: { instruction: string; expectedResult: string }[];
}
