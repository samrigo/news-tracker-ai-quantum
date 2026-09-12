import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { AppShell, PageHeader } from "@/components/layout/app-shell";
import { TopicPills } from "@/components/layout/filters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { generateBriefFn } from "@/lib/helix/api";
import { useIntelligence } from "@/lib/helix/use-intelligence";
import type { DailyBrief } from "@/lib/helix/types";

const STORAGE_KEY = "tideline-brief";

function readCache(): DailyBrief | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DailyBrief) : null;
  } catch {
    return null;
  }
}

export const Route = createFileRoute("/brief")({ component: BriefPage });

function BriefPage() {
  const { snap, topic } = useIntelligence();
  const [brief, setBrief] = useState<DailyBrief | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setBrief(readCache());
  }, []);

  const gen = useMutation({
    mutationFn: () => generateBriefFn({ data: { topic } }),
    onSuccess: (res) => {
      if ("error" in res) {
        setError(res.error);
        return;
      }
      setError(null);
      setBrief(res);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(res));
      } catch {
        /* ignore */
      }
    },
  });

  return (
    <AppShell>
      <PageHeader
        eyebrow="Daily briefing"
        title="What leadership needs before the stand-up"
        description="A dated executive note from today's AI and quantum stream — headlines, risks, and what to watch next. Generate when you want a fresh pass; yesterday's copy stays until you do."
        actions={
          <Button onClick={() => gen.mutate()} disabled={gen.isPending}>
            {gen.isPending ? "Writing the brief…" : "Generate today's brief"}
          </Button>
        }
      />
      <TopicPills />
      {error ? <p className="mt-4 text-sm text-neg">{error}</p> : null}

      {brief ? (
        <article className="panel mt-6 rounded-xl p-6 md:p-8">
          <p className="text-xs tracking-[0.16em] text-subtle uppercase">
            {new Date(brief.generatedAt).toLocaleString()}
          </p>
          <h2 className="mt-2 font-display text-3xl leading-tight">{brief.headline}</h2>
          <p className="mt-3 max-w-3xl text-base text-muted">{brief.lede}</p>
          <ol className="mt-8 space-y-6">
            {brief.bullets?.map((b, i) => (
              <li key={i}>
                <Badge className="mb-2">{b.topic}</Badge>
                <h3 className="font-display text-xl">{b.title}</h3>
                <p className="mt-1 text-sm text-muted">{b.body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <section>
              <h3 className="text-xs tracking-[0.16em] text-subtle uppercase">Risks</h3>
              <ul className="mt-2 list-disc space-y-2 pl-4 text-sm text-muted">
                {brief.risks?.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </section>
            <section>
              <h3 className="text-xs tracking-[0.16em] text-subtle uppercase">Opportunities</h3>
              <ul className="mt-2 list-disc space-y-2 pl-4 text-sm text-muted">
                {brief.opportunities?.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </section>
          </div>
          <section className="mt-8">
            <h3 className="text-xs tracking-[0.16em] text-subtle uppercase">Watch next</h3>
            <ul className="mt-2 space-y-1 text-sm text-muted">
              {brief.watchNext?.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </section>
        </article>
      ) : (
        <div className="panel mt-6 rounded-xl p-8">
          <p className="max-w-xl text-sm text-muted">
            No brief on file yet. Generate one to have Helix read the current stream
            {snap.mentions.length ? ` (${snap.mentions.length} items loaded)` : ""} and write a leadership note.
          </p>
        </div>
      )}
    </AppShell>
  );
}
