import { LogoIcon } from './icons';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <LogoIcon className="h-6 w-6 text-primary" />
      <h1 className="text-lg font-bold tracking-tight font-headline">
        Craftland Central
      </h1>
    </div>
  );
}
