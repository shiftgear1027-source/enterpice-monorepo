import { cn } from '../utils';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = { sm: 'size-4', md: 'size-6', lg: 'size-10' } as const;

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <svg
      className={cn('animate-spin', sizes[size], className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export interface LoaderProps extends SpinnerProps {
  label?: string;
  /** Fill the viewport (used while bootstrapping a session). */
  fullPage?: boolean;
}

export function Loader({
  label = 'Loading',
  fullPage = false,
  size = 'lg',
  className,
}: LoaderProps) {
  return (
    <div
      role="status"
      className={cn(
        'flex flex-col items-center justify-center gap-3 text-brand-600',
        fullPage ? 'min-h-screen' : 'py-12',
        className,
      )}
    >
      <Spinner size={size} />
      <span className="text-sm text-slate-500">{label}…</span>
    </div>
  );
}
