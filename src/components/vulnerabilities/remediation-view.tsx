"use client";

import { useState } from 'react';
import { WandSparkles, Lightbulb, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { getRemediationSuggestion } from '@/app/actions';
import type { GenerateRemediationSuggestionOutput } from '@/ai/flows/generate-remediation-suggestion';
import type { Vulnerability } from '@/lib/types';

export function RemediationView({ vulnerability }: { vulnerability: Vulnerability }) {
  const [suggestion, setSuggestion] = useState<GenerateRemediationSuggestionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateSuggestion = async () => {
    setIsLoading(true);
    setSuggestion(null);
    const result = await getRemediationSuggestion({
      vulnerabilityDescription: vulnerability.description,
      cvssScore: vulnerability.cvss,
      assetType: vulnerability.assetType,
      patchAvailability: vulnerability.patchAvailable,
      targetLanguage: "javascript", // Example language
    });

    if (result.success && result.data) {
      setSuggestion(result.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
    setIsLoading(false);
  };

  return (
    <Card className="bg-card/30 backdrop-blur-xl border-white/5">
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
                <WandSparkles className="text-primary" />
                AI Remediation Analyst
            </CardTitle>
            <Button onClick={handleGenerateSuggestion} disabled={isLoading} size="sm">
                <Lightbulb className="mr-2 h-4 w-4" />
                Generate Suggestion
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && (
            <div className="space-y-4">
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-32 w-full" />
            </div>
        )}
        {suggestion && (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                <Lightbulb className="h-5 w-5 text-accent" />
                Plain Language Summary
              </h3>
              <p className="text-muted-foreground">{suggestion.plainLanguageSummary}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                <Code2 className="h-5 w-5 text-accent" />
                Developer Code Snippet
              </h3>
              <pre className="bg-black/50 p-4 rounded-md overflow-x-auto">
                <code className="font-code text-sm text-primary">{suggestion.developerCodeSnippet}</code>
              </pre>
            </div>
          </div>
        )}
        {!isLoading && !suggestion && (
            <div className="text-center py-8 text-muted-foreground">
                <p>Click "Generate Suggestion" to get an AI-powered fix for this vulnerability.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
