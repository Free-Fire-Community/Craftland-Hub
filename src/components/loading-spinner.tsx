'use client';

import { cn } from '@/lib/utils';
import { Gamepad2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  className?: string;
  variant?: 'default' | 'pulse' | 'dots' | 'gaming';
}

const sizeClasses = {
  sm: { container: 'h-8 w-8', ring: 'h-8 w-8', icon: 'h-3 w-3' },
  md: { container: 'h-12 w-12', ring: 'h-12 w-12', icon: 'h-5 w-5' },
  lg: { container: 'h-16 w-16', ring: 'h-16 w-16', icon: 'h-7 w-7' },
  xl: { container: 'h-24 w-24', ring: 'h-24 w-24', icon: 'h-10 w-10' },
};

export function LoadingSpinner({ 
  size = 'md', 
  text, 
  className,
  variant = 'gaming'
}: LoadingSpinnerProps) {
  const sizes = sizeClasses[size];

  if (variant === 'dots') {
    return (
      <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                'rounded-full bg-primary',
                size === 'sm' ? 'h-2 w-2' : size === 'md' ? 'h-3 w-3' : 'h-4 w-4'
              )}
              style={{
                animation: 'bounce 1.4s infinite ease-in-out both',
                animationDelay: `${i * 0.16}s`,
              }}
            />
          ))}
        </div>
        {text && (
          <p className="text-sm text-muted-foreground font-medium">{text}</p>
        )}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
        <div className={cn('relative', sizes.container)}>
          <div className={cn(
            'absolute inset-0 rounded-full bg-primary/30 animate-ping',
            sizes.ring
          )} />
          <div className={cn(
            'absolute inset-0 rounded-full bg-primary/50 animate-pulse',
            sizes.ring
          )} />
          <div className={cn(
            'relative rounded-full bg-primary flex items-center justify-center',
            sizes.ring
          )}>
            <Gamepad2 className={cn('text-primary-foreground', sizes.icon)} />
          </div>
        </div>
        {text && (
          <p className="text-sm text-muted-foreground font-medium animate-pulse">{text}</p>
        )}
      </div>
    );
  }

  // Gaming variant (default) - Modern spinning loader with gaming aesthetic
  return (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      <div className={cn('relative', sizes.container)}>
        {/* Outer rotating ring */}
        <div 
          className={cn(
            'absolute inset-0 rounded-full border-4 border-transparent',
            'border-t-primary border-r-primary/50',
            'animate-spin'
          )}
          style={{ animationDuration: '1s' }}
        />
        
        {/* Middle pulsing ring */}
        <div 
          className={cn(
            'absolute inset-1 rounded-full border-2 border-transparent',
            'border-b-accent border-l-accent/50',
            'animate-spin'
          )}
          style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}
        />
        
        {/* Inner glow effect */}
        <div className={cn(
          'absolute inset-2 rounded-full',
          'bg-gradient-to-br from-primary/20 via-transparent to-accent/20',
          'animate-pulse'
        )} />
        
        {/* Center icon */}
        <div className={cn(
          'absolute inset-0 flex items-center justify-center'
        )}>
          <div className="relative">
            <Gamepad2 
              className={cn(
                'text-primary drop-shadow-lg',
                sizes.icon
              )} 
            />
            <div className="absolute inset-0 blur-sm">
              <Gamepad2 
                className={cn(
                  'text-primary/50',
                  sizes.icon
                )} 
              />
            </div>
          </div>
        </div>
        
        {/* Orbiting dots */}
        <div 
          className="absolute inset-0 animate-spin"
          style={{ animationDuration: '2s' }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="h-2 w-2 rounded-full bg-primary shadow-lg shadow-primary/50" />
          </div>
        </div>
        <div 
          className="absolute inset-0 animate-spin"
          style={{ animationDuration: '2s', animationDelay: '0.5s' }}
        >
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
            <div className="h-1.5 w-1.5 rounded-full bg-accent shadow-lg shadow-accent/50" />
          </div>
        </div>
      </div>
      
      {text && (
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">{text}</p>
          <div className="flex justify-center gap-1 mt-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="inline-block h-1 w-1 rounded-full bg-primary"
                style={{
                  animation: 'bounce 1.4s infinite ease-in-out',
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function PageLoader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <LoadingSpinner size="xl" variant="gaming" />
      <div className="text-center space-y-2">
        <p className="text-lg font-semibold text-foreground">{text}</p>
        <p className="text-sm text-muted-foreground">Please wait a moment</p>
      </div>
    </div>
  );
}

export function InlineLoader({ text }: { text?: string }) {
  return (
    <div className="flex items-center justify-center py-12">
      <LoadingSpinner size="lg" text={text} variant="gaming" />
    </div>
  );
}

export function ButtonLoader() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-4 w-4">
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-current animate-spin" />
      </div>
    </div>
  );
}

export function CardLoader() {
  return (
    <div className="rounded-lg border bg-card p-4 space-y-4 animate-pulse">
      <div className="aspect-video bg-muted rounded-md" />
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
      </div>
      <div className="flex gap-2">
        <div className="h-6 w-16 bg-muted rounded-full" />
        <div className="h-6 w-16 bg-muted rounded-full" />
      </div>
    </div>
  );
}

export function GridLoader({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardLoader key={i} />
      ))}
    </div>
  );
}

export function FullPageLoader({ text = 'Loading Craftland...' }: { text?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-8">
        {/* Logo animation */}
        <div className="relative">
          <div className="absolute -inset-8 rounded-full bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-2xl animate-pulse" />
          <LoadingSpinner size="xl" variant="gaming" />
        </div>
        
        {/* Text */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold font-headline bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            {text}
          </h2>
          <p className="text-muted-foreground">Preparing your experience</p>
        </div>
        
        {/* Progress bar */}
        <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
            style={{
              animation: 'loading-progress 2s ease-in-out infinite',
            }}
          />
        </div>
      </div>
    </div>
  );
}
