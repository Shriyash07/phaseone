import { notFound } from 'next/navigation';
import { vulnerabilities } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RemediationView } from '@/components/vulnerabilities/remediation-view';
import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function VulnerabilityDetailPage({ params }: { params: { id: string } }) {
  const vulnerability = vulnerabilities.find((v) => v.id === params.id);

  if (!vulnerability) {
    notFound();
  }
  
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
            <Button variant="ghost" asChild>
                <Link href="/dashboard/vulnerabilities">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Vulnerabilities
                </Link>
            </Button>
        </div>
      <div className="space-y-2">
        <Badge variant={getSeverityBadge(vulnerability.severity)} className={cn(vulnerability.severity === 'High' && "bg-orange-500 text-white")}>
          {vulnerability.severity}
        </Badge>
        <h1 className="text-3xl font-bold font-headline">{vulnerability.name}</h1>
        <p className="text-muted-foreground">{vulnerability.id}</p>
      </div>
      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
            <Card className="bg-card/30 backdrop-blur-xl border-white/5">
                <CardHeader>
                    <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{vulnerability.description}</p>
                </CardContent>
            </Card>

            <RemediationView vulnerability={vulnerability} />
        </div>

        <div className="space-y-6">
            <Card className="bg-card/30 backdrop-blur-xl border-white/5">
                <CardHeader>
                    <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">CVSS Score</span>
                        <span className="font-bold">{vulnerability.cvss.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Asset Type</span>
                        <span className="font-medium">{vulnerability.assetType}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <span className="font-medium">{vulnerability.status}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Patch Available</span>
                        <span className="font-medium">{vulnerability.patchAvailable ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Discovered</span>
                        <span className="font-medium">{new Date(vulnerability.timestamp).toLocaleDateString()}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-muted-foreground">Exploitability</span>
                        <span className="font-bold text-primary">{vulnerability.exploitabilityIndex}%</span>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
