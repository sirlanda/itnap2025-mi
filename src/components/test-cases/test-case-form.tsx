'use client';

import React, { useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { PlusCircle, Trash2, ArrowUp, ArrowDown, Save } from 'lucide-react';
import type { TestCaseFormData, Priority, TestCaseStatus, TestStep as TestStepType } from '@/lib/types'; // Use TestStepType to avoid conflict
import { useRouter } from 'next/navigation'; // Corrected import for App Router
import { useToast } from '@/hooks/use-toast';


const testStepSchema = z.object({
  instruction: z.string().min(1, 'Instruction is required.'),
  expectedResult: z.string().min(1, 'Expected result is required.'),
});

const testCaseFormSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z.string().min(1, 'Description is required.'),
  prerequisites: z.string().optional(),
  priority: z.enum(['Low', 'Medium', 'High']),
  status: z.enum(['Draft', 'Ready', 'Obsolete']),
  module: z.string().optional(),
  steps: z.array(testStepSchema).min(1, 'At least one step is required.'),
});

interface TestCaseFormProps {
  initialData?: TestCaseFormData & { id?: string }; // For editing
  onSubmit: (data: TestCaseFormData) => Promise<void>; // Server action
}

export default function TestCaseForm({ initialData, onSubmit }: TestCaseFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  
  const form = useForm<TestCaseFormData>({
    resolver: zodResolver(testCaseFormSchema),
    defaultValues: initialData || {
      title: '',
      description: '',
      prerequisites: '',
      priority: 'Medium',
      status: 'Draft',
      module: '',
      steps: [{ instruction: '', expectedResult: '' }],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: 'steps',
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const handleFormSubmit = async (data: TestCaseFormData) => {
    try {
      await onSubmit(data);
      toast({
        title: `Test Case ${initialData?.id ? 'Updated' : 'Created'}`,
        description: `Test case "${data.title}" has been successfully ${initialData?.id ? 'updated' : 'saved'}.`,
      });
      router.push('/test-cases'); // Navigate back to the list after successful submission
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${initialData?.id ? 'update' : 'create'} test case. Please try again.`,
        variant: 'destructive',
      });
      console.error('Form submission error:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">{initialData?.id ? 'Edit Test Case' : 'Create New Test Case'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter test case title" {...field} />
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
                    <Textarea placeholder="Describe the test case" {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="prerequisites"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prerequisites (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="List any prerequisites" {...field} rows={2} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(['High', 'Medium', 'Low'] as Priority[]).map(p => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(['Draft', 'Ready', 'Obsolete'] as TestCaseStatus[]).map(s => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="module"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Module (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter module/feature" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormLabel className="text-lg font-semibold">Test Steps</FormLabel>
              <FormDescription>Define the steps to execute this test case.</FormDescription>
              {fields.map((item, index) => (
                <Card key={item.id} className="mt-4 p-4 space-y-3 bg-muted/30">
                  <div className="flex justify-between items-center">
                    <FormLabel className="font-medium">Step {index + 1}</FormLabel>
                    <div className="space-x-2">
                       <Button type="button" variant="outline" size="icon" onClick={() => move(index, index - 1)} disabled={index === 0} aria-label="Move step up">
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button type="button" variant="outline" size="icon" onClick={() => move(index, index + 1)} disabled={index === fields.length - 1} aria-label="Move step down">
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} disabled={fields.length <= 1} aria-label="Remove step">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name={`steps.${index}.instruction`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instruction</FormLabel>
                        <FormControl>
                          <Textarea placeholder={`Instruction for step ${index + 1}`} {...field} rows={2} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`steps.${index}.expectedResult`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expected Result</FormLabel>
                        <FormControl>
                          <Textarea placeholder={`Expected result for step ${index + 1}`} {...field} rows={2} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Card>
              ))}
              <Button
                type="button"
                variant="outline"
                className="mt-4"
                onClick={() => append({ instruction: '', expectedResult: '' })}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Step
              </Button>
               <Controller
                name="steps"
                control={form.control}
                render={({ fieldState }) => fieldState.error ? <p className="text-sm font-medium text-destructive mt-1">{fieldState.error.message || fieldState.error.root?.message}</p> : null}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {form.formState.isSubmitting ? 'Saving...' : (initialData?.id ? 'Save Changes' : 'Create Test Case')}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
