import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Edit, CalendarDays, Info, TestTube } from 'lucide-react';
import type { TestPlan, TestPlanStatus } from '@/lib/types';
import { notFound } from 'next/navigation';
import { db, testPlans, testPlanTestCases, testCases } from '@/lib/db';
import { eq } from 'drizzle-orm';
import TestCaseManager from './TestCaseManager';

async function getTestPlan(id: string): Promise<TestPlan | null> {
  try {
    const plan = await db.select().from(testPlans).where(eq(testPlans.id, id));
    
    if (plan.length === 0) {
      return null;
    }
    
    return plan[0] as TestPlan;
  } catch (error) {
    console.error('Error fetching test plan:', error);
    return null;
  }
}

async function getTestPlanTestCases(testPlanId: string) {
  try {
    const result = await db
      .select({
        testCase: testCases,
        addedAt: testPlanTestCases.addedAt,
        addedBy: testPlanTestCases.addedBy,
      })
      .from(testPlanTestCases)
      .innerJoin(testCases, eq(testPlanTestCases.testCaseId, testCases.id))
      .where(eq(testPlanTestCases.testPlanId, testPlanId));

    return result;
  } catch (error) {
    console.error('Error fetching test plan test cases:', error);
    return [];
  }
}

interface ViewTestPlanPageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewTestPlanPage({ params }: ViewTestPlanPageProps) {
  const { id } = await params;
  const testPlan = await getTestPlan(id);
  const linkedTestCases = await getTestPlanTestCases(id);

  if (!testPlan) {
    notFound();
  }
  
  const getStatusBadgeVariant = (status: TestPlanStatus) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Completed': return 'secondary';
      case 'Cancelled': return 'destructive';
      case 'Draft': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl mb-1">{testPlan.name}</CardTitle>
              <CardDescription>Details for Test Plan: {testPlan.id}</CardDescription>
            </div>
            <Link href={`/test-plans/${testPlan.id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div className="p-4 border rounded-md bg-muted/20">
            <div className="flex items-center text-lg font-semibold mb-2">
              <Info className="mr-2 h-5 w-5 text-primary" />
              General Information
            </div>
            <p><strong className="text-foreground/90">Description:</strong> {testPlan.description}</p>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
              <div><strong className="text-foreground/90">Status:</strong> <Badge variant={getStatusBadgeVariant(testPlan.status)}>{testPlan.status}</Badge></div>
              <p><strong className="text-foreground/90">Created By:</strong> {testPlan.createdBy || 'N/A'}</p>
              <p><strong className="text-foreground/90">Created At:</strong> {new Date(testPlan.createdAt).toLocaleString()}</p>
              <p><strong className="text-foreground/90">Last Updated:</strong> {new Date(testPlan.updatedAt).toLocaleString()}</p>
            </div>
          </div>

          <div className="p-4 border rounded-md bg-muted/20">
            <div className="flex items-center text-lg font-semibold mb-2">
              <CalendarDays className="mr-2 h-5 w-5 text-primary" />
              Schedule
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
              <p><strong className="text-foreground/90">Start Date:</strong> {testPlan.startDate ? new Date(testPlan.startDate).toLocaleDateString() : 'N/A'}</p>
              <p><strong className="text-foreground/90">End Date:</strong> {testPlan.endDate ? new Date(testPlan.endDate).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>

          <div className="p-4 border rounded-md bg-muted/20">
            <div className="flex items-center text-lg font-semibold mb-2">
              <TestTube className="mr-2 h-5 w-5 text-primary" />
              Test Cases ({linkedTestCases.length})
            </div>
            <TestCaseManager 
              testPlanId={testPlan.id} 
              initialTestCases={linkedTestCases}
            />
          </div>

        </CardContent>
        <CardFooter>
          <Link href="/test-plans">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Test Plans
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
} 