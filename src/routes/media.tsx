import { createFileRoute } from "@tanstack/react-router";
import { RankBars } from "@/components/charts/charts";
import { ChannelFilter, MentionList } from "@/components/feed/mentions";
import { AppShell, PageHeader } from "@/components/layout/app-shell";
import { TopicPills } from "@/components/layout/filters";
import { Badge } from "@/components/ui/badge";
import { useHelix } from "@/lib/helix/store";
import { useIntelligence } from "@/lib/helix/use-intelligence";
import { LANGUAGES } from "@/lib/helix/catalog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/media")({ component: MediaPage });

function MediaPage() {
  const { snap, mentions } = useIntelligence();
  const query = useHelix((s) => s.query);
  const setQuery = useHelix((s) => s.setQuery);
  const news = mentions.filter((m) => m.channel === "news");

  return (
    <AppShell>
      <PageHeader
        eyebrow="Media intelligence"
        title="Coverage across regions and languages"
        description="Track how AI, quantum and regulation stories land in newsrooms worldwide — outlet mix, language split, and the pieces carrying the most estimated reach."
      />
      <TopicPills />

      <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search headlines, outlets, brands…"
          className="h-11 min-w-0 flex-1 rounded-md bg-elevated px-3 text-sm shadow-[var(--shadow-border)] placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
        <ChannelFilter />
      </div>

      <div className="mt-6 grid min-w-0 gap-4 lg:grid-cols-3">
        <section className="panel rounded-xl p-5">
          <h2 className="mb-2 font-display text-xl">Top outlets</h2>
          <RankBars items={snap.outlets} />
        </section>
        <section className="panel rounded-xl p-5">
          <h2 className="mb-2 font-display text-xl">Languages</h2>
          <RankBars items={snap.languages} />
        </section>
        <section className="panel rounded-xl p-5">
          <h2 className="mb-2 font-display text-xl">Regions</h2>
          <RankBars items={snap.regions} />
        </section>
      </div>

      <LanguageHint />

      <div className="mt-6 flex items-end justify-between">
        <h2 className="font-display text-xl">Story stream</h2>
        <span className="text-xs text-subtle">{mentions.length} items in view</span>
      </div>
      <div className="mt-3">
        <MentionList mentions={mentions.slice(0, 40)} />
      </div>
      {news.length === 0 ? null : (
        <p className="mt-6 text-xs text-subtle">
          Live wires overlay the prepared stream. Click any card for source, language and estimated reach.
        </p>
      )}
    </AppShell>
  );
}

function LanguageHint() {
  return (
    <div className="mt-4 flex flex-wrap gap-1.5">
      {LANGUAGES.slice(0, 8).map((l) => (
        <Badge key={l.code} className={cn("normal-case")}>
          {l.label}
        </Badge>
      ))}
    </div>
  );
}
