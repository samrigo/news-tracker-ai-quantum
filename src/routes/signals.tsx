import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/layout/app-shell";
import { TopicPills } from "@/components/layout/filters";
import { Badge } from "@/components/ui/badge";
import { useMarkets } from "@/lib/helix/use-markets";
import type { TradeDuration, TradeIdea } from "@/lib/helix/types";
import { cn, formatPct, formatPrice } from "@/lib/utils";

export const Route = createFileRoute("/signals")({ component: SignalsPage });

function SignalsPage() {
  const { snap, ideas } = useMarkets();
  const { regime } = snap;
  const featured = ideas.find((i) => i.ticker === "NVDA") ?? ideas[0];

  return (
    <AppShell>
      <PageHeader
        eyebrow="Signals"
        title="Process, not predictions"
        description="A Hedgeye-style desk: Quad regime, immediate-term risk ranges, and TRADE / TREND / TAIL ideas on the AI and quantum complex. Research snapshot — not an offer to buy or sell."
        actions={
          <Link to="/markets" className="text-xs text-muted hover:text-fg">
            Open the tape
          </Link>
        }
      />
      <TopicPills />

      <section className="panel mt-6 rounded-xl p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="warn">Quad {regime.quad}</Badge>
          <span className="text-xs text-subtle">as of {regime.asOf.slice(0, 10)}</span>
        </div>
        <h2 className="mt-2 font-display text-2xl md:text-3xl">{regime.label}</h2>
        <p className="mt-3 max-w-3xl text-sm text-muted">{regime.summary}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Gip label="Growth" value={regime.growth} up={regime.growth === "accelerating"} />
          <Gip label="Inflation" value={regime.inflation} up={regime.inflation === "accelerating"} />
          <Gip label="Policy" value={regime.policy} up={regime.policy === "industrial"} />
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs tracking-[0.16em] text-subtle uppercase">Overweight</p>
            <ul className="mt-2 space-y-1 text-sm text-muted">
              {regime.overweight.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs tracking-[0.16em] text-subtle uppercase">Underweight</p>
            <ul className="mt-2 space-y-1 text-sm text-muted">
              {regime.underweight.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {featured ? (
        <section className="mt-4 rounded-xl bg-elevated p-5 shadow-[var(--shadow-border)] md:p-6">
          <p className="text-xs tracking-[0.16em] text-subtle uppercase">Trade of the week</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <h2 className="font-display text-2xl">{featured.ticker}</h2>
            <BiasBadge idea={featured} />
            <DurationBadge duration={featured.duration} />
            <Conviction n={featured.conviction} />
          </div>
          <p className="mt-3 max-w-3xl text-sm text-muted">{featured.thesis}</p>
          <RangeRow idea={featured} />
        </section>
      ) : null}

      <div className="mt-6 space-y-3">
        {ideas.map((idea) => (
          <IdeaCard key={idea.id} idea={idea} />
        ))}
      </div>

      <p className="mt-8 max-w-2xl text-xs text-subtle">
        Duration: TRADE is days to weeks, TREND is three months or more, TAIL is a multi-year compounder.
        Immediate-term risk range is the near-term band we respect on the tape. Levels move with the close.
        This is not personalized investment advice.
      </p>
    </AppShell>
  );
}

function Gip({ label, value, up }: { label: string; value: string; up: boolean }) {
  return (
    <div className="rounded-lg bg-bg px-4 py-3 shadow-[var(--shadow-border)]">
      <p className="text-xs tracking-wide text-subtle uppercase">{label}</p>
      <p className={cn("mt-1 text-sm font-medium", up ? "text-pos" : "text-neg")}>{value}</p>
    </div>
  );
}

function BiasBadge({ idea }: { idea: TradeIdea }) {
  return <Badge tone={idea.bias === "long" ? "pos" : "neg"}>{idea.bias}</Badge>;
}

function DurationBadge({ duration }: { duration: TradeDuration }) {
  const tone = duration === "TRADE" ? "warn" : duration === "TREND" ? "accent" : "default";
  return <Badge tone={tone}>{duration}</Badge>;
}

function Conviction({ n }: { n: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`Conviction ${n} of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={cn("size-1.5 rounded-full", i < n ? "bg-fg" : "bg-elevated shadow-[var(--shadow-border)]")}
        />
      ))}
    </span>
  );
}

function RangeRow({ idea }: { idea: TradeIdea }) {
  const long = idea.bias === "long";
  return (
    <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
      <div>
        <dt className="text-xs text-subtle">Last / entry</dt>
        <dd className="tabular">{formatPrice(idea.entry)}</dd>
      </div>
      <div>
        <dt className="text-xs text-subtle">Risk range</dt>
        <dd className="tabular">
          {formatPrice(idea.riskLow)} – {formatPrice(idea.riskHigh)}
        </dd>
      </div>
      <div>
        <dt className="text-xs text-subtle">Stop</dt>
        <dd className={cn("tabular", long ? "text-neg" : "text-pos")}>{formatPrice(idea.stop)}</dd>
      </div>
      <div>
        <dt className="text-xs text-subtle">Target</dt>
        <dd className={cn("tabular", long ? "text-pos" : "text-neg")}>
          {formatPrice(idea.target)}{" "}
          <span className="text-xs text-subtle">
            {formatPct(((idea.target - idea.entry) / idea.entry) * 100 * (long ? 1 : -1), 1)}
          </span>
        </dd>
      </div>
    </dl>
  );
}

function IdeaCard({ idea }: { idea: TradeIdea }) {
  return (
    <article className="panel rounded-xl p-5">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-display text-xl">
          {idea.ticker} <span className="text-muted">{idea.name}</span>
        </h3>
        <BiasBadge idea={idea} />
        <DurationBadge duration={idea.duration} />
        <Conviction n={idea.conviction} />
      </div>
      <p className="mt-2 text-sm text-muted">{idea.thesis}</p>
      <RangeRow idea={idea} />
      <div className="mt-4 grid gap-3 text-xs text-subtle md:grid-cols-2">
        <p>
          <span className="text-muted">Catalyst. </span>
          {idea.catalyst}
        </p>
        <p>
          <span className="text-muted">Invalidation. </span>
          {idea.invalidation}
        </p>
      </div>
    </article>
  );
}
