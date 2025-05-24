'use server';

import type {TestCaseFormData, TestExecutionStatus, TestStep} from '@/lib/types';
import {db, testCases, testSteps} from '@/lib/db';
import {eq} from 'drizzle-orm';
import {randomUUID} from 'crypto';

export async function saveTestCaseAction(data: TestCaseFormData, id?: string) {
  if (id) {
    // Update existing test case
    await db.update(testCases)
      .set({
        ...data,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(testCases.id, id));

    // Delete existing steps and recreate them
    await db.delete(testSteps)
      .where(eq(testSteps.testCaseId, id));

    // Insert new steps
    if (data.steps && data.steps.length > 0) {
      const stepsToInsert = data.steps.map(step => ({
        id: randomUUID(),
        testCaseId: id,
        instruction: step.instruction,
        expectedResult: step.expectedResult,
      }));
      await db.insert(testSteps).values(stepsToInsert);
    }

    // Get updated test case with steps
    return await getTestCaseWithStepsById(id);
  } else {
    // Create new test case
    const newId = randomUUID();
    const now = new Date().toISOString();
    await db.insert(testCases).values({
      ...data,
      id: newId,
      createdAt: now,
      updatedAt: now,
    });

    // Insert steps
    if (data.steps && data.steps.length > 0) {
      const stepsToInsert = data.steps.map(step => ({
        id: randomUUID(),
        testCaseId: newId,
        instruction: step.instruction,
        expectedResult: step.expectedResult,
      }));
      await db.insert(testSteps).values(stepsToInsert);
    }

    // Get the created test case with steps
    return await getTestCaseWithStepsById(newId);
  }
}

export async function getTestCaseAction(id: string) {
  return getTestCaseWithStepsById(id);
}

export async function getAllTestCasesAction() {
  // Get all test cases
  const testCaseRows = await db.select().from(testCases);

  // Get all test steps
  const allSteps = await db.select().from(testSteps);

  // Group steps by test case ID
  const stepsByTestCase = allSteps.reduce((acc, step) => {
    if (!acc[step.testCaseId]) {
      acc[step.testCaseId] = [];
    }
    acc[step.testCaseId].push({
      id: step.id,
      instruction: step.instruction,
      expectedResult: step.expectedResult,
      actualResult: step.actualResult ?? undefined,
      status: step.status as TestExecutionStatus | undefined,
      comment: step.comment ?? undefined,
    });
    return acc;
  }, {} as Record<string, TestStep[]>);

  // Combine test cases with their steps
  return testCaseRows.map(tc => ({
    ...tc,
    steps: stepsByTestCase[tc.id] || [],
  }));
}

export async function deleteTestCaseAction(id: string) {
  // Delete all related test steps first (due to foreign key constraint)
  await db.delete(testSteps).where(eq(testSteps.testCaseId, id));

  // Then delete the test case
  await db.delete(testCases).where(eq(testCases.id, id));

  return { success: true };
}

// Helper function to get a test case with its steps
async function getTestCaseWithStepsById(id: string) {
  const testCaseResult = await db.select().from(testCases).where(eq(testCases.id, id));
  const testCase = testCaseResult[0];

  if (!testCase) {
    return null;
  }

  const stepsResult = await db.select().from(testSteps).where(eq(testSteps.testCaseId, id));
  const steps = stepsResult.map(step => ({
    id: step.id,
    instruction: step.instruction,
    expectedResult: step.expectedResult,
    actualResult: step.actualResult ?? undefined,
    status: step.status as TestExecutionStatus | undefined,
    comment: step.comment ?? undefined,
  }));

  return {
    ...testCase,
    steps: steps,
  };
}
