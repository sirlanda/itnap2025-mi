import { NextResponse } from 'next/server';
import { db, testPlanTestCases } from '@/lib/db';
import { eq, and } from 'drizzle-orm';

// Remove a test case from a test plan
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; testCaseId: string }> }
) {
  try {
    const { id, testCaseId } = await params;
    
    await db
      .delete(testPlanTestCases)
      .where(
        and(
          eq(testPlanTestCases.testPlanId, id),
          eq(testPlanTestCases.testCaseId, testCaseId)
        )
      );

    return NextResponse.json({ 
      message: 'Test case removed from test plan successfully' 
    });
  } catch (error) {
    console.error('Error removing test case from test plan:', error);
    return NextResponse.json(
      { error: 'Failed to remove test case from test plan' },
      { status: 500 }
    );
  }
} 