'use client';

import { threats } from '@/lib/data';

export function LiveThreatFeed() {
  const duplicatedThreats = [...threats, ...threats];

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'High':
        return 'text-destructive';
      case 'Medium':
        return 'text-yellow-400';
      case 'Low':
        return 'text-blue-400';
      default:
        return 'text-green-400';
    }
  };

  return (
    <div className="bg-background/60 backdrop-blur-sm border-t border-border w-full h-10 overflow-hidden relative">
      <div className="animate-marquee whitespace-nowrap absolute top-1/2 -translate-y-1/2 flex">
        {duplicatedThreats.map((threat, index) => (
          <span key={index} className="text-sm text-muted-foreground mx-8">
            [<span className={getSeverityClass(threat.severity)}>{threat.severity}</span>] {threat.message}
          </span>
        ))}
      </div>
    </div>
  );
}
