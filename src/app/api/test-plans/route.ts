import { NextResponse } from 'next/server';
import { db, testPlans } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const plans = await db.select().from(testPlans);
    return NextResponse.json(plans);
  } catch (error) {
    console.error('Error fetching test plans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch test plans' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, startDate, endDate, status, createdBy } = body;
    
    const now = new Date().toISOString();
    const id = `TP${Date.now().toString().slice(-6)}`;
    
    const newPlan = {
      id,
      name,
      description,
      startDate,
      endDate,
      status: status || 'Draft',
      createdAt: now,
      updatedAt: now,
      createdBy,
    };

    await db.insert(testPlans).values(newPlan);
    return NextResponse.json(newPlan, { status: 201 });
  } catch (error) {
    console.error('Error creating test plan:', error);
    return NextResponse.json(
      { error: 'Failed to create test plan' },
      { status: 500 }
    );
  }
} 