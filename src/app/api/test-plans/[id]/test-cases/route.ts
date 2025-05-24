import { NextResponse } from 'next/server';
import { db, testPlanTestCases, testCases } from '@/lib/db';
import { eq, and } from 'drizzle-orm';

// Get all test cases for a test plan
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const result = await db
      .select({
        testCase: testCases,
        addedAt: testPlanTestCases.addedAt,
        addedBy: testPlanTestCases.addedBy,
      })
      .from(testPlanTestCases)
      .innerJoin(testCases, eq(testPlanTestCases.testCaseId, testCases.id))
      .where(eq(testPlanTestCases.testPlanId, id));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching test plan test cases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch test cases' },
      { status: 500 }
    );
  }
}

// Add a test case to a test plan
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { testCaseId, addedBy } = body;

    const now = new Date().toISOString();
    
    await db.insert(testPlanTestCases).values({
      testPlanId: id,
      testCaseId,
      addedAt: now,
      addedBy: addedBy || 'Anonymous',
    });

    return NextResponse.json({ 
      message: 'Test case added to test plan successfully',
      testPlanId: id,
      testCaseId,
    });
  } catch (error) {
    console.error('Error adding test case to test plan:', error);
    return NextResponse.json(
      { error: 'Failed to add test case to test plan' },
      { status: 500 }
    );
  }
} 