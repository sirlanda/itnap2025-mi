import { getTestCaseAction } from '@/server/actions/test-case-actions';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Edit } from 'lucide-react';

interface ViewTestCasePageProps {
  params: { id: string };
}

export default async function ViewTestCasePage({ params }: ViewTestCasePageProps) {
  const { id } = params;
  const testCase = await getTestCaseAction(id);

  if (!testCase) {
    notFound();
  }
  
  const getPriorityBadgeVariant = (priority: typeof testCase.priority) => {
    switch (priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      case 'Low': return 'default';
      default: return 'outline';
    }
  };

  const getStatusBadgeVariant = (status: typeof testCase.status) => {
    switch (status) {
      case 'Ready': return 'default';
      case 'Draft': return 'secondary';
      case 'Obsolete': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl mb-1">{testCase.title}</CardTitle>
              <CardDescription>Details for Test Case: {testCase.id}</CardDescription>
            </div>
            <Link href={`/test-cases/${testCase.id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-1">Description</h3>
            <p className="text-muted-foreground">{testCase.description}</p>
          </div>
          
          {testCase.prerequisites && (
            <div>
              <h3 className="font-semibold text-lg mb-1">Prerequisites</h3>
              <p className="text-muted-foreground">{testCase.prerequisites}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium text-sm text-foreground/80">Priority</h4>
              <Badge variant={getPriorityBadgeVariant(testCase.priority)}>{testCase.priority}</Badge>
            </div>
            <div>
              <h4 className="font-medium text-sm text-foreground/80">Status</h4>
              <Badge variant={getStatusBadgeVariant(testCase.status)}>{testCase.status}</Badge>
            </div>
            <div>
              <h4 className="font-medium text-sm text-foreground/80">Module</h4>
              <p className="text-muted-foreground">{testCase.module || 'N/A'}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Test Steps</h3>
            {testCase.steps && testCase.steps.length > 0 ? (
              <ul className="space-y-4">
                {testCase.steps.map((step, index) => (
                  <li key={index} className="p-3 border rounded-md bg-muted/20">
                    <p className="font-medium text-foreground">Step {index + 1}</p>
                    <p className="text-sm mt-1"><strong className="text-foreground/90">Instruction:</strong> {step.instruction}</p>
                    <p className="text-sm"><strong className="text-foreground/90">Expected Result:</strong> {step.expectedResult}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No steps defined for this test case.</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <p><strong>Created At:</strong> {new Date(testCase.createdAt).toLocaleString()}</p>
            <p><strong>Last Updated:</strong> {new Date(testCase.updatedAt).toLocaleString()}</p>
          </div>

        </CardContent>
        <CardFooter>
          <Link href="/test-cases">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Test Cases
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
