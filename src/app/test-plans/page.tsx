'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, Trash2, MoreHorizontal, Eye } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { TestPlan, TestExecutionStatus } from '@/lib/types';

const initialMockTestPlans: TestPlan[] = [
  { id: 'TP001', name: 'Sprint 2 Regression Suite', description: 'Regression tests for Sprint 2 features.', testCaseIds: ['TC001', 'TC002'], plannedStartDate: '2024-08-01', plannedEndDate: '2024-08-05', executionStatus: 'Not Started', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'TP002', name: 'User Authentication Tests', description: 'Comprehensive testing of user auth flows.', testCaseIds: ['TC001', 'TC002', 'TC005'], plannedStartDate: '2024-08-10', plannedEndDate: '2024-08-12', executionStatus: 'In Progress', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'TP003', name: 'New Feature Alpha Test', description: 'Testing the new alpha feature set.', testCaseIds: ['TC003', 'TC004'], plannedStartDate: '2024-08-15', executionStatus: 'Passed', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export default function TestPlansPage() {
  const [testPlans, setTestPlans] = useState<TestPlan[]>(initialMockTestPlans);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this test plan?')) {
      setTestPlans(prev => prev.filter(tp => tp.id !== id));
      // In a real app, call an API to delete
    }
  };

  const getStatusBadgeVariant = (status?: TestExecutionStatus) => {
    switch (status) {
      case 'Passed': return 'default'; // Success
      case 'Failed': return 'destructive';
      case 'In Progress': return 'secondary'; // Info/Warning
      case 'Not Started': return 'outline';
      case 'Blocked': return 'destructive';
      case 'Skipped': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Test Plans</h1>
        <Link href="/test-plans/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Create Test Plan
          </Button>
        </Link>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Manage Test Plans</CardTitle>
          <CardDescription>Organize and track your testing efforts with test plans.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testPlans.length > 0 ? testPlans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{plan.id}</TableCell>
                    <TableCell className="max-w-sm truncate">{plan.name}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(plan.executionStatus)}>{plan.executionStatus || 'N/A'}</Badge>
                    </TableCell>
                    <TableCell>{plan.plannedStartDate ? new Date(plan.plannedStartDate).toLocaleDateString() : '-'}</TableCell>
                    <TableCell>{plan.plannedEndDate ? new Date(plan.plannedEndDate).toLocaleDateString() : '-'}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/test-plans/${plan.id}/view`}> {/* Placeholder View */}
                              <Eye className="mr-2 h-4 w-4" /> View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/test-plans/${plan.id}/edit`}> {/* Placeholder Edit */}
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(plan.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      No test plans found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
