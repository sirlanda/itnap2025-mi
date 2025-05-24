'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Wand2, AlertTriangle } from 'lucide-react';
import { suggestTestCases, type SuggestTestCasesInput, type SuggestTestCasesOutput } from '@/ai/flows/ai-test-case-suggestion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const suggestionSchema = z.object({
  functionalRequirements: z.string().min(50, 'Please provide detailed functional requirements (at least 50 characters).').or(z.string().url("If not providing text, please enter a valid URL.")),
  //inputType: z.enum(['text', 'url']).default('text'),
});

type SuggestionFormValues = z.infer<typeof suggestionSchema>;

export default function AiSuggestionForm() {
  const [suggestions, setSuggestions] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SuggestionFormValues>({
    resolver: zodResolver(suggestionSchema),
    defaultValues: {
      functionalRequirements: '',
      //inputType: 'text',
    },
  });

  const onSubmit = async (data: SuggestionFormValues) => {
    setIsLoading(true);
    setError(null);
    setSuggestions(null);

    try {
      let requirementsText = data.functionalRequirements;
      // Basic check if it's a URL, a more robust check might be needed
      if (data.functionalRequirements.startsWith('http://') || data.functionalRequirements.startsWith('https://')) {
        // In a real app, you'd fetch content from the URL here.
        // For this mock, we'll just pass the URL itself or a placeholder.
        // This functionality (fetching URL content) would typically be part of the Genkit flow or a pre-processing step.
        // Since the current Genkit flow `suggestTestCases` expects `functionalRequirements` as a string,
        // we'll simulate that the user might paste content or a URL here.
        // The flow itself doesn't handle URL fetching.
        // For now, if it's a URL, we'll just indicate it. True URL processing is out of scope for this frontend mock.
        requirementsText = `Content from URL: ${data.functionalRequirements} (Note: URL content fetching is not implemented in this demo. The AI will treat this URL string as the requirement.)`;
      }


      const input: SuggestTestCasesInput = { functionalRequirements: requirementsText };
      const result: SuggestTestCasesOutput = await suggestTestCases(input);
      
      if (result && result.testCases) {
        setSuggestions(result.testCases);
      } else {
        setError('No suggestions received from AI.');
      }
    } catch (e: any) {
      console.error('AI suggestion error:', e);
      setError(e.message || 'Failed to get suggestions from AI. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center">
          <Wand2 className="mr-2 h-6 w-6 text-primary" />
          AI Test Case Suggestions
        </CardTitle>
        <CardDescription>
          Provide functional requirements (text or a URL to public content) to get AI-powered test case ideas. The AI will analyze the input and suggest critical test scenarios.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="functionalRequirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Functional Requirements or URL</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste your functional requirements here, or provide a URL to the requirements document..."
                      {...field}
                      rows={8}
                      className="text-sm"
                    />
                  </FormControl>
                  <FormDescription>
                    Be as detailed as possible for better suggestions. If providing a URL, ensure it's publicly accessible.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Suggestions...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Get Suggestions
                </>
              )}
            </Button>
          </form>
        </Form>

        {error && (
          <Alert variant="destructive" className="mt-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {suggestions && suggestions.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-3 text-foreground">Suggested Test Cases:</h3>
            <ul className="space-y-2 list-disc list-inside bg-muted/30 p-4 rounded-md">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="text-sm text-foreground/90">
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
        {suggestions && suggestions.length === 0 && !error && (
           <Alert className="mt-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>No Suggestions</AlertTitle>
            <AlertDescription>The AI could not generate any specific test cases based on the provided input. Try refining your requirements.</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
