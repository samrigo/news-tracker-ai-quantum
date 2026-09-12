import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { RankBars, VolumeChart } from "@/components/charts/charts";
import { ChannelFilter, MentionList } from "@/components/feed/mentions";
import { AppShell, PageHeader } from "@/components/layout/app-shell";
import { TopicPills } from "@/components/layout/filters";
import { Badge, SentimentBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { refreshSocialFn } from "@/lib/helix/api";
import { channelLabel, regionLabel } from "@/lib/helix/catalog";
import { useHelix } from "@/lib/helix/store";
import { useIntelligence } from "@/lib/helix/use-intelligence";
import { formatCompact } from "@/lib/utils";

export const Route = createFileRoute("/social")({ component: SocialPage });

function SocialPage() {
  const { snap, mentions, volume } = useIntelligence();
  const channel = useHelix((s) => s.channel);
  const social = mentions.filter((m) => m.channel !== "news");
  const clusters = snap.clusters.filter((c) => channel === "all" || c.channel === channel);
  const [notes, setNotes] = useState<string | null>(null);
  const refresh = useMutation({
    mutationFn: () => refreshSocialFn(),
    onSuccess: (res) => setNotes(res.ok ? res.notes : res.error),
  });

  return (
    <AppShell>
      <PageHeader
        eyebrow="Social listening"
        title="Watch the conversation move"
        description="X, TikTok, Instagram and Reddit — volume, sentiment shifts, and the clusters that jump from specialist threads into consumer feeds."
        actions={
          <Button variant="secondary" onClick={() => refresh.mutate()} disabled={refresh.isPending}>
            {refresh.isPending ? "Listening…" : "Refresh live social"}
          </Button>
        }
      />
      <TopicPills />
      <div className="mt-4">
        <ChannelFilter />
      </div>

      {notes ? (
        <section className="panel mt-5 rounded-xl p-5">
          <h2 className="mb-2 font-display text-xl">Live social note</h2>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted">{notes}</p>
        </section>
      ) : null}

      <div className="mt-6 grid min-w-0 gap-4 lg:grid-cols-5">
        <section className="panel rounded-xl p-5 lg:col-span-3">
          <h2 className="mb-3 font-display text-xl">Conversation volume</h2>
          <VolumeChart data={volume} />
        </section>
        <section className="panel rounded-xl p-5 lg:col-span-2">
          <h2 className="mb-3 font-display text-xl">Channel mix</h2>
          <RankBars items={snap.channels.filter((c) => c.key !== "news")} />
        </section>
      </div>

      <h2 className="mt-8 mb-3 font-display text-xl">Conversation clusters</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {clusters.map((c) => (
          <article key={c.id} className="panel rounded-xl p-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{channelLabel(c.channel)}</Badge>
              <SentimentBadge value={c.sentiment} />
              <span className="text-xs text-subtle">{c.topic}</span>
            </div>
            <h3 className="mt-2 font-display text-xl leading-snug">{c.theme}</h3>
            <p className="mt-2 text-sm text-muted">{c.summary}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-subtle">
              {c.hashtags.map((h) => (
                <span key={h}>{h}</span>
              ))}
            </div>
            <p className="mt-3 text-xs text-subtle">
              {formatCompact(c.views)} est. views · {formatCompact(c.posts)} posts ·{" "}
              {c.regions.map(regionLabel).join(", ")}
            </p>
          </article>
        ))}
      </div>

      <h2 className="mt-8 mb-3 font-display text-xl">Sampled posts</h2>
      <MentionList mentions={social.slice(0, 30)} />
    </AppShell>
  );
}
