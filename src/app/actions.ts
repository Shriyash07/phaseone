"use server";
import {
  generateRemediationSuggestion,
  type GenerateRemediationSuggestionInput,
} from '@/ai/flows/generate-remediation-suggestion';

export async function getRemediationSuggestion(
  input: GenerateRemediationSuggestionInput
) {
  try {
    const result = await generateRemediationSuggestion(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('AI suggestion failed:', error);
    return { success: false, error: 'Failed to generate AI suggestion.' };
  }
}
