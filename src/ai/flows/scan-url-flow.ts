'use server';
/**
 * @fileOverview This file defines the AI flow for scanning a URL for security vulnerabilities.
 *
 * - scanUrl - An async function that takes a URL and returns a list of potential vulnerabilities.
 * - ScanUrlInput - The input type for the scanUrl function.
 * - ScanUrlOutput - The return type for the scanUrl function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CheckDetailSchema = z.object({
  name: z.string().describe('The name of the specific check performed (e.g., "Tautology-based injection", "Reflected XSS in URL parameters").'),
  passed: z.boolean().describe('Whether the check passed (no vulnerability found) or failed (potential vulnerability detected).'),
  details: z.string().describe('A brief explanation of the check and its result.'),
  riskLevel: z.enum(['Critical', 'High', 'Medium', 'Low', 'Informational']).describe('The estimated risk level if this check failed.'),
});

const VulnerabilityCheckSchema = z.object({
    type: z.enum(['SQL Injection', 'XSS', 'Other']).describe('The type of vulnerability.'),
    checks: z.array(CheckDetailSchema).describe('A list of specific checks performed for this vulnerability type.'),
});


const ScanUrlInputSchema = z.object({
  url: z.string().url().describe('The URL of the web application to scan.'),
});
export type ScanUrlInput = z.infer<typeof ScanUrlInputSchema>;

const ScanUrlOutputSchema = z.object({
  vulnerabilityChecks: z.array(VulnerabilityCheckSchema).describe('A list of vulnerability types and the checks performed for each.'),
  summary: z.string().describe('A high-level summary of the security posture of the scanned URL.'),
});
export type ScanUrlOutput = z.infer<typeof ScanUrlOutputSchema>;

export async function scanUrl(input: ScanUrlInput): Promise<ScanUrlOutput> {
  return scanUrlFlow(input);
}

const scanUrlFlow = ai.defineFlow(
    {
        name: 'scanUrlFlow',
        inputSchema: ScanUrlInputSchema,
        outputSchema: ScanUrlOutputSchema,
    },
    async (input) => {
        const { output } = await ai.generate({
            prompt: `
        You are a security expert. Analyze the provided web application URL for potential security vulnerabilities, specifically focusing on SQL Injection and Cross-Site Scripting (XSS).

        URL: ${input.url}

        Your task is to:
        1. Hypothesize how a user might interact with this page (e.g., forms, URL parameters).
        2. Based on the structure and potential inputs, identify possible vectors for SQL Injection and XSS attacks.
        3. For both SQL Injection and XSS, perform a series of specific checks. For each check, specify its name, whether it passed or failed (i.e., if a vulnerability was likely found), a risk level, and details about what was checked.
           - For SQL Injection, include checks like "Tautology-based", "Union-based", "Error-based", and "Blind SQL Injection".
           - For XSS, include checks for "Reflected XSS in URL parameters", "Stored XSS in forms", and "DOM-based XSS".
        4. Provide a high-level summary of the URL's security posture based on your analysis.

        Do not attempt to actually perform any attacks. This is a static analysis based on common vulnerability patterns.
        If the page has no obvious input vectors (e.g., a static "About Us" page), all checks should pass with an 'Informational' risk level.
      `,
      output: {
        schema: ScanUrlOutputSchema
      },
      model: 'googleai/gemini-2.5-flash',
    });

    return output!;
  }
);
