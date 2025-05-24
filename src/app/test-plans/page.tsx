'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, Trash2, MoreHorizontal, Eye } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { TestPlan, TestPlanStatus } from '@/lib/types';

export default function TestPlansPage() {
  const [testPlans, setTestPlans] = useState<TestPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestPlans();
  }, []);

  const fetchTestPlans = async () => {
    try {
      const response = await fetch('/api/test-plans');
      if (response.ok) {
        const data = await response.json();
        setTestPlans(data);
      } else {
        console.error('Failed to fetch test plans');
      }
    } catch (error) {
      console.error('Error fetching test plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this test plan?')) {
      try {
        const response = await fetch(`/api/test-plans/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setTestPlans(prev => prev.filter(tp => tp.id !== id));
        } else {
          console.error('Failed to delete test plan');
        }
      } catch (error) {
        console.error('Error deleting test plan:', error);
      }
    }
  };

  const getStatusBadgeVariant = (status: TestPlanStatus) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Completed': return 'secondary';
      case 'Cancelled': return 'destructive';
      case 'Draft': return 'outline';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Test Plans</h1>
          <Button disabled>
            <PlusCircle className="mr-2 h-4 w-4" /> Create Test Plan
          </Button>
        </div>
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">Loading test plans...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                  <TableHead>Created By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testPlans.length > 0 ? testPlans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{plan.id}</TableCell>
                    <TableCell className="max-w-sm truncate">{plan.name}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(plan.status)}>{plan.status}</Badge>
                    </TableCell>
                    <TableCell>{plan.startDate ? new Date(plan.startDate).toLocaleDateString() : '-'}</TableCell>
                    <TableCell>{plan.endDate ? new Date(plan.endDate).toLocaleDateString() : '-'}</TableCell>
                    <TableCell>{plan.createdBy || '-'}</TableCell>
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
                            <Link href={`/test-plans/${plan.id}`}>
                              <Eye className="mr-2 h-4 w-4" /> View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/test-plans/${plan.id}/edit`}>
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
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
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
