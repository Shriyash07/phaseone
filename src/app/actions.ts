"use server";
import {
  generateRemediationSuggestion,
  type GenerateRemediationSuggestionInput,
} from '@/ai/flows/generate-remediation-suggestion';
import {
  scanUrl,
  type ScanUrlInput,
} from '@/ai/flows/scan-url-flow';

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

export async function getScanResult(
  input: ScanUrlInput
) {
  try {
    const result = await scanUrl(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('AI scan failed:', error);
    return { success: false, error: 'Failed to generate AI scan result.' };
  }
}
