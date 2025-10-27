import { ShieldAlert, ShieldCheck, Clock, AlertTriangle } from 'lucide-react';
import { targets, vulnerabilities } from '@/lib/data';
import { StatCard } from '@/components/dashboard/stat-card';
import RiskSphere from '@/components/dashboard/risk-sphere';
import { BurndownChart } from '@/components/dashboard/burndown-chart';
import { RiskHeatmap } from '@/components/dashboard/risk-heatmap';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function DashboardPage() {
  const totalVulns = vulnerabilities.length;
  const criticalVulns = vulnerabilities.filter(v => v.severity === 'Critical').length;
  const openVulns = vulnerabilities.filter(v => v.status === 'Open').length;
  const avgRiskScore = targets.reduce((acc, t) => acc + t.riskScore, 0) / targets.length;

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Overall Risk Score"
          value={avgRiskScore.toFixed(0)}
          icon={AlertTriangle}
          description="Average across all targets"
        />
        <StatCard
          title="Open Vulnerabilities"
          value={openVulns.toString()}
          icon={ShieldAlert}
          description={`${criticalVulns} critical`}
        />
        <StatCard
          title="Total Vulnerabilities"
          value={totalVulns.toString()}
          icon={ShieldCheck}
          description="All-time discovered"
        />
        <StatCard
          title="Avg. Time to Remediate"
          value="7.2 Days"
          icon={Clock}
          description="Based on last 30 days"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 bg-card/30 backdrop-blur-xl border-white/5">
          <CardHeader>
            <CardTitle>Live Risk-Sphere</CardTitle>
          </CardHeader>
          <CardContent>
            <RiskSphere riskScore={avgRiskScore} />
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
