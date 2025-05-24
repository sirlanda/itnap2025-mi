'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PlayCircle,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  ArrowRight
} from "lucide-react";
import { getTestPlanExecutionsAction } from '@/server/actions/test-execution-actions';
import type { TestExecutionStatus, TestPlanExecution } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface TestPlanExecutionListProps {
  testPlanId: string;
  onExecutionSelect: (executionId: string) => void;
}

export function TestPlanExecutionList({ testPlanId, onExecutionSelect }: TestPlanExecutionListProps) {
  const [executions, setExecutions] = useState<TestPlanExecution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchExecutions = async () => {
      try {
        setLoading(true);
        const result = await getTestPlanExecutionsAction(testPlanId);
        setExecutions(result);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch test plan executions:', err);
        setError('Failed to load test executions. Please try again.');
        toast({
          title: 'Error',
          description: 'Failed to load test executions.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchExecutions();
  }, [testPlanId, toast]);

  const getStatusIcon = (status: TestExecutionStatus) => {
    switch (status) {
      case 'Passed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'Failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'Blocked':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'In Progress':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <PlayCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadgeVariant = (status: TestExecutionStatus): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'Passed': return 'default';
      case 'Failed': return 'destructive';
      case 'Blocked': return 'secondary';
      case 'In Progress': return 'secondary';
      default: return 'outline';
    }
  };

  const getActionLabel = (status: TestExecutionStatus) => {
    switch (status) {
      case 'Not Started': return 'Start';
      case 'In Progress': return 'Continue';
      default: return 'View';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
          <p>Loading test executions...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
            <p className="text-lg font-medium">{error}</p>
            <Button
              variant="outline"
              onClick={() => router.refresh()}
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (executions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-lg font-medium text-muted-foreground">No test executions found for this test plan.</p>
            <p className="mt-2 text-sm">This test plan may not have any test cases added yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate completion percentage
  const totalExecutions = executions.length;
  const completedExecutions = executions.filter(item =>
    ['Passed', 'Failed', 'Skipped'].includes(item.execution.status)
  ).length;
  const completionPercentage = totalExecutions > 0
    ? Math.round((completedExecutions / totalExecutions) * 100)
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Plan Executions</CardTitle>
        <CardDescription>
          Execution progress: {completedExecutions} of {totalExecutions} completed ({completionPercentage}%)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Test Case</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Started</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {executions.map((item) => (
              <TableRow key={item.execution.id}>
                <TableCell className="font-medium">
                  <div>
                    <p className="font-medium">{item.testCase.title}</p>
                    <p className="text-xs text-muted-foreground">ID: {item.testCase.id}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={getStatusBadgeVariant(item.execution.status)}
                    className="flex items-center w-fit gap-1"
                  >
                    {getStatusIcon(item.execution.status)}
                    <span>{item.execution.status}</span>
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(item.execution.startedAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  {new Date(item.execution.updatedAt).toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    onClick={() => onExecutionSelect(item.execution.id)}
                    variant={
                      item.execution.status === 'In Progress' ? 'default' :
                      item.execution.status === 'Not Started' ? 'outline' : 'secondary'
                    }
                  >
                    {getActionLabel(item.execution.status)}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
