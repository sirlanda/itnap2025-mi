'use client';

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlayCircle, ListChecks, Clock, ArrowRight, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { TestExecutionRunner } from "@/components/test-execution/test-execution-runner";
import { startTestExecutionAction, getTestExecutionAction, getRecentTestExecutionsAction } from "@/server/actions/test-execution-actions";
import type { TestExecutionDetail, RecentExecution, TestExecutionStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getTestCaseAction } from "@/server/actions/test-case-actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export default function TestExecutionPage() {
  const [activeExecution, setActiveExecution] = useState<TestExecutionDetail | null>(null);
  const [recentExecutions, setRecentExecutions] = useState<RecentExecution[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [selectedTestCase, setSelectedTestCase] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // Check if we have an execution ID in the URL
  const executionId = searchParams.get('execution');
  const testCaseId = searchParams.get('testCase');

  useEffect(() => {
    // Fetch recent executions when the page loads
    const fetchRecentExecutions = async () => {
      try {
        const recents = await getRecentTestExecutionsAction();
        setRecentExecutions(recents);
      } catch (error) {
        console.error("Failed to fetch recent executions:", error);
      }
    };

    fetchRecentExecutions();
  }, []);

  useEffect(() => {
    // If we have an execution ID in the URL, load that execution
    if (executionId) {
      setIsLoading(true);

      const fetchExecution = async () => {
        try {
          const execution = await getTestExecutionAction(executionId);
          if (execution) {
            setActiveExecution(execution);
          } else {
            toast({
              title: "Execution not found",
              description: "The requested test execution could not be found.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Failed to fetch execution:", error);
          toast({
            title: "Error",
            description: "Failed to load test execution. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchExecution();
    } else if (testCaseId) {
      // If we have a test case ID, select it for execution
      setSelectedTestCase(testCaseId);
    }
  }, [executionId, testCaseId, toast]);

  const handleStartExecution = async () => {
    if (!selectedTestCase) {
      toast({
        title: "No test case selected",
        description: "Please select a test case to execute.",
        variant: "destructive",
      });
      return;
    }

    setLoadingId(selectedTestCase);

    try {
      // Start a new test execution
      const result = await startTestExecutionAction(selectedTestCase);

      // Update the URL with the execution ID
      router.push(`/test-execution?execution=${result.executionId}`);

      // Set the active execution
      setActiveExecution({
        execution: result.execution,
        testCase: result.testCase,
        steps: result.steps.map(step => ({ ...step, result: null })),
      });

      toast({
        title: "Test execution started",
        description: `Started executing test case: ${result.testCase.title}`,
      });
    } catch (error) {
      console.error("Failed to start execution:", error);
      toast({
        title: "Error",
        description: "Failed to start test execution. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingId(null);
    }
  };

  const handleCompleteExecution = () => {
    // Clear the active execution
    setActiveExecution(null);

    // Refresh recent executions
    getRecentTestExecutionsAction().then(setRecentExecutions);

    // Navigate back to the main test execution page
    router.push('/test-execution');
  };

  const getStatusBadge = (status: TestExecutionStatus) => {
    let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
    let icon = null;

    switch (status) {
      case 'Passed':
        variant = "default"; // green
        icon = <CheckCircle className="h-4 w-4 mr-1" />;
        break;
      case 'Failed':
        variant = "destructive"; // red
        icon = <XCircle className="h-4 w-4 mr-1" />;
        break;
      case 'In Progress':
        variant = "secondary"; // blue-ish
        icon = <Loader2 className="h-4 w-4 mr-1 animate-spin" />;
        break;
    }

    return (
      <Badge variant={variant} className="flex items-center">
        {icon}
        {status}
      </Badge>
    );
  };

  // If a test execution is active, show the test execution runner
  if (activeExecution) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Test Execution</h1>
          <Link href="/test-execution">
            <Button variant="outline">Back to All Executions</Button>
          </Link>
        </div>

        {isLoading ? (
          <Card className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2 text-lg">Loading test execution...</p>
          </Card>
        ) : (
          <TestExecutionRunner
            executionDetail={activeExecution}
            onComplete={handleCompleteExecution}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Test Execution</h1>
      </div>

      <Tabs defaultValue="new">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="new">Execute Test Case</TabsTrigger>
          <TabsTrigger value="recent">Recent Executions</TabsTrigger>
        </TabsList>

        <TabsContent value="new">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <PlayCircle className="mr-2 h-6 w-6 text-primary" />
                Start a Test Execution
              </CardTitle>
              <CardDescription>
                Select a test case to begin executing and recording results.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="testCase" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Select Test Case
                  </label>
                  <Select value={selectedTestCase || ""} onValueChange={setSelectedTestCase}>
                    <SelectTrigger id="testCase">
                      <SelectValue placeholder="Select a test case" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="TC001">TC001 - User Login with Valid Credentials</SelectItem>
                      <SelectItem value="TC002">TC002 - User Login with Invalid Credentials</SelectItem>
                      <SelectItem value="TC003">TC003 - Create New Profile</SelectItem>
                      <SelectItem value="TC004">TC004 - Update Profile Information</SelectItem>
                      <SelectItem value="TC005">TC005 - Password Reset Functionality</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleStartExecution} disabled={!selectedTestCase || !!loadingId}>
                    {loadingId === selectedTestCase ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Starting...
                      </>
                    ) : (
                      <>
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Start Execution
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="text-center mt-4">
                <p className="text-sm text-muted-foreground">
                  Don't see the test case you want? Browse all available test cases.
                </p>
                <Link href="/test-cases" className="inline-flex mt-2">
                  <Button variant="link" className="mx-auto">
                    View All Test Cases
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Clock className="mr-2 h-6 w-6 text-primary" />
                Recent Test Executions
              </CardTitle>
              <CardDescription>
                Continue an in-progress execution or review completed ones.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentExecutions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No recent test executions found.</p>
                  <p className="text-sm mt-2">Start a new test execution to see it here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentExecutions.map((item) => (
                    <div key={item.execution.id} className="flex items-center justify-between border-b pb-4">
                      <div className="space-y-1">
                        <h3 className="font-medium">{item.testCase.title}</h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>ID: {item.testCase.id}</span>
                          <span>•</span>
                          <span>Started: {new Date(item.execution.startedAt).toLocaleDateString()}</span>
                          {getStatusBadge(item.execution.status)}
                        </div>
                      </div>
                      <Button
                        onClick={() => router.push(`/test-execution?execution=${item.execution.id}`)}
                        variant="outline"
                        disabled={loadingId === item.execution.id}
                      >
                        {loadingId === item.execution.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          item.execution.status === 'In Progress' ? 'Continue' : 'View'
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
