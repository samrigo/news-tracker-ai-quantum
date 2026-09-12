import { createFileRoute, Link } from "@tanstack/react-router";
import { RankBars, SentimentTrend, VolumeChart } from "@/components/charts/charts";
import { MentionList } from "@/components/feed/mentions";
import { MoiraDigestCard } from "@/components/helix/moira-digest";
import { KpiStrip } from "@/components/kpis";
import { AppShell, PageHeader } from "@/components/layout/app-shell";
import { TopicPills } from "@/components/layout/filters";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { regionLabel } from "@/lib/helix/catalog";
import { useIntelligence } from "@/lib/helix/use-intelligence";
import { formatCompact } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: Overview });

function Overview() {
  const { snap, mentions, volume, isFetching } = useIntelligence();
  const liveNote = snap.meta.liveNews
    ? `${snap.meta.liveNews} live headlines pulled this hour`
    : "Showing the prepared stream while wires refresh";

  return (
    <AppShell>
      <PageHeader
        eyebrow="Command center"
        title="Where AI, quantum and the rules are moving"
        description="Coverage, regulation and the tape — newsrooms, Washington, Brussels, social, and listed AI / quantum names in one desk."
        actions={
          <p className="text-xs text-subtle">
            {liveNote}
            {isFetching ? " · refreshing" : ""}
          </p>
        }
      />
      <TopicPills />

      <div className="mt-6">
        <MoiraDigestCard variant="teaser" />
      </div>

      <div className="mt-6">
        <KpiStrip kpis={snap.kpis} />
      </div>

      <div className="mt-4 grid min-w-0 gap-3 sm:grid-cols-3">
        <DeskLink
          to="/policy"
          kicker="Policy"
          title="Regulation desk"
          body="EU AI Act enforcement, EO 14409, CHIPS equity, PQC clock."
        />
        <DeskLink
          to="/markets"
          kicker="Markets"
          title="AI & quantum tape"
          body="NVDA, SMH, IONQ, RGTI — last, range, and the wires."
        />
        <DeskLink
          to="/signals"
          kicker="Signals"
          title="Quad 2 playbook"
          body="TREND long semis, TRADE fade IONQ, CHIPS names on the bid."
        />
      </div>

      <div className="mt-6 grid min-w-0 gap-4 lg:grid-cols-5">
        <section className="panel rounded-xl p-5 lg:col-span-3">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="font-display text-xl">Volume</h2>
            <span className="text-xs text-subtle">AI · quantum · policy</span>
          </div>
          <VolumeChart data={volume} />
        </section>
        <section className="panel rounded-xl p-5 lg:col-span-2">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="font-display text-xl">Sentiment mix</h2>
            <span className="text-xs text-subtle">earned + social</span>
          </div>
          <SentimentTrend data={volume} />
        </section>
      </div>

      <div className="mt-4 grid min-w-0 gap-4 lg:grid-cols-2">
        <section className="panel rounded-xl p-5">
          <h2 className="mb-4 font-display text-xl">Narrative shifts</h2>
          <ul className="space-y-4">
            {snap.shifts.map((s) => (
              <li key={s.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={s.topic === "policy" ? "warn" : s.topic === "ai" ? "accent" : "fg"}>
                    {s.topic}
                  </Badge>
                  <span className="text-xs text-subtle">
                    {s.window} · {s.magnitude.toFixed(1)}× baseline
                  </span>
                </div>
                <p className="mt-1.5 font-medium">{s.headline}</p>
                <p className="mt-1 text-sm text-muted">{s.detail}</p>
              </li>
            ))}
          </ul>
        </section>
        <section className="panel rounded-xl p-5">
          <h2 className="mb-1 font-display text-xl">Coverage by region</h2>
          <p className="mb-3 text-xs text-subtle">Languages and markets in this window</p>
          <RankBars items={snap.regions} />
          <div className="mt-3 flex flex-wrap gap-2">
            {snap.languages.slice(0, 6).map((l) => (
              <Badge key={l.key}>
                {l.label} {Math.round(l.share * 100)}%
              </Badge>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-4 grid min-w-0 gap-4 lg:grid-cols-5">
        <section className="panel min-w-0 rounded-xl p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl">Share of voice</h2>
            <Link to="/visibility" className="text-xs text-muted hover:text-fg">
              AI visibility
            </Link>
          </div>
          <ul className="space-y-3">
            {snap.brands.slice(0, 8).map((b) => {
              const max = snap.brands[0]?.mentions || 1;
              const pct = Math.max(4, (b.mentions / max) * 100);
              return (
                <li key={b.id} className="flex min-w-0 items-center gap-3">
                  <div className="w-24 shrink-0 truncate text-sm">{b.name}</div>
                  <div className="min-w-0 flex-1">
                    <div className="h-1.5 overflow-hidden rounded-full bg-elevated">
                      <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <span className="w-10 shrink-0 text-right text-xs tabular text-subtle">
                    {formatCompact(b.mentions)}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
        <section className="lg:col-span-3">
          <div className="mb-3 flex items-end justify-between">
            <h2 className="font-display text-xl">Latest coverage</h2>
            <Link to="/media" className="text-xs text-muted hover:text-fg">
              Open media intelligence
            </Link>
          </div>
          {isFetching && mentions.length === 0 ? (
            <div className="space-y-3">
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
            </div>
          ) : (
            <MentionList mentions={mentions.slice(0, 6)} />
          )}
        </section>
      </div>

      <p className="mt-8 text-xs text-subtle">
        Sources in this snapshot: {snap.meta.sources.join(" · ")}. Region labels such as {regionLabel("NA")}{" "}
        are inferred from outlet geography and copy. Markets and Signals are research, not an offer to buy or
        sell.
      </p>
    </AppShell>
  );
}

function DeskLink({
  to,
  kicker,
  title,
  body,
}: {
  to: "/policy" | "/markets" | "/signals";
  kicker: string;
  title: string;
  body: string;
}) {
  return (
    <Link to={to} className="panel panel-hover rounded-xl p-4">
      <p className="text-xs tracking-[0.16em] text-subtle uppercase">{kicker}</p>
      <p className="mt-1 font-display text-lg">{title}</p>
      <p className="mt-1 text-sm text-muted">{body}</p>
    </Link>
  );
}
