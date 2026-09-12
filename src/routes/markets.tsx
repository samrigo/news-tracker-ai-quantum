import { createFileRoute, Link } from "@tanstack/react-router";
import { MentionList } from "@/components/feed/mentions";
import { AppShell, PageHeader } from "@/components/layout/app-shell";
import { TopicPills } from "@/components/layout/filters";
import { Sparkline, TickerTape } from "@/components/markets/tape";
import { Badge } from "@/components/ui/badge";
import { sleeveLabel } from "@/lib/helix/markets";
import { useMarkets } from "@/lib/helix/use-markets";
import type { Quote } from "@/lib/helix/types";
import { cn, formatCompact, formatPct, formatPrice } from "@/lib/utils";

export const Route = createFileRoute("/markets")({ component: MarketsPage });

function MarketsPage() {
  const { snap, quotes, headlines, isFetching } = useMarkets();
  const aiNames = quotes.filter((q) => q.sleeve === "ai" || q.sleeve === "semis");
  const qNames = quotes.filter((q) => q.sleeve === "quantum");

  return (
    <AppShell>
      <PageHeader
        eyebrow="Markets"
        title="AI and quantum on the tape"
        description="A Bloomberg-style watchlist for the complex: last, change, range and the wires that actually move NVDA, the semi basket, and the listed quantum names."
        actions={
          <p className="text-xs text-subtle">
            {snap.source}
            {isFetching ? " · refreshing" : ""}
            {snap.live ? " · live" : " · last close"}
          </p>
        }
      />
      <TopicPills />

      <div className="mt-5">
        <TickerTape quotes={snap.quotes} />
      </div>

      <div className="mt-4 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SleeveCard label="AI complex" quotes={aiNames} />
        <SleeveCard label="Quantum listed" quotes={qNames} />
        <SleeveCard label="QQQ" quotes={quotes.filter((q) => q.ticker === "QQQ")} />
        <SleeveCard label="SMH" quotes={quotes.filter((q) => q.ticker === "SMH")} />
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl bg-surface shadow-[var(--shadow-border)]">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-xs tracking-wide text-subtle uppercase">
            <tr className="border-b border-border">
              <th className="px-4 py-3 font-medium">Ticker</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Sleeve</th>
              <th className="px-4 py-3 text-right font-medium">Last</th>
              <th className="px-4 py-3 text-right font-medium">Chg</th>
              <th className="hidden px-4 py-3 text-right font-medium md:table-cell">Range</th>
              <th className="hidden px-4 py-3 text-right font-medium lg:table-cell">Volume</th>
              <th className="px-4 py-3 font-medium">30d</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((q) => {
              const up = q.change >= 0;
              return (
                <tr key={q.ticker} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium tracking-wide">{q.ticker}</td>
                  <td className="px-4 py-3 text-muted">{q.name}</td>
                  <td className="px-4 py-3">
                    <Badge>{sleeveLabel(q.sleeve)}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right tabular">{formatPrice(q.last)}</td>
                  <td className={cn("px-4 py-3 text-right tabular", up ? "text-pos" : "text-neg")}>
                    {formatPct(q.changePct, 2)}
                  </td>
                  <td className="hidden px-4 py-3 text-right text-xs tabular text-subtle md:table-cell">
                    {formatPrice(q.low)} – {formatPrice(q.high)}
                  </td>
                  <td className="hidden px-4 py-3 text-right tabular text-subtle lg:table-cell">
                    {formatCompact(q.volume)}
                  </td>
                  <td className="px-4 py-3">
                    <Sparkline values={q.spark} up={up} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-subtle">
        Research snapshot, not an offer to buy or sell. Quotes may be delayed.{" "}
        <Link to="/signals" className="text-muted hover:text-fg">
          Signals with risk ranges
        </Link>
        .
      </p>

      <div className="mt-8 grid min-w-0 gap-4 lg:grid-cols-5">
        <section className="panel rounded-xl p-5 lg:col-span-2">
          <h2 className="mb-3 font-display text-xl">Diary</h2>
          <ul className="space-y-3">
            {snap.calendar.map((c) => (
              <li key={c.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                <div className="flex items-center gap-2">
                  <Badge>{c.kind}</Badge>
                  <span className="text-xs tabular text-subtle">{c.date.slice(5)}</span>
                </div>
                <p className="mt-1 text-sm font-medium">{c.label}</p>
                <p className="mt-0.5 text-xs text-muted">{c.detail}</p>
              </li>
            ))}
          </ul>
        </section>
        <section className="lg:col-span-3">
          <h2 className="mb-3 font-display text-xl">Market wire</h2>
          <MentionList mentions={headlines.slice(0, 8)} />
        </section>
      </div>
    </AppShell>
  );
}

function SleeveCard({ label, quotes }: { label: string; quotes: Quote[] }) {
  const avg =
    quotes.length === 0 ? 0 : quotes.reduce((s, q) => s + q.changePct, 0) / quotes.length;
  const up = avg >= 0;
  const leader = [...quotes].sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct))[0];
  return (
    <div className="panel rounded-xl p-4">
      <p className="text-xs tracking-wide text-subtle uppercase">{label}</p>
      <p className={cn("mt-2 font-display text-2xl tabular", up ? "text-pos" : "text-neg")}>
        {formatPct(avg, 2)}
      </p>
      <p className="mt-1 text-xs text-subtle">
        {leader ? `${leader.ticker} ${formatPct(leader.changePct, 2)}` : "—"}
      </p>
    </div>
  );
}
