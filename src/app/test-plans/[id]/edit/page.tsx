'use client';

import React, { useEffect, use } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Save, Ban } from 'lucide-react';
import type { TestPlan } from '@/lib/types';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const testPlanSchema = z.object({
  name: z.string().min(1, 'Test plan name is required.'),
  description: z.string().min(1, 'Description is required.'),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  status: z.enum(['Active', 'Completed', 'Cancelled', 'Draft']),
  createdBy: z.string().optional(),
});

type TestPlanFormValues = z.infer<typeof testPlanSchema>;

interface EditTestPlanPageProps {
  params: Promise<{ id: string }>;
}

export default function EditTestPlanPage({ params }: EditTestPlanPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { id } = use(params);
  
  const form = useForm<TestPlanFormValues>({
    resolver: zodResolver(testPlanSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'Draft',
      createdBy: '',
    },
  });

  useEffect(() => {
    const fetchTestPlan = async () => {
      try {
        const response = await fetch(`/api/test-plans/${id}`);
        if (response.ok) {
          const planData: TestPlan = await response.json();
          form.reset({
            name: planData.name,
            description: planData.description,
            startDate: planData.startDate ? new Date(planData.startDate) : undefined,
            endDate: planData.endDate ? new Date(planData.endDate) : undefined,
            status: planData.status,
            createdBy: planData.createdBy,
          });
        } else {
          toast({ 
            title: "Error", 
            description: "Test Plan not found.", 
            variant: "destructive" 
          });
          router.push('/test-plans');
        }
      } catch (error) {
        toast({ 
          title: "Error", 
          description: "Failed to load test plan.", 
          variant: "destructive" 
        });
        router.push('/test-plans');
      }
    };
    
    fetchTestPlan();
  }, [id, form, router, toast]);

  const onSubmit = async (data: TestPlanFormValues) => {
    try {
      const response = await fetch(`/api/test-plans/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          startDate: data.startDate?.toISOString(),
          endDate: data.endDate?.toISOString(),
          status: data.status,
          createdBy: data.createdBy,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Test Plan Updated',
          description: `Test plan "${data.name}" has been successfully updated.`,
        });
        router.push('/test-plans');
      } else {
        throw new Error('Failed to update test plan');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update test plan. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (!form.formState.isDirty && form.getValues().name === '') {
    return (
      <div className="container mx-auto py-8">
        <Card className="shadow-lg max-w-2xl mx-auto">
          <CardContent className="p-6 text-center">
            Loading test plan data...
          </CardContent>
        </Card>
      </div>
    );
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe the test plan" {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="createdBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Created By</FormLabel>
                    <FormControl>
                      <Input placeholder="Creator name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date (Optional)</FormLabel>
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
                                format(field.value, "PPP")
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
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1))}
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
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date (Optional)</FormLabel>
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
                                format(field.value, "PPP")
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
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < (form.getValues("startDate") || new Date(new Date().setDate(new Date().getDate() -1)))}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                <Ban className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {form.formState.isSubmitting ? 'Updating...' : 'Update Test Plan'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
