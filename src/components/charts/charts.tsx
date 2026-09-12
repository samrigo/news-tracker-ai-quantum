import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { NamedCount, VolumePoint } from "@/lib/helix/types";
import { formatCompact } from "@/lib/utils";

const AXIS = { fontSize: 11, fill: "var(--color-subtle)", tickLine: false, axisLine: false } as const;
const GRID = { stroke: "color-mix(in oklab, var(--color-fg) 6%, transparent)", vertical: false } as const;

function ChartTip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-sm bg-fg px-2.5 py-2 text-xs text-bg">
      <div className="mb-1 font-medium">{label}</div>
      {payload.map((p) => (
        <div key={p.name} className="flex justify-between gap-4">
          <span>{p.name}</span>
          <span className="tabular">{formatCompact(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

export function VolumeChart({ data }: { data: VolumePoint[] }) {
  const rows = data.map((d) => ({
    ...d,
    label: d.date.slice(5),
    AI: d.ai,
    Quantum: d.quantum,
    Policy: d.policy,
  }));
  return (
    <div className="h-64 w-full min-w-0 overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="aiFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.28} />
              <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="qFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-muted)" stopOpacity={0.22} />
              <stop offset="100%" stopColor="var(--color-muted)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="pFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-warn)" stopOpacity={0.22} />
              <stop offset="100%" stopColor="var(--color-warn)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid {...GRID} />
          <XAxis dataKey="label" {...AXIS} />
          <YAxis {...AXIS} tickFormatter={formatCompact} width={36} />
          <Tooltip content={<ChartTip />} />
          <Area type="monotone" dataKey="AI" stroke="var(--color-accent)" fill="url(#aiFill)" strokeWidth={1.6} />
          <Area type="monotone" dataKey="Quantum" stroke="var(--color-muted)" fill="url(#qFill)" strokeWidth={1.6} />
          <Area type="monotone" dataKey="Policy" stroke="var(--color-warn)" fill="url(#pFill)" strokeWidth={1.6} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SentimentTrend({ data }: { data: VolumePoint[] }) {
  const rows = data.map((d) => ({
    label: d.date.slice(5),
    Positive: d.positive,
    Negative: d.negative,
    Neutral: d.neutral,
  }));
  return (
    <div className="h-56 w-full min-w-0 overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid {...GRID} />
          <XAxis dataKey="label" {...AXIS} />
          <YAxis {...AXIS} tickFormatter={formatCompact} width={36} />
          <Tooltip content={<ChartTip />} />
          <Bar dataKey="Positive" stackId="s" fill="var(--color-pos)" radius={[0, 0, 0, 0]} />
          <Bar dataKey="Neutral" stackId="s" fill="var(--color-elevated)" />
          <Bar dataKey="Negative" stackId="s" fill="var(--color-neg)" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const BAR_COLORS = [
  "var(--color-accent)",
  "var(--color-muted)",
  "var(--color-subtle)",
  "var(--color-pos)",
  "var(--color-warn)",
  "var(--color-neg)",
];

export function RankBars({ items }: { items: NamedCount[] }) {
  const rows = items.slice(0, 8).map((i) => ({ name: i.label, value: i.value }));
  return (
    <div className="h-64 w-full min-w-0 overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} layout="vertical" margin={{ top: 4, right: 12, left: 8, bottom: 0 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" width={88} tick={{ fontSize: 11, fill: "var(--color-subtle)" }} tickLine={false} axisLine={false} />
          <Tooltip content={<ChartTip />} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
            {rows.map((_, i) => (
              <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
