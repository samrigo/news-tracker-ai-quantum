import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { AppShell, PageHeader } from "@/components/layout/app-shell";
import { TopicPills } from "@/components/layout/filters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { scanVisibilityFn } from "@/lib/helix/api";
import { useIntelligence } from "@/lib/helix/use-intelligence";
import type { BrandAiVisibility } from "@/lib/helix/types";
import { cn, formatPct } from "@/lib/utils";

export const Route = createFileRoute("/visibility")({ component: VisibilityPage });

function VisibilityPage() {
  const { snap, topic } = useIntelligence();
  const [rows, setRows] = useState<BrandAiVisibility[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scan = useMutation({
    mutationFn: () => scanVisibilityFn(),
    onSuccess: (res) => {
      if (Array.isArray(res)) {
        setRows(res);
        setError(null);
      } else {
        setError(res.error);
      }
    },
  });
  const data = (rows ?? snap.visibility).filter((v) => topic === "all" || v.topic === topic);

  return (
    <AppShell>
      <PageHeader
        eyebrow="AI visibility tracking"
        title="How assistants describe the category"
        description="See whether Grok, ChatGPT, Gemini, Claude and Perplexity surface your brand — and with which narrative. Live Grok scans sit next to estimates for the other models."
        actions={
          <Button onClick={() => scan.mutate()} disabled={scan.isPending}>
            {scan.isPending ? "Scanning assistants…" : "Run live Grok scan"}
          </Button>
        }
      />
      <TopicPills />
      {error ? <p className="mt-4 text-sm text-neg">{error}</p> : null}

      <div className="mt-6 grid gap-3">
        {data.map((brand) => (
          <article key={brand.brandId} className="panel rounded-xl p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-2xl">{brand.brand}</h2>
                  <Badge>{brand.topic}</Badge>
                </div>
                <p className="mt-2 max-w-3xl text-sm text-muted">{brand.narrative}</p>
              </div>
              <div className="text-right">
                <p className="text-xs tracking-wide text-subtle uppercase">Visibility index</p>
                <p className="font-display text-3xl tabular">{brand.overall}</p>
                <p className={cn("text-xs", brand.delta >= 0 ? "text-pos" : "text-neg")}>
                  {formatPct(brand.delta, 0)} this week
                </p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-5">
              {brand.models.map((m) => (
                <div key={m.model} className="rounded-lg bg-elevated p-3">
                  <p className="text-xs text-subtle">{m.provider}</p>
                  <p className="mt-0.5 font-medium">{m.model}</p>
                  <p className="mt-2 text-lg tabular">{m.mentionRate}</p>
                  <p className="text-xs text-subtle">mention rate</p>
                  <p className="mt-2 text-xs text-muted">
                    Sentiment {m.sentiment >= 0 ? "+" : ""}
                    {m.sentiment.toFixed(2)} · {m.recency}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-subtle">Cited in answers: {brand.citedSources.join(" · ")}</p>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
