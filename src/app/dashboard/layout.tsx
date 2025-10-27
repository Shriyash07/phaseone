'use client';

import { useState, createContext, useContext, ReactNode } from 'react';
import { DashboardLayout as InnerDashboardLayout } from '@/components/dashboard-layout';
import type { ScanUrlOutput } from '@/ai/flows/scan-url-flow';
import { getScanResult } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

type ScanContextType = {
  scanResult: ScanUrlOutput | null;
  isLoading: boolean;
  error: string | null;
  startScan: (url: string) => Promise<void>;
};

const ScanContext = createContext<ScanContextType | null>(null);

export const useScan = () => {
  const context = useContext(ScanContext);
  if (!context) {
    throw new Error('useScan must be used within a ScanProvider');
  }
  return context;
};

function ScanProvider({ children }: { children: React.ReactNode }) {
  const [scanResult, setScanResult] = useState<ScanUrlOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const startScan = async (url: string) => {
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
    setError(null);
    const result = await getScanResult({ url });

    if (result.success && result.data) {
      setScanResult(result.data);
    } else {
      setError(result.error ?? 'An unknown error occurred.');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
    setIsLoading(false);
  };
  
  const contextValue = {
    scanResult,
    isLoading,
    error,
    startScan,
  };

  return (
    <ScanContext.Provider value={contextValue}>
      {children}
    </ScanContext.Provider>
  );
}


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ScanProvider>
        <DashboardContent>
            {children}
        </DashboardContent>
    </ScanProvider>
  );
}

function DashboardContent({ children }: { children: ReactNode }) {
    const { error } = useScan();

    let content = children;
    if (error) {
        content = (
            <div className="flex items-center justify-center h-full">
                <Alert variant="destructive" className="max-w-lg">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Scan Failed</AlertTitle>
                    <AlertDescription>
                        The vulnerability scan could not be completed. Please try again.
                        <p className="mt-2 text-xs font-mono bg-destructive-foreground/10 p-2 rounded-md">{error}</p>
                    </AlertDescription>
                </Alert>
            </div>
        )
    }

    return (
        <InnerDashboardLayout>
            {content}
        </InnerDashboardLayout>
    )
}