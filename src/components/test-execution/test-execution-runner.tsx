'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  XCircle,
  ArrowLeftCircle,
  ArrowRightCircle,
  Save,
  Loader2,
  Paperclip,
  AlertCircle
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import type {
  TestExecutionDetail,
  TestExecutionStatus,
  TestStepWithResult
} from '@/lib/types';
import { updateStepResultAction, completeTestExecutionAction } from '@/server/actions/test-execution-actions';

interface TestExecutionRunnerProps {
  executionDetail: TestExecutionDetail;
  onComplete: () => void;
}

export function TestExecutionRunner({ executionDetail, onComplete }: TestExecutionRunnerProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [execution, setExecution] = useState(executionDetail.execution);
  const [steps, setSteps] = useState<TestStepWithResult[]>(executionDetail.steps);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const testCase = executionDetail.testCase;
  // Ensure there's a valid step and index
  const currentStep = steps.length > 0 ? steps[Math.min(currentStepIndex, steps.length - 1)] : null;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;
  const isCompleted = execution.status === 'Passed' || execution.status === 'Failed';

  // Local form state with safe default values
  const [actualResult, setActualResult] = useState('');
  const [comment, setComment] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  // Calculate progress
  const completedSteps = steps.filter(
    step => step.result && ['Passed', 'Failed'].includes(step.result.status)
  ).length;
  const progress = (completedSteps / steps.length) * 100;

  // Update form when step changes
  React.useEffect(() => {
    if (currentStep) {
      setActualResult(currentStep.result?.actualResult || '');
      setComment(currentStep.result?.comment || '');
      setAttachments([]);
    }
  }, [currentStep, currentStepIndex]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const saveStepResult = async (status?: TestExecutionStatus) => {
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      const stepData = {
        status: status || currentStep?.result?.status || 'In Progress',
        actualResult,
        comment,
        // In a real app, we would upload attachments here
      };

      const result = await updateStepResultAction(
        execution.id,
        currentStep?.id || '',
        stepData
      );

      if (result) {
        setExecution(result.execution);
        setSteps(result.steps);

        toast({
          title: "Result Saved",
          description: `Recorded result for step ${currentStepIndex + 1}`,
        });

        // Auto advance to the next step if status was provided and not the last step
        if (status && !isLastStep) {
          setTimeout(() => {
            setCurrentStepIndex(prev => prev + 1);
          }, 500);
        }
      }
    } catch (error) {
      console.error('Failed to save result:', error);
      toast({
        title: "Error",
        description: "Failed to save result. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const completeExecution = async (status: TestExecutionStatus) => {
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      const result = await completeTestExecutionAction(execution.id, status);

      if (result) {
        setExecution(result.execution);

        toast({
          title: "Test Execution Completed",
          description: `Test case has been marked as ${status}`,
        });

        onComplete();
      }
    } catch (error) {
      console.error('Failed to complete execution:', error);
      toast({
        title: "Error",
        description: "Failed to complete test execution. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      // Save current result before navigating
      saveStepResult();
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      // Save current result before navigating
      saveStepResult();
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const getStatusBadge = (status?: TestExecutionStatus) => {
    if (!status) return null;

    let variant: "default" | "secondary" | "destructive" | "outline" = "outline";

    switch (status) {
      case 'Passed': return <Badge variant="default" className="bg-green-600">Passed</Badge>;
      case 'Failed': return <Badge variant="destructive">Failed</Badge>;
      case 'Skipped': return <Badge variant="outline">Skipped</Badge>;
      case 'Blocked': return <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600">Blocked</Badge>;
      default: return <Badge variant="outline">Not Run</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{testCase.title}</CardTitle>
              <CardDescription className="mt-2">
                ID: {testCase.id} | Priority: {testCase.priority} | Module: {testCase.module || 'None'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">Description</h3>
              <p className="mt-1 text-sm">{testCase.description}</p>
            </div>

            {testCase.prerequisites && (
              <div>
                <h3 className="text-sm font-medium">Prerequisites</h3>
                <p className="mt-1 text-sm">{testCase.prerequisites}</p>
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Progress</h3>
                <span className="text-xs text-muted-foreground">
                  Step {currentStepIndex + 1} of {steps.length}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Step {currentStepIndex + 1}:</CardTitle>
          <CardDescription className="text-base font-medium mt-2">
            {currentStep?.instruction || 'No instruction available'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-medium">Expected Result</h3>
            <p className="mt-1 p-3 border rounded-md bg-muted/50">{currentStep?.expectedResult || 'No expected result available'}</p>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <h3 className="text-sm font-medium">Actual Result</h3>
              {currentStep?.result?.status && getStatusBadge(currentStep.result.status)}
            </div>
            <Textarea
              value={actualResult}
              onChange={(e) => setActualResult(e.target.value)}
              placeholder="Enter what actually happened when executing this step..."
              rows={3}
              disabled={isProcessing || isCompleted}
              className="w-full"
            />
          </div>

          <div>
            <h3 className="text-sm font-medium">Comments</h3>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add any comments or observations..."
              rows={2}
              disabled={isProcessing || isCompleted}
              className="w-full"
            />
          </div>

          <div>
            <h3 className="text-sm font-medium">Attachments</h3>
            <div className="flex items-center mt-2">
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex items-center gap-2 px-3 py-2 bg-muted rounded-md hover:bg-muted/80 transition-colors"
              >
                <Paperclip className="h-4 w-4" />
                <span>{attachments.length > 0 ? `${attachments.length} file(s) selected` : "Add screenshots or logs"}</span>
              </label>
              <input
                id="file-upload"
                type="file"
                multiple
                onChange={handleFileChange}
                disabled={isProcessing || isCompleted}
                className="sr-only"
              />
            </div>
            {attachments.length > 0 && (
              <div className="mt-2 text-sm text-muted-foreground">
                {attachments.map(file => (
                  <div key={file.name} className="flex items-center gap-1">
                    <Paperclip className="h-3 w-3" />
                    {file.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between border-t pt-6 gap-4">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={isFirstStep || isProcessing || isCompleted}
            >
              <ArrowLeftCircle className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={handleNext}
              disabled={isLastStep || isProcessing || isCompleted}
            >
              Next
              <ArrowRightCircle className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="flex space-x-2">
            {isProcessing ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => saveStepResult('Passed')}
                  variant="outline"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={isCompleted}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Pass
                </Button>
                <Button
                  onClick={() => saveStepResult('Failed')}
                  variant="destructive"
                  disabled={isCompleted}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Fail
                </Button>
                <Button
                  onClick={() => saveStepResult('Blocked')}
                  variant="secondary"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                  disabled={isCompleted}
                >
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Blocked
                </Button>
                <Button
                  onClick={() => saveStepResult()}
                  variant="default"
                  disabled={isCompleted}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </>
            )}
          </div>
        </CardFooter>
      </Card>

      {isLastStep && completedSteps === steps.length && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => completeExecution('Passed')}
                variant="outline"
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={isProcessing || isCompleted}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Complete as Passed
              </Button>
              <Button
                onClick={() => completeExecution('Failed')}
                variant="destructive"
                disabled={isProcessing || isCompleted}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Complete as Failed
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
