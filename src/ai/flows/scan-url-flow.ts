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

const VulnerabilitySchema = z.object({
  type: z.enum(['SQL Injection', 'XSS', 'Other']).describe('The type of vulnerability.'),
  description: z.string().describe('A detailed description of the potential vulnerability and why it is a risk.'),
  riskLevel: z.enum(['Critical', 'High', 'Medium', 'Low']).describe('The estimated risk level.'),
});

const ScanUrlInputSchema = z.object({
  url: z.string().url().describe('The URL of the web application to scan.'),
});
export type ScanUrlInput = z.infer<typeof ScanUrlInputSchema>;

const ScanUrlOutputSchema = z.object({
  vulnerabilities: z.array(VulnerabilitySchema).describe('A list of potential vulnerabilities found.'),
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
        1.  Hypothesize how a user might interact with this page (e.g., forms, URL parameters).
        2.  Based on the structure and potential inputs, identify possible vectors for SQL Injection and XSS attacks.
        3.  For each potential vulnerability, provide a description, estimate a risk level.
        4.  Provide a high-level summary of the URL's security posture based on your analysis.

        Do not attempt to actually perform any attacks. This is a static analysis based on common vulnerability patterns.
        If the page has no obvious input vectors (e.g., a static "About Us" page), state that the risk is low.
      `,
      output: {
        schema: ScanUrlOutputSchema
      },
      model: 'googleai/gemini-2.5-flash',
    });

    return output!;
  }
);
