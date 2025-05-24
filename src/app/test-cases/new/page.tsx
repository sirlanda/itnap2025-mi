import TestCaseForm from '@/components/test-cases/test-case-form';
import { saveTestCaseAction } from '@/server/actions/test-case-actions';
import type { TestCaseFormData } from '@/lib/types';

export default function NewTestCasePage() {
  
  const handleSubmit = async (data: TestCaseFormData) => {
    'use server';
    try {
      await saveTestCaseAction(data);
      // Optionally: revalidatePath('/test-cases') if not relying on router.push redirect toast
    } catch (error) {
      console.error("Failed to save test case:", error);
      throw error; // Re-throw to be caught by form's error handler
    }
  };

  return (
    <div className="container mx-auto py-8">
      <TestCaseForm onSubmit={handleSubmit} />
    </div>
  );
}
