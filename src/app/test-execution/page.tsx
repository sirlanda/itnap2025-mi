import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlayCircle, ListChecks } from "lucide-react";
import Image from "next/image";

export default function TestExecutionPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Test Execution</h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <PlayCircle className="mr-2 h-6 w-6 text-primary" />
            Start a Test Execution Session
          </CardTitle>
          <CardDescription>Select a test plan to begin executing test cases and recording results.</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6 py-12">
          <Image 
            src="https://placehold.co/600x400.png" 
            alt="Test execution illustration" 
            width={600} 
            height={400} 
            className="mx-auto rounded-lg shadow-md mb-6"
            data-ai-hint="testing process" 
          />
          <p className="text-lg text-muted-foreground">
            Ready to run some tests? Choose an active test plan to get started.
          </p>
          <Link href="/test-plans">
            <Button size="lg">
              <ListChecks className="mr-2 h-5 w-5" />
              View Test Plans
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground mt-4">
            The test execution interface will allow you to step through test cases, mark their status, and add comments or attachments.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle>Current Executions (Placeholder)</CardTitle>
            <CardDescription>This section will list ongoing or recently paused test executions.</CardDescription>
        </CardHeader>
        <CardContent className="h-40 flex items-center justify-center bg-muted/30 rounded-md">
            <p className="text-muted-foreground">No active executions at the moment.</p>
        </CardContent>
      </Card>
    </div>
  );
}
