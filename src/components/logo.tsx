import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Shield className="h-7 w-7 text-primary" />
      <h1 className="text-xl font-bold text-foreground font-headline tracking-tighter">
        Quantum Vault
      </h1>
    </div>
  );
}
