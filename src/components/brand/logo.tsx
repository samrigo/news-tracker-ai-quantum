import { cn } from "@/lib/utils";

export function TideMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("text-accent", className)} aria-hidden>
      <rect width="32" height="32" rx="8" fill="currentColor" opacity="0.08" />
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M6 12c4.2-4.6 7.6-4.6 10 0s7.6 4.6 10 0" />
        <path d="M6 21c4.2-4.6 7.6-4.6 10 0s7.6 4.6 10 0" />
      </g>
    </svg>
  );
}

export function Wordmark({ compact }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <TideMark className="size-8 shrink-0" />
      <div className={cn(compact && "sr-only")}>
        <div className="font-display text-lg leading-none tracking-tight">Tideline</div>
        <div className="mt-0.5 text-xs tracking-widest text-subtle uppercase">Intelligence</div>
      </div>
    </div>
  );
}
