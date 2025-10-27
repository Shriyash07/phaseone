'use client';

import { ShieldAlert, ShieldCheck, Clock, AlertTriangle, Info } from 'lucide-react';
import { StatCard } from '@/components/dashboard/stat-card';
import RiskSphere from '@/components/dashboard/risk-sphere';
import { BurndownChart } from '@/components/dashboard/burndown-chart';
import { RiskHeatmap } from '@/components/dashboard/risk-heatmap';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useScan } from './layout';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { scanResult, isLoading } = useScan();

  const getDashboardData = () => {
    if (!scanResult) {
      return {
        overallRiskScore: 0,
        openVulnerabilities: 0,
        criticalVulnerabilities: 0,
        totalVulnerabilities: 0,
        avgTimeToRemediate: 'N/A',
        isInitialState: true,
      };
    }

    const allChecks = scanResult.vulnerabilityChecks.flatMap(vc => vc.checks);
    const failedChecks = allChecks.filter(c => !c.passed);
    const criticalVulnerabilities = failedChecks.filter(c => c.riskLevel === 'Critical').length;
    
    const riskScoreMap: { [key: string]: number } = {
        'Critical': 95,
        'High': 75,
        'Medium': 50,
        'Low': 20,
        'Informational': 5,
    };
    
    const totalRisk = failedChecks.reduce((acc, check) => acc + (riskScoreMap[check.riskLevel] || 0), 0);
    const overallRiskScore = failedChecks.length > 0 ? totalRisk / failedChecks.length : 0;

    return {
      overallRiskScore: Math.round(overallRiskScore),
      openVulnerabilities: failedChecks.length,
      criticalVulnerabilities,
      totalVulnerabilities: failedChecks.length,
      avgTimeToRemediate: 'N/A',
      isInitialState: false,
    };
  };

  const data = getDashboardData();
  
  if (isLoading) {
    return (
        <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-[118px]" />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Skeleton className="lg:col-span-1 h-[380px]" />
                <Skeleton className="lg:col-span-2 h-[380px]" />
            </div>
             <div className="grid grid-cols-1 gap-6">
                <Skeleton className="h-[380px]" />
            </div>
        </div>
    )
  }

  if (data.isInitialState) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground bg-card/30 backdrop-blur-xl border-white/5 p-8 rounded-lg">
            <Info className="h-16 w-16 mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-foreground">Welcome to Quantum Vault</h2>
            <p>To get started, please go to the 'Scanner' page and scan a URL.</p>
            <p>The dashboard will update with the results of your scan.</p>
        </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Overall Risk Score"
          value={data.overallRiskScore.toFixed(0)}
          icon={AlertTriangle}
          description="Average across all targets"
        />
        <StatCard
          title="Open Vulnerabilities"
          value={data.openVulnerabilities.toString()}
          icon={ShieldAlert}
          description={`${data.criticalVulnerabilities} critical`}
        />
        <StatCard
          title="Total Vulnerabilities"
          value={data.totalVulnerabilities.toString()}
          icon={ShieldCheck}
          description="From last scan"
        />
        <StatCard
          title="Avg. Time to Remediate"
          value={data.avgTimeToRemediate}
          icon={Clock}
          description="Not applicable for scans"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 bg-card/30 backdrop-blur-xl border-white/5">
          <CardHeader>
            <CardTitle>Live Risk-Sphere</CardTitle>
          </CardHeader>
          <CardContent>
            <RiskSphere riskScore={data.overallRiskScore} />
          </CardContent>
        </Card>
        <div className="lg:col-span-2">
            <BurndownChart />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6">
        <RiskHeatmap />
      </div>
    </div>
  );
}
