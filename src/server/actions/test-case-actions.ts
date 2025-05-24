'use server';

import type { TestCaseFormData } from '@/lib/types';
import { db, testCases } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

export async function saveTestCaseAction(data: TestCaseFormData, id?: string) {
  if (id) {
    // Update existing test case
    await db.update(testCases)
      .set({
        ...data,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(testCases.id, id));
    const updated = await db.select().from(testCases).where(eq(testCases.id, id));
    return updated[0];
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
    const created = await db.select().from(testCases).where(eq(testCases.id, newId));
    return created[0];
  }
}

export async function getTestCaseAction(id: string) {
  const result = await db.select().from(testCases).where(eq(testCases.id, id));
  return result[0] || null;
}
