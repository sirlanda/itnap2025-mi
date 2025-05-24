import { NextResponse } from 'next/server';
import { db, testCases } from '@/lib/db';
import { like } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    
    let query = db.select().from(testCases);
    
    if (search) {
      query = query.where(
        like(testCases.title, `%${search}%`)
      );
    }
    
    const cases = await query;
    return NextResponse.json(cases);
  } catch (error) {
    console.error('Error fetching test cases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch test cases' },
      { status: 500 }
    );
  }
} 