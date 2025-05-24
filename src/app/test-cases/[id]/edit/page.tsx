import TestCaseForm from '@/components/test-cases/test-case-form';
import { getTestCaseAction, saveTestCaseAction } from '@/server/actions/test-case-actions';
import type { TestCaseFormData } from '@/lib/types';
import { notFound } from 'next/navigation';

interface EditTestCasePageProps {
  params: { id: string };
}

export default async function EditTestCasePage({ params }: EditTestCasePageProps) {
  const { id } = params;
  const testCase = await getTestCaseAction(id);

  if (!testCase) {
    notFound();
  }
  
  const handleSubmit = async (data: TestCaseFormData) => {
    'use server';
    try {
      await saveTestCaseAction(data, id);
      // Optionally: revalidatePath('/test-cases') revalidatePath(`/test-cases/${id}/edit`)
    } catch (error) {
      console.error("Failed to update test case:", error);
      throw error; // Re-throw to be caught by form's error handler
    }
  };
  
  // Ensure steps is an array, even if it's empty initially or from fetched data
  const initialDataWithSteps = {
    ...testCase,
    steps: testCase.steps && testCase.steps.length > 0 ? testCase.steps : [{ instruction: '', expectedResult: '' }],
  };


  return (
    <div className="container mx-auto py-8">
      <TestCaseForm initialData={initialDataWithSteps} onSubmit={handleSubmit} />
    </div>
  );
}
