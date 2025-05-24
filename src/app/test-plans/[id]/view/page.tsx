import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Edit, ListOrdered, CalendarDays, Info } from 'lucide-react';
import type { TestPlan, TestExecutionStatus } from '@/lib/types';

// Mock data fetching function for a single test plan
async function getTestPlanAction(id: string): Promise<TestPlan | null> {
  const mockTestPlans: TestPlan[] = [
    { id: 'TP001', name: 'Sprint 2 Regression Suite', description: 'Regression tests for Sprint 2 features.', testCaseIds: ['TC001', 'TC002'], plannedStartDate: '2024-08-01', plannedEndDate: '2024-08-05', executionStatus: 'Not Started', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'TP002', name: 'User Authentication Tests', description: 'Comprehensive testing of user auth flows.', testCaseIds: ['TC001', 'TC002', 'TC005'], plannedStartDate: '2024-08-10', plannedEndDate: '2024-08-12', executionStatus: 'In Progress', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ];
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
  return mockTestPlans.find(tp => tp.id === id) || null;
}


interface ViewTestPlanPageProps {
  params: { id: string };
}

export default async function ViewTestPlanPage({ params }: ViewTestPlanPageProps) {
  const { id } = params;
  const testPlan = await getTestPlanAction(id);

  if (!testPlan) {
    // In a real app, you'd use Next.js's notFound()
    return <div className="container mx-auto py-8 text-center">Test Plan not found.</div>;
  }
  
  const getStatusBadgeVariant = (status?: TestExecutionStatus) => {
    switch (status) {
      case 'Passed': return 'default';
      case 'Failed': return 'destructive';
      case 'In Progress': return 'secondary';
      case 'Not Started': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl mb-1">{testPlan.name}</CardTitle>
              <CardDescription>Details for Test Plan: {testPlan.id}</CardDescription>
            </div>
            <Link href={`/test-plans/${testPlan.id}/edit`}> {/* Placeholder Edit Link */}
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
            <p><strong className="text-foreground/90">Description:</strong> {testPlan.description || 'N/A'}</p>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
              <p><strong className="text-foreground/90">Status:</strong> <Badge variant={getStatusBadgeVariant(testPlan.executionStatus)}>{testPlan.executionStatus || 'N/A'}</Badge></p>
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
              <p><strong className="text-foreground/90">Planned Start Date:</strong> {testPlan.plannedStartDate ? new Date(testPlan.plannedStartDate).toLocaleDateString() : 'N/A'}</p>
              <p><strong className="text-foreground/90">Planned End Date:</strong> {testPlan.plannedEndDate ? new Date(testPlan.plannedEndDate).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
          
          <div className="p-4 border rounded-md bg-muted/20">
             <div className="flex items-center text-lg font-semibold mb-2">
                <ListOrdered className="mr-2 h-5 w-5 text-primary" />
                Included Test Cases
            </div>
            {testPlan.testCaseIds && testPlan.testCaseIds.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {testPlan.testCaseIds.map(tcId => (
                  <Badge key={tcId} variant="secondary" className="text-sm px-3 py-1">
                    <Link href={`/test-cases/${tcId}/view`} className="hover:underline">{tcId}</Link>
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No test cases assigned to this plan.</p>
            )}
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
