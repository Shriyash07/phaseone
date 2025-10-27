'use server';
/**
 * @fileOverview This file defines the AI flow for generating remediation suggestions for critical vulnerabilities.
 *
 * - generateRemediationSuggestion - An async function that takes vulnerability details as input and returns both a plain language summary and a code snippet for remediation.
 * - GenerateRemediationSuggestionInput - The input type for the generateRemediationSuggestion function.
 * - GenerateRemediationSuggestionOutput - The return type for the generateRemediationSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRemediationSuggestionInputSchema = z.object({
  vulnerabilityDescription: z.string().describe('Detailed description of the vulnerability.'),
  cvssScore: z.number().describe('CVSS score of the vulnerability.'),
  assetType: z.string().describe('Type of asset affected by the vulnerability (e.g., Database, API, Frontend).'),
  patchAvailability: z.boolean().describe('Whether a patch is currently available for this vulnerability.'),
  targetLanguage: z.string().optional().describe('The target coding language of the code snippet, like javascript, python, etc.'),
});
export type GenerateRemediationSuggestionInput = z.infer<typeof GenerateRemediationSuggestionInputSchema>;

const GenerateRemediationSuggestionOutputSchema = z.object({
  plainLanguageSummary: z.string().describe('A non-technical explanation of the vulnerability risk.'),
  developerCodeSnippet: z.string().describe('A highly specific, best-practice code fix suggestion.'),
});
export type GenerateRemediationSuggestionOutput = z.infer<typeof GenerateRemediationSuggestionOutputSchema>;

export async function generateRemediationSuggestion(input: GenerateRemediationSuggestionInput): Promise<GenerateRemediationSuggestionOutput> {
  return generateRemediationSuggestionFlow(input);
}

const generateRemediationSuggestionPrompt = ai.definePrompt({
  name: 'generateRemediationSuggestionPrompt',
  input: {schema: GenerateRemediationSuggestionInputSchema},
  output: {schema: GenerateRemediationSuggestionOutputSchema},
  prompt: `You are an AI-powered security expert specializing in web application vulnerabilities.
  Given the details of a critical vulnerability, your task is to generate two essential outputs:

  1.  Plain Language Summary: Provide a concise, non-technical explanation of the risk the vulnerability poses. This summary should be easily understandable by a non-technical audience (e.g., project managers, stakeholders).
  2.  Developer Code Snippet: Generate a highly specific, best-practice code fix suggestion to address the vulnerability. Consider the asset type when providing code suggestions. The target language is {{{targetLanguage}}}.

  Here are the vulnerability details:
  Vulnerability Description: {{{vulnerabilityDescription}}}
  CVSS Score: {{{cvssScore}}}
  Asset Type: {{{assetType}}}
  Patch Availability: {{#if patchAvailability}}Yes{{else}}No{{/if}}

  Respond with both the Plain Language Summary and the Developer Code Snippet.
  `,
});

const generateRemediationSuggestionFlow = ai.defineFlow(
  {
    name: 'generateRemediationSuggestionFlow',
    inputSchema: GenerateRemediationSuggestionInputSchema,
    outputSchema: GenerateRemediationSuggestionOutputSchema,
  },
  async input => {
    const {output} = await generateRemediationSuggestionPrompt(input);
    return output!;
  }
);
