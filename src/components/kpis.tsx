import { formatCompact, formatPct } from "@/lib/utils";
import type { IntelligenceSnapshot } from "@/lib/helix/types";
import { cn } from "@/lib/utils";

function Delta({ value }: { value: number }) {
  const pos = value >= 0;
  return (
    <span className={cn("tabular text-xs", pos ? "text-pos" : "text-neg")}>
      {formatPct(value, 1)}
    </span>
  );
}

export function KpiStrip({ kpis }: { kpis: IntelligenceSnapshot["kpis"] }) {
  const items = [
    { label: "Mentions", value: formatCompact(kpis.mentions24h), delta: kpis.mentionsDelta, hint: "vs prior day" },
    { label: "Est. reach", value: formatCompact(kpis.reach24h), delta: kpis.reachDelta, hint: "earned + social" },
    {
      label: "Net sentiment",
      value: formatPct(kpis.sentiment * 100, 0),
      delta: kpis.sentimentDelta,
      hint: "positive minus negative",
    },
    {
      label: "Mix",
      value: `${Math.round(kpis.shareAi * 100)}/${Math.round(kpis.shareQuantum * 100)}/${Math.round(kpis.sharePolicy * 100)}`,
      delta: undefined,
      hint: "AI / quantum / policy",
    },
    {
      label: "AI visibility",
      value: kpis.visibilityIndex.toFixed(0),
      delta: kpis.visibilityDelta,
      hint: "assistant mention index",
    },
    { label: "Spike alerts", value: String(kpis.spikeCount), delta: undefined, hint: "active narrative shifts" },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
      {items.map((item) => (
        <div key={item.label} className="panel rounded-xl p-4">
          <p className="text-xs tracking-wide text-subtle uppercase">{item.label}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="font-display text-2xl leading-none tabular">{item.value}</p>
            {item.delta !== undefined ? <Delta value={item.delta} /> : null}
          </div>
          <p className="mt-2 text-xs text-subtle">{item.hint}</p>
        </div>
      ))}
    </div>
  );
}
