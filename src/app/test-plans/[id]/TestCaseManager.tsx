'use client';

import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface TestCase {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  module?: string;
}

interface LinkedTestCase {
  testCase: TestCase;
  addedAt: string;
  addedBy?: string;
}

interface TestCaseManagerProps {
  testPlanId: string;
  initialTestCases: LinkedTestCase[];
}

export default function TestCaseManager({ testPlanId, initialTestCases }: TestCaseManagerProps) {
  const [linkedTestCases, setLinkedTestCases] = useState<LinkedTestCase[]>(initialTestCases);
  const [availableTestCases, setAvailableTestCases] = useState<TestCase[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const linkedIds = new Set(linkedTestCases.map(tc => tc.testCase.id));

  const fetchAvailableTestCases = async (search: string = '') => {
    try {
      const response = await fetch(`/api/test-cases?search=${encodeURIComponent(search)}`);
      if (response.ok) {
        const cases = await response.json();
        // Filter out already linked test cases
        setAvailableTestCases(cases.filter((tc: TestCase) => !linkedIds.has(tc.id)));
      }
    } catch (error) {
      console.error('Error fetching test cases:', error);
    }
  };

  const handleAddTestCase = async (testCase: TestCase) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/test-plans/${testPlanId}/test-cases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testCaseId: testCase.id,
          addedBy: 'Current User', // In a real app, get from auth context
        }),
      });

      if (response.ok) {
        const newLinkedTestCase: LinkedTestCase = {
          testCase,
          addedAt: new Date().toISOString(),
          addedBy: 'Current User',
        };
        setLinkedTestCases(prev => [...prev, newLinkedTestCase]);
        setAvailableTestCases(prev => prev.filter(tc => tc.id !== testCase.id));
        toast({
          title: 'Test Case Added',
          description: `"${testCase.title}" has been added to the test plan.`,
        });
      } else {
        throw new Error('Failed to add test case');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add test case. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveTestCase = async (testCaseId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/test-plans/${testPlanId}/test-cases/${testCaseId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const removedTestCase = linkedTestCases.find(tc => tc.testCase.id === testCaseId);
        setLinkedTestCases(prev => prev.filter(tc => tc.testCase.id !== testCaseId));
        
        if (removedTestCase) {
          setAvailableTestCases(prev => [...prev, removedTestCase.testCase]);
        }
        
        toast({
          title: 'Test Case Removed',
          description: 'Test case has been removed from the test plan.',
        });
      } else {
        throw new Error('Failed to remove test case');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove test case. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  useEffect(() => {
    if (dialogOpen) {
      fetchAvailableTestCases(searchTerm);
    }
  }, [dialogOpen, searchTerm]);

  return (
    <div className="space-y-4">
      {/* Linked Test Cases - Tag Cloud */}
      <div className="flex flex-wrap gap-2 min-h-[60px] p-3 border border-dashed border-gray-300 rounded-lg bg-gray-50/50">
        {linkedTestCases.length > 0 ? (
          linkedTestCases.map(({ testCase }) => (
            <Badge
              key={testCase.id}
              variant={getPriorityColor(testCase.priority)}
              className="px-3 py-1 text-sm flex items-center gap-2 hover:bg-opacity-80 transition-colors"
            >
              <span>{testCase.title}</span>
              <button
                onClick={() => handleRemoveTestCase(testCase.id)}
                disabled={loading}
                className="ml-1 hover:bg-black/20 rounded-full p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))
        ) : (
          <p className="text-muted-foreground text-sm flex items-center justify-center w-full">
            No test cases added yet. Click "Add Test Cases" to get started.
          </p>
        )}
      </div>

      {/* Add Test Cases Button */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Test Cases
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Test Cases</DialogTitle>
            <DialogDescription>
              Search and select test cases to add to this test plan.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search test cases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Available Test Cases */}
            <div className="max-h-96 overflow-y-auto space-y-2">
              {availableTestCases.length > 0 ? (
                availableTestCases.map((testCase) => (
                  <div
                    key={testCase.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{testCase.title}</span>
                        <Badge variant={getPriorityColor(testCase.priority)} className="text-xs">
                          {testCase.priority}
                        </Badge>
                        {testCase.module && (
                          <Badge variant="outline" className="text-xs">
                            {testCase.module}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {testCase.description}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddTestCase(testCase)}
                      disabled={loading}
                    >
                      Add
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  {searchTerm ? 'No test cases found matching your search.' : 'No available test cases.'}
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 