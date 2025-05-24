// This file is machine-generated - edit at your own risk.

'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting test cases based on functional requirements.
 *
 * - suggestTestCases - A function that generates test case ideas from a given text or URL.
 * - SuggestTestCasesInput - The input type for the suggestTestCases function.
 * - SuggestTestCasesOutput - The return type for the suggestTestCases function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTestCasesInputSchema = z.object({
  functionalRequirements: z
    .string()
    .describe('A text description of the functional requirements for the system under test.'),
});
export type SuggestTestCasesInput = z.infer<typeof SuggestTestCasesInputSchema>;

const SuggestTestCasesOutputSchema = z.object({
  testCases: z
    .array(z.string())
    .describe('An array of suggested test cases based on the functional requirements.'),
});
export type SuggestTestCasesOutput = z.infer<typeof SuggestTestCasesOutputSchema>;

export async function suggestTestCases(input: SuggestTestCasesInput): Promise<SuggestTestCasesOutput> {
  return suggestTestCasesFlow(input);
}

const suggestTestCasesPrompt = ai.definePrompt({
  name: 'suggestTestCasesPrompt',
  input: {schema: SuggestTestCasesInputSchema},
  output: {schema: SuggestTestCasesOutputSchema},
  prompt: `You are an expert test case generator. Given the following functional requirements, generate a list of test cases that would adequately test the system.

Functional Requirements:
{{{functionalRequirements}}}

Consider edge cases, boundary conditions, and potential failure points.
Output the test cases as a numbered list.

Test Cases:
`,
});

const suggestTestCasesFlow = ai.defineFlow(
  {
    name: 'suggestTestCasesFlow',
    inputSchema: SuggestTestCasesInputSchema,
    outputSchema: SuggestTestCasesOutputSchema,
  },
  async input => {
    const {output} = await suggestTestCasesPrompt(input);
    return output!;
  }
);
