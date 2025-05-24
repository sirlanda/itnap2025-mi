'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Save, Ban } from 'lucide-react';
import type { TestPlan } from '@/lib/types';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Mock data fetching function for a single test plan (replace with actual API call)
async function getTestPlanAction(id: string): Promise<TestPlan | null> {
  const mockTestPlans: TestPlan[] = [
    { id: 'TP001', name: 'Sprint 2 Regression Suite', description: 'Regression tests for Sprint 2 features.', testCaseIds: ['TC001', 'TC002'], plannedStartDate: '2024-08-01', plannedEndDate: '2024-08-05', executionStatus: 'Not Started', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'TP002', name: 'User Authentication Tests', description: 'Comprehensive testing of user auth flows.', testCaseIds: ['TC001', 'TC002', 'TC005'], plannedStartDate: '2024-08-10', plannedEndDate: '2024-08-12', executionStatus: 'In Progress', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ];
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
  return mockTestPlans.find(tp => tp.id === id) || null;
}


const testPlanSchema = z.object({
  name: z.string().min(1, 'Test plan name is required.'),
  description: z.string().optional(),
  plannedStartDate: z.date().optional(),
  plannedEndDate: z.date().optional(),
  testCaseIds: z.string().optional().describe("Comma-separated test case IDs, e.g., TC001,TC002"),
});

type TestPlanFormValues = z.infer<typeof testPlanSchema>;

interface EditTestPlanPageProps {
  params: { id: string };
}

export default function EditTestPlanPage({ params }: EditTestPlanPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { id } = params;
  
  const form = useForm<TestPlanFormValues>({
    resolver: zodResolver(testPlanSchema),
    defaultValues: { // Default values will be overridden by useEffect
      name: '',
      description: '',
      testCaseIds: '',
    },
  });

  useEffect(() => {
    const fetchTestPlan = async () => {
      const planData = await getTestPlanAction(id);
      if (planData) {
        form.reset({
          name: planData.name,
          description: planData.description,
          plannedStartDate: planData.plannedStartDate ? new Date(planData.plannedStartDate) : undefined,
          plannedEndDate: planData.plannedEndDate ? new Date(planData.plannedEndDate) : undefined,
          testCaseIds: planData.testCaseIds?.join(', ') || '',
        });
      } else {
        // Handle not found, e.g., redirect or show error
        toast({ title: "Error", description: "Test Plan not found.", variant: "destructive" });
        router.push('/test-plans');
      }
    };
    fetchTestPlan();
  }, [id, form, router, toast]);


  const onSubmit = async (data: TestPlanFormValues) => {
    console.log('Updated Test Plan Data:', { id, ...data });
    // Mock submission
    await new Promise(resolve => setTimeout(resolve, 500));
    toast({
      title: 'Test Plan Updated',
      description: `Test plan "${data.name}" has been successfully updated.`,
    });
    router.push('/test-plans');
  };

  if (!form.formState.isDirty && form.getValues().name === '') { // Basic loading state check
      return <div className="container mx-auto py-8 text-center">Loading test plan data...</div>
  }

  return (
    <div className="container mx-auto py-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="shadow-lg max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Edit Test Plan: {form.getValues().name || id}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Test Plan Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter test plan name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe the test plan" {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="plannedStartDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Planned Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value), "PPP") // Ensure field.value is Date
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1)) }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="plannedEndDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Planned End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value), "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={field.onChange}
                            disabled={(date) => date < (form.getValues("plannedStartDate") || new Date(new Date().setDate(new Date().getDate() -1)))}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
               <FormField
                control={form.control}
                name="testCaseIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Test Case IDs (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., TC001, TC002, TC003" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter comma-separated IDs of test cases to include in this plan.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                 <Ban className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
