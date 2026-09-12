import type { Quote } from "@/lib/helix/types";
import { cn, formatPct, formatPrice } from "@/lib/utils";

export function TickerTape({ quotes }: { quotes: Quote[] }) {
  const loop = [...quotes, ...quotes];
  return (
    <div className="relative overflow-hidden rounded-xl bg-elevated shadow-[var(--shadow-border)]">
      <div className="tape-track flex w-max gap-8 px-4 py-2.5">
        {loop.map((q, i) => {
          const up = q.change >= 0;
          return (
            <div key={`${q.ticker}-${i}`} className="flex shrink-0 items-baseline gap-2 text-xs">
              <span className="tracking-wide text-muted uppercase">{q.ticker}</span>
              <span className="tabular text-fg">{formatPrice(q.last)}</span>
              <span className={cn("tabular", up ? "text-pos" : "text-neg")}>
                {formatPct(q.changePct, 2)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Sparkline({ values, up }: { values: number[]; up: boolean }) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const w = 72;
  const h = 28;
  const d = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / span) * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-7 w-[72px]" aria-hidden>
      <path d={d} fill="none" stroke={up ? "var(--color-pos)" : "var(--color-neg)"} strokeWidth="1.5" />
    </svg>
  );
}
