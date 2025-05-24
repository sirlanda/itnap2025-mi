'use server';

import { db, testCases, testSteps, testExecutions, testStepResults } from '@/lib/db';
import { eq, and, desc } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import type { TestExecutionStatus, TestExecutionDetail } from '@/lib/types';
import { updateTestPlanStatusAction } from './test-plan-execution-actions';

// Get a test execution with its step results
export async function getTestExecutionAction(executionId: string): Promise<TestExecutionDetail | null> {
  try {
    // Get execution details
    const executionResult = await db.select().from(testExecutions).where(eq(testExecutions.id, executionId));
    const execution = executionResult[0];

    if (!execution) {
      return null;
    }

    // Get the test case
    const testCaseResult = await db.select().from(testCases).where(eq(testCases.id, execution.testCaseId));
    const testCase = testCaseResult[0];

    // Get the test steps
    const stepsResult = await db.select().from(testSteps).where(eq(testSteps.testCaseId, execution.testCaseId));

    // Get the step results
    const stepResultsData = await db.select().from(testStepResults).where(eq(testStepResults.executionId, executionId));

    // Map step results to their corresponding steps
    const stepsWithResults = stepsResult.map(step => {
      const stepResult = stepResultsData.find(result => result.stepId === step.id);
      return {
        ...step,
        result: stepResult || null,
      };
    });

    return {
      execution,
      testCase,
      steps: stepsWithResults,
    };
  } catch (error) {
    console.error('Failed to get test execution:', error);
    throw new Error('Failed to load test execution');
  }
}

// Start a test case execution that wasn't previously started
export async function startTestExecutionAction(testCaseId: string, testPlanId?: string) {
  try {
    const now = new Date().toISOString();
    const executionId = randomUUID();

    // Create execution record
    await db.insert(testExecutions).values({
      id: executionId,
      testCaseId,
      testPlanId,
      status: 'In Progress',
      startedAt: now,
      updatedAt: now,
      executedBy: 'current-user', // In a real app, get from auth context
    });

    // Get test case details
    const testCaseResult = await db.select().from(testCases).where(eq(testCases.id, testCaseId));
    const testCase = testCaseResult[0];

    if (!testCase) {
      throw new Error(`Test case with ID ${testCaseId} not found`);
    }

    // Get test steps
    const stepsResult = await db.select().from(testSteps).where(eq(testSteps.testCaseId, testCaseId));

    // Create initial step results
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

    return await getTestExecutionAction(executionId);
  } catch (error) {
    console.error('Failed to start test execution:', error);
    throw new Error('Failed to start test execution');
  }
}

// Update a test step result
export async function updateStepResultAction(
  executionId: string,
  stepId: string,
  data: {
    status: TestExecutionStatus;
    actualResult?: string;
    comment?: string;
  }
) {
  try {
    const now = new Date().toISOString();

    // First check if the execution exists
    const executionResult = await db.select().from(testExecutions).where(eq(testExecutions.id, executionId));
    const execution = executionResult[0];

    if (!execution) {
      throw new Error('Test execution not found');
    }

    // Update the step result
    await db.update(testStepResults)
      .set({
        status: data.status,
        actualResult: data.actualResult,
        comment: data.comment,
        updatedAt: now,
      })
      .where(
        and(
          eq(testStepResults.executionId, executionId),
          eq(testStepResults.stepId, stepId)
        )
      );

    // Check if all steps are completed (Passed, Failed, or Skipped)
    const stepResults = await db.select()
      .from(testStepResults)
      .where(eq(testStepResults.executionId, executionId));

    const allCompleted = stepResults.every(result =>
      ['Passed', 'Failed', 'Skipped'].includes(result.status)
    );

    const hasFailed = stepResults.some(result => result.status === 'Failed');

    // Update the execution status based on step results
    let newStatus: TestExecutionStatus = 'In Progress';
    if (allCompleted) {
      newStatus = hasFailed ? 'Failed' : 'Passed';
    }

    // Update execution status
    await db.update(testExecutions)
      .set({
        status: newStatus,
        completedAt: allCompleted ? now : undefined,
        updatedAt: now,
      })
      .where(eq(testExecutions.id, executionId));

    // If part of a test plan, update the test plan status
    if (execution.testPlanId) {
      await updateTestPlanStatusAction(execution.testPlanId);
    }

    // Return updated execution
    return await getTestExecutionAction(executionId);
  } catch (error) {
    console.error('Failed to update step result:', error);
    throw new Error('Failed to update step result');
  }
}

// Complete a test execution
export async function completeTestExecutionAction(executionId: string, status: TestExecutionStatus) {
  try {
    const now = new Date().toISOString();

    // Get the execution to check if it belongs to a test plan
    const executionResult = await db.select().from(testExecutions).where(eq(testExecutions.id, executionId));
    const execution = executionResult[0];

    if (!execution) {
      throw new Error('Test execution not found');
    }

    // Update the execution
    await db.update(testExecutions)
      .set({
        status,
        completedAt: now,
        updatedAt: now,
      })
      .where(eq(testExecutions.id, executionId));

    // If this execution is part of a test plan, update the test plan status
    if (execution.testPlanId) {
      await updateTestPlanStatusAction(execution.testPlanId);
    }

    return await getTestExecutionAction(executionId);
  } catch (error) {
    console.error('Failed to complete test execution:', error);
    throw new Error('Failed to complete test execution');
  }
}

// Pause a test execution
export async function pauseTestExecutionAction(executionId: string) {
  try {
    const now = new Date().toISOString();

    await db.update(testExecutions)
      .set({
        updatedAt: now,
      })
      .where(eq(testExecutions.id, executionId));

    return await getTestExecutionAction(executionId);
  } catch (error) {
    console.error('Failed to pause test execution:', error);
    throw new Error('Failed to pause test execution');
  }
}

// Get recent test executions
export async function getRecentTestExecutionsAction(limit = 5) {
  try {
    const result = await db.select({
      execution: testExecutions,
      testCase: testCases,
    })
    .from(testExecutions)
    .innerJoin(testCases, eq(testExecutions.testCaseId, testCases.id))
    .orderBy(desc(testExecutions.updatedAt))
    .limit(limit);

    return result;
  } catch (error) {
    console.error('Failed to get recent test executions:', error);
    return [];
  }
}

