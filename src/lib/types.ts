export type Priority = 'Low' | 'Medium' | 'High';
export type TestCaseStatus = 'Draft' | 'Ready' | 'Obsolete';
export type TestExecutionStatus = 'Not Started' | 'In Progress' | 'Passed' | 'Failed' | 'Blocked' | 'Skipped';
export type TestPlanStatus = 'Active' | 'Completed' | 'Cancelled' | 'Draft';

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
  id: string;
  name: string;
  description: string;
  startDate?: string; // ISO Date string
  endDate?: string; // ISO Date string
  status: TestPlanStatus;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  createdBy?: string;
}

export interface TestStepResult {
  id: string;
  stepId: string;
  executionId: string;
  status: TestExecutionStatus;
  actualResult?: string;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TestStepWithResult extends TestStep {
  result: TestStepResult | null;
}

export interface TestExecution {
  id: string;
  testCaseId: string;
  testPlanId?: string;
  status: TestExecutionStatus;
  startedAt: string;
  completedAt?: string;
  updatedAt: string;
  executedBy?: string;
  environment?: string;
  notes?: string;
}

export interface TestExecutionDetail {
  execution: TestExecution;
  testCase: TestCase;
  steps: TestStepWithResult[];
}

export interface RecentExecution {
  execution: TestExecution;
  testCase: TestCase;
}

export interface TestCaseFormData {
  title: string;
  description: string;
  prerequisites?: string;
  priority: Priority;
  status: TestCaseStatus;
  module?: string;
  steps: {
    instruction: string;
    expectedResult: string;
  }[];
}

export interface TestResultSummary {
  totalTestCases: number;
  passed: number;
  failed: number;
  skipped: number;
  inProgress: number;
  notStarted: number;
}
