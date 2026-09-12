import { useState } from "react";
import { Badge, SentimentBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { CHANNELS, channelLabel, languageLabel, regionLabel } from "@/lib/helix/catalog";
import { useHelix } from "@/lib/helix/store";
import type { Channel, Mention } from "@/lib/helix/types";
import { cn, formatCompact, formatRelative } from "@/lib/utils";

export function MentionCard({ mention, onOpen }: { mention: Mention; onOpen: (m: Mention) => void }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(mention)}
      className="panel panel-hover w-full rounded-xl p-4 text-left"
    >
      <div className="flex flex-wrap items-center gap-2 text-xs text-subtle">
        <Badge tone={mention.topic === "policy" ? "warn" : mention.topic === "quantum" ? "fg" : "accent"}>
          {mention.topic}
        </Badge>
        <Badge>{channelLabel(mention.channel)}</Badge>
        <SentimentBadge value={mention.sentiment} />
        <span>{mention.source}</span>
        <span>{formatRelative(mention.publishedAt)}</span>
      </div>
      <h3 className="mt-2 font-display text-lg leading-snug font-medium">{mention.title}</h3>
      {mention.excerpt && mention.excerpt !== mention.title ? (
        <p className="mt-1.5 line-clamp-2 text-sm break-words text-muted">{mention.excerpt}</p>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-subtle">
        <span>{regionLabel(mention.region)}</span>
        <span>{languageLabel(mention.language)}</span>
        <span className="tabular">{formatCompact(mention.reach)} reach</span>
      </div>
    </button>
  );
}

export function MentionList({ mentions }: { mentions: Mention[] }) {
  const [open, setOpen] = useState<Mention | null>(null);
  if (mentions.length === 0) {
    return <p className="py-12 text-center text-sm text-muted">No coverage in this filter.</p>;
  }
  return (
    <>
      <div className="grid gap-3">
        {mentions.map((m) => (
          <MentionCard key={m.id} mention={m} onOpen={setOpen} />
        ))}
      </div>
      <Sheet open={Boolean(open)} onOpenChange={(v) => !v && setOpen(null)}>
        {open ? (
          <SheetContent title={open.source}>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge>{channelLabel(open.channel)}</Badge>
                <SentimentBadge value={open.sentiment} />
                <Badge>{regionLabel(open.region)}</Badge>
                <Badge>{languageLabel(open.language)}</Badge>
              </div>
              <h2 className="font-display text-2xl leading-snug">{open.title}</h2>
              <p className="text-sm leading-relaxed text-muted">{open.excerpt}</p>
              <p className="text-xs text-subtle">
                {formatRelative(open.publishedAt)} · {formatCompact(open.reach)} estimated reach ·{" "}
                {formatCompact(open.engagement)} engagement
              </p>
              {open.handle ? <p className="text-sm text-muted">{open.handle}</p> : null}
              <Button asChild className="w-full">
                <a href={open.url} target="_blank" rel="noreferrer">
                  Open source
                </a>
              </Button>
            </div>
          </SheetContent>
        ) : null}
      </Sheet>
    </>
  );
}

export function ChannelFilter() {
  const channel = useHelix((s) => s.channel);
  const setChannel = useHelix((s) => s.setChannel);
  const options: { id: Channel | "all"; label: string }[] = [
    { id: "all", label: "All channels" },
    ...CHANNELS.map((c) => ({ id: c.code, label: c.label })),
  ];
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => setChannel(o.id)}
          className={cn(
            "min-h-9 rounded-full px-3 text-xs transition-colors",
            channel === o.id ? "bg-fg text-bg" : "bg-elevated text-muted hover:text-fg",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
