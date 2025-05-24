'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MoreHorizontal, PlusCircle, Search, Edit2, Trash2, Eye, Loader2 } from 'lucide-react';
import type { TestCase, Priority, TestCaseStatus } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllTestCasesAction, deleteTestCaseAction } from '@/server/actions/test-case-actions';
import { toast } from '@/hooks/use-toast';

export default function TestCasesPage() {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<TestCaseStatus | 'all'>('all');
  const [deleteInProgress, setDeleteInProgress] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestCases = async () => {
      try {
        setLoading(true);
        const data = await getAllTestCasesAction();
        const testCasesWithSteps = data.map((tc: any) => ({
          ...tc,
          steps: tc.steps || []
        }));
        setTestCases(testCasesWithSteps);
      } catch (error) {
        console.error("Failed to fetch test cases:", error);
        toast({
          title: "Error",
          description: "Failed to load test cases. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTestCases();
  }, []);

  const filteredTestCases = useMemo(() => {
    return testCases.filter(tc => {
      const matchesSearch = tc.title.toLowerCase().includes(searchTerm.toLowerCase()) || tc.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = priorityFilter === 'all' || tc.priority === priorityFilter;
      const matchesStatus = statusFilter === 'all' || tc.status === statusFilter;
      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [testCases, searchTerm, priorityFilter, statusFilter]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this test case?')) {
      try {
        setDeleteInProgress(id);
        await deleteTestCaseAction(id);
        setTestCases(prev => prev.filter(tc => tc.id !== id));
        toast({
          title: "Success",
          description: "Test case deleted successfully",
        });
      } catch (error) {
        console.error("Failed to delete test case:", error);
        toast({
          title: "Error",
          description: "Failed to delete test case. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setDeleteInProgress(null);
      }
    }
  };
  
  const getPriorityBadgeVariant = (priority: Priority) => {
    switch (priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      case 'Low': return 'default';
      default: return 'outline';
    }
  };

  const getStatusBadgeVariant = (status: TestCaseStatus) => {
    switch (status) {
      case 'Ready': return 'default';
      case 'Draft': return 'secondary';
      case 'Obsolete': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Test Cases</h1>
        <Link href="/test-cases/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Create Test Case
          </Button>
        </Link>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Manage Your Test Cases</CardTitle>
           <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by ID or title..."
                className="pl-8 w-full sm:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={priorityFilter} onValueChange={(value: string) => setPriorityFilter(value as Priority | 'all')}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(value: string) => setStatusFilter(value as TestCaseStatus | 'all')}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Ready">Ready</SelectItem>
                <SelectItem value="Obsolete">Obsolete</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading test cases...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTestCases.length > 0 ? filteredTestCases.map((tc) => (
                    <TableRow key={tc.id}>
                      <TableCell className="font-medium">{tc.id}</TableCell>
                      <TableCell className="max-w-xs truncate">{tc.title}</TableCell>
                      <TableCell>{tc.module || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={getPriorityBadgeVariant(tc.priority)}>{tc.priority}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(tc.status)}>{tc.status}</Badge>
                      </TableCell>
                      <TableCell>{new Date(tc.updatedAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0" disabled={deleteInProgress === tc.id}>
                              {deleteInProgress === tc.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </>
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/test-cases/${tc.id}/view`}>
                                <Eye className="mr-2 h-4 w-4" /> View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/test-cases/${tc.id}/edit`}>
                                <Edit2 className="mr-2 h-4 w-4" /> Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(tc.id)}
                              className="text-destructive focus:text-destructive focus:bg-destructive/10"
                              disabled={deleteInProgress === tc.id}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        {searchTerm || priorityFilter !== 'all' || statusFilter !== 'all'
                          ? "No test cases match your filters."
                          : "No test cases found. Create your first test case!"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
