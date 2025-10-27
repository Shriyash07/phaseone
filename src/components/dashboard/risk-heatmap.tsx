'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartTooltipContent } from '@/components/ui/chart';
import { heatmapData } from '@/lib/data';

export function RiskHeatmap() {
  return (
    <Card className="bg-card/30 backdrop-blur-xl border-white/5">
      <CardHeader>
        <CardTitle>Risk by Component</CardTitle>
        <CardDescription>
          Concentration of risk across application components.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={heatmapData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
              <XAxis
                dataKey="component"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                yAxisId="left"
                orientation="left"
                label={{ value: 'Risk Score', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
               <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                yAxisId="right"
                orientation="right"
                label={{ value: 'Vulnerabilities', angle: 90, position: 'insideRight', fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <Tooltip
                content={<ChartTooltipContent />}
                cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
              />
              <Bar dataKey="risk" fill="hsl(var(--primary))" name="Risk Score" yAxisId="left" />
              <Bar dataKey="vulnerabilities" fill="hsl(var(--accent))" name="Vulnerabilities" yAxisId="right" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
