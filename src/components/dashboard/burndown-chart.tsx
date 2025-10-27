'use client';

import {
  Area,
  AreaChart,
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
import { burndownData } from '@/lib/data';
import type { ChartConfig } from '@/components/ui/chart';

const chartConfig = {
  open: {
    label: 'Open',
    color: 'hsl(var(--primary))',
  },
  closed: {
    label: 'Closed',
    color: 'hsl(var(--accent))',
  },
} satisfies ChartConfig;


export function BurndownChart() {
  return (
    <Card className="bg-card/30 backdrop-blur-xl border-white/5">
      <CardHeader>
        <CardTitle>Vulnerability Burndown</CardTitle>
        <CardDescription>
          Trend of open vs. resolved vulnerabilities over the last 7 days.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <AreaChart data={burndownData} accessibilityLayer>
              <defs>
                <linearGradient id="colorOpen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorClosed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
              <XAxis
                dataKey="date"
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
              />
              <Tooltip
                content={<ChartTooltipContent />}
                cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
              />
              <Area
                type="monotone"
                dataKey="open"
                stroke="hsl(var(--primary))"
                fill="url(#colorOpen)"
                name="Open"
              />
              <Area
                type="monotone"
                dataKey="closed"
                stroke="hsl(var(--accent))"
                fill="url(#colorClosed)"
                name="Closed"
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
