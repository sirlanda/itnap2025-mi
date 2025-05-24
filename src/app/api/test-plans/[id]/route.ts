import { NextResponse } from 'next/server';
import { db, testPlans } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const plan = await db.select().from(testPlans).where(eq(testPlans.id, id));
    
    if (plan.length === 0) {
      return NextResponse.json(
        { error: 'Test plan not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(plan[0]);
  } catch (error) {
    console.error('Error fetching test plan:', error);
    return NextResponse.json(
      { error: 'Failed to fetch test plan' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, startDate, endDate, status, createdBy } = body;
    
    const updatedPlan = {
      name,
      description,
      startDate,
      endDate,
      status,
      updatedAt: new Date().toISOString(),
      createdBy,
    };

    const result = await db
      .update(testPlans)
      .set(updatedPlan)
      .where(eq(testPlans.id, id));

    return NextResponse.json({ id, ...updatedPlan });
  } catch (error) {
    console.error('Error updating test plan:', error);
    return NextResponse.json(
      { error: 'Failed to update test plan' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.delete(testPlans).where(eq(testPlans.id, id));
    return NextResponse.json({ message: 'Test plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting test plan:', error);
    return NextResponse.json(
      { error: 'Failed to delete test plan' },
      { status: 500 }
    );
  }
} 