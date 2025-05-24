'use server';

import { db, testCases, testSteps, testExecutions, testStepResults, testPlans, testPlanTestCases } from '@/lib/db';
import { eq, and, desc, asc } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import type { TestExecutionStatus, TestPlanExecution } from '@/lib/types';

// Get all test executions for a specific test plan
export async function getTestPlanExecutionsAction(testPlanId: string): Promise<TestPlanExecution[]> {
  try {
    // Get executions related to the test plan
    const executionsWithTestCases = await db.select({
      execution: testExecutions,
      testCase: testCases,
    })
    .from(testExecutions)
    .innerJoin(testCases, eq(testExecutions.testCaseId, testCases.id))
    .where(eq(testExecutions.testPlanId, testPlanId))
    .orderBy(asc(testCases.id));

    return executionsWithTestCases.map(item => ({
      execution: item.execution,
      testCase: item.testCase,
    }));
  } catch (error) {
    console.error('Failed to get test plan executions:', error);
    throw new Error('Failed to load test plan executions');
  }
}

// Start a new test execution session for a test plan
export async function startTestPlanExecutionAction(testPlanId: string) {
  try {
    const now = new Date().toISOString();

    // Get the test plan
    const testPlanResult = await db.select().from(testPlans).where(eq(testPlans.id, testPlanId));
    const testPlan = testPlanResult[0];

    if (!testPlan) {
      throw new Error(`Test plan with ID ${testPlanId} not found`);
    }

    // Get all test cases associated with this test plan
    const testCaseRelations = await db.select({
      testCaseId: testPlanTestCases.testCaseId
    })
    .from(testPlanTestCases)
    .where(eq(testPlanTestCases.testPlanId, testPlanId))
    .orderBy(asc(testPlanTestCases.addedAt));

    if (testCaseRelations.length === 0) {
      throw new Error(`No test cases found for test plan with ID ${testPlanId}`);
    }

    // Get the full test case details for each case in the plan
    const testCaseIds = testCaseRelations.map(rel => rel.testCaseId);
    const testCasesData = await Promise.all(
      testCaseIds.map(async (id) => {
        const executionId = randomUUID();

        // Check if there's already an execution for this test case in this plan
        const existingExecution = await db.select()
          .from(testExecutions)
          .where(and(
            eq(testExecutions.testCaseId, id),
            eq(testExecutions.testPlanId, testPlanId)
          ));

        // If no execution exists, create one
        if (existingExecution.length === 0) {
          // Create test execution record for each test case
          await db.insert(testExecutions).values({
            id: executionId,
            testCaseId: id,
            testPlanId,
            status: 'Not Started',
            startedAt: now,
            updatedAt: now,
            executedBy: 'current-user', // In a real app, get from auth context
          });

          // Get the test case details
          const testCaseResult = await db.select().from(testCases).where(eq(testCases.id, id));
          const testCase = testCaseResult[0];

          // Get the test steps
          const stepsResult = await db.select().from(testSteps).where(eq(testSteps.testCaseId, id));

          // Create initial step results with "Not Started" status
          if (stepsResult.length > 0) {
            const stepResults = stepsResult.map(step => ({
              id: randomUUID(),
              executionId,
              stepId: step.id,
              status: 'Not Started' as TestExecutionStatus,
              createdAt: now,
              updatedAt: now,
            }));

            await db.insert(testStepResults).values(stepResults);
          }

          return {
            executionId,
            testCase,
            steps: stepsResult,
          };
        } else {
          // Just return the existing execution details
          const testCaseResult = await db.select().from(testCases).where(eq(testCases.id, id));
          return {
            executionId: existingExecution[0].id,
            testCase: testCaseResult[0],
            steps: []
          };
        }
      })
    );

    // Update the test plan status to "Active"
    await db.update(testPlans)
      .set({
        status: 'Active',
        updatedAt: now,
      })
      .where(eq(testPlans.id, testPlanId));

    return {
      testPlan,
      testCaseExecutions: testCasesData
    };
  } catch (error) {
    console.error('Failed to start test plan execution:', error);
    throw error;
  }
}

// Update the status of the test plan based on individual test case execution statuses
export async function updateTestPlanStatusAction(testPlanId: string) {
  try {
    // Get all executions for the test plan
    const executions = await db.select()
      .from(testExecutions)
      .where(eq(testExecutions.testPlanId, testPlanId));

    if (executions.length === 0) {
      return { success: false, message: 'No executions found for this test plan' };
    }

    // Check if all executions are completed
    const allCompleted = executions.every(exec =>
      ['Passed', 'Failed', 'Skipped'].includes(exec.status)
    );

    // If all executions are completed, update the test plan status
    if (allCompleted) {
      const hasFailed = executions.some(exec => exec.status === 'Failed');
      const now = new Date().toISOString();

      await db.update(testPlans)
        .set({
          status: hasFailed ? 'Failed' : 'Completed',
          updatedAt: now,
        })
        .where(eq(testPlans.id, testPlanId));

      return {
        success: true,
        completed: true,
        status: hasFailed ? 'Failed' : 'Completed'
      };
    }

    // If not all completed, check if any are in progress
    const anyInProgress = executions.some(exec =>
      exec.status === 'In Progress'
    );

    if (anyInProgress) {
      return {
        success: true,
        completed: false,
        status: 'Active'
      };
    }

    return {
      success: true,
      completed: false,
      status: 'Active'
    };
  } catch (error) {
    console.error('Failed to update test plan status:', error);
    return { success: false, message: 'Failed to update test plan status' };
  }
}
