'use client';

import { useState } from 'react';
import { Search, Shield, FileText, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useScan } from '../layout';

export default function ScannerPage() {
  const [url, setUrl] = useState('');
  const { scanResult, isLoading, startScan } = useScan();

  const handleScan = () => {
    startScan(url);
  };
  
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'destructive';
      case 'High': return 'secondary';
      case 'Medium': return 'default';
      case 'Low': return 'outline';
      default: return 'outline';
    }
  };
  
  const hasVulnerabilities = scanResult && scanResult.vulnerabilityChecks.some(vc => vc.checks.some(c => !c.passed));

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
              onKeyDown={(e) => e.key === 'Enter' && handleScan()}
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
                <CardTitle>Scanning...</CardTitle>
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
                {hasVulnerabilities ? (
                <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                    {scanResult.vulnerabilityChecks.map((vulnCheck, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger>
                                <div className="flex items-center gap-4">
                                    <span className="font-semibold text-lg">{vulnCheck.type}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-3 pl-4">
                                {vulnCheck.checks.map((check, checkIndex) => (
                                    <div key={checkIndex} className="flex flex-col gap-2 p-3 rounded-md bg-muted/50">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                {check.passed ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-destructive" />}
                                                <span className="font-semibold">{check.name}</span>
                                            </div>
                                            <Badge variant={check.passed ? "outline" : getSeverityBadge(check.riskLevel)} className={cn(!check.passed && check.riskLevel === "High" && "bg-orange-500 text-white")}>
                                                {check.passed ? "Passed" : check.riskLevel}
                                            </Badge>
                                        </div>
                                        <p className="text-muted-foreground text-sm ml-7">{check.details}</p>
                                    </div>
                                ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
                ) : (
                <div className="text-center py-8 text-muted-foreground flex flex-col items-center gap-4">
                    <Shield className="h-12 w-12 text-green-500" />
                    <p className="font-semibold">No potential vulnerabilities found.</p>
                    <p className="text-sm">{scanResult.summary}</p>
                </div>
                )}
            </CardContent>
        </Card>
      )}
    </div>
  );
}
