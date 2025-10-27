'use client';

import { useState } from 'react';
import { Search, Shield, AlertTriangle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { getScanResult } from '@/app/actions';
import type { ScanUrlOutput } from '@/ai/flows/scan-url-flow';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function ScannerPage() {
  const [url, setUrl] = useState('');
  const [scanResult, setScanResult] = useState<ScanUrlOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleScan = async () => {
    if (!url) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter a URL to scan.',
      });
      return;
    }
    setIsLoading(true);
    setScanResult(null);
    const result = await getScanResult({ url });

    if (result.success && result.data) {
      setScanResult(result.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
    setIsLoading(false);
  };
  
    const getSeverityBadge = (severity: string) => {
        switch (severity) {
        case 'Critical': return 'destructive';
        case 'High': return 'secondary';
        case 'Medium': return 'default';
        default: return 'outline';
        }
    };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-headline">Vulnerability Scanner</h1>
        <p className="text-muted-foreground">
          Enter a URL to scan for potential SQL Injection and XSS vulnerabilities.
        </p>
      </div>

      <Card className="bg-card/30 backdrop-blur-xl border-white/5">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
              disabled={isLoading}
            />
            <Button onClick={handleScan} disabled={isLoading}>
              <Search className="mr-2 h-4 w-4" />
              {isLoading ? 'Scanning...' : 'Scan URL'}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {isLoading && (
        <Card className="bg-card/30 backdrop-blur-xl border-white/5">
            <CardHeader>
                <CardTitle>Scan Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </CardContent>
        </Card>
      )}
      
      {scanResult && (
        <Card className="bg-card/30 backdrop-blur-xl border-white/5">
            <CardHeader>
                <CardTitle>Scan Results for {url}</CardTitle>
                <CardDescription>
                    <p className="text-muted-foreground mt-2 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <strong>Summary:</strong> {scanResult.summary}
                    </p>
                </CardDescription>
            </CardHeader>
            <CardContent>
                {scanResult.vulnerabilities.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                    {scanResult.vulnerabilities.map((vuln, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger>
                                <div className="flex items-center gap-4">
                                     <Badge variant={getSeverityBadge(vuln.riskLevel)} className={cn(vuln.riskLevel === "High" && "bg-orange-500 text-white")}>
                                        {vuln.riskLevel}
                                    </Badge>
                                    <span className="font-semibold">{vuln.type}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <p className="text-muted-foreground p-4">{vuln.description}</p>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
                ) : (
                <div className="text-center py-8 text-muted-foreground flex flex-col items-center gap-4">
                    <Shield className="h-12 w-12 text-green-500" />
                    <p className="font-semibold">No potential vulnerabilities found.</p>
                    <p className="text-sm">The scan did not detect any obvious vectors for SQL Injection or XSS.</p>
                </div>
                )}
            </CardContent>
        </Card>
      )}
    </div>
  );
}
