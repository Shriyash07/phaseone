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
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { heatmapData } from '@/lib/data';
import type { ChartConfig } from '@/components/ui/chart';

const chartConfig = {
  risk: {
    label: 'Risk Score',
    color: 'hsl(var(--primary))',
  },
  vulnerabilities: {
    label: 'Vulnerabilities',
    color: 'hsl(var(--accent))',
  },
} satisfies ChartConfig;


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
          <ChartContainer config={chartConfig} className="w-full h-full">
            <BarChart data={heatmapData} accessibilityLayer>
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
              <Bar dataKey="risk" fill="hsl(var(--primary))" name="Risk Score" yAxisId="left" radius={[4, 4, 0, 0]} />
              <Bar dataKey="vulnerabilities" fill="hsl(var(--accent))" name="Vulnerabilities" yAxisId="right" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
