import { createServerFn } from "@tanstack/react-start";
import { assembleSnapshot } from "./aggregate";
import { assembleMarkets } from "./markets";
import type { IntelligenceSnapshot, MarketsSnapshot, TopicFilter } from "./types";

export const getIntelligence = createServerFn({ method: "GET" }).handler(
  async (): Promise<IntelligenceSnapshot> => {
    const { ingestLive } = await import("./ingest.server.ts");
    const { isAiAvailable } = await import("./xai.server.ts");
    const live = await ingestLive();
    return assembleSnapshot(live.mentions, {
      sources: live.sources.length
        ? [...live.sources, "X sample", "TikTok clusters", "Instagram clusters"]
        : undefined,
      aiAvailable: isAiAvailable(),
    });
  },
);

export const getMarkets = createServerFn({ method: "GET" }).handler(
  async (): Promise<MarketsSnapshot> => {
    const [{ ingestLive }, { fetchLiveQuotes }] = await Promise.all([
      import("./ingest.server.ts"),
      import("./quotes.server.ts"),
    ]);
    const [live, quotes] = await Promise.all([ingestLive(), fetchLiveQuotes()]);
    const marketish = live.mentions.filter((m) =>
      /stock|shares|nasdaq|nyse|earnings|chip|nvda|ionq|rigetti|broadcom|tape|market/i.test(
        `${m.title} ${m.excerpt} ${m.source}`,
      ),
    );
    return assembleMarkets(quotes, marketish);
  },
);

export const generateBriefFn = createServerFn({ method: "POST" })
  .validator((input: { topic: TopicFilter }) => input)
  .handler(async ({ data }) => {
    const { ingestLive } = await import("./ingest.server.ts");
    const { generateDailyBrief } = await import("./xai.server.ts");
    const live = await ingestLive();
    const snap = assembleSnapshot(live.mentions);
    return generateDailyBrief(snap, data.topic);
  });

export const askHelixFn = createServerFn({ method: "POST" })
  .validator((input: { question: string }) => input)
  .handler(async ({ data }) => {
    const { ingestLive } = await import("./ingest.server.ts");
    const { askHelix } = await import("./xai.server.ts");
    const live = await ingestLive();
    const snap = assembleSnapshot(live.mentions);
    return askHelix(snap, data.question);
  });

export const scanVisibilityFn = createServerFn({ method: "POST" }).handler(async () => {
  const { ingestLive } = await import("./ingest.server.ts");
  const { scanVisibility } = await import("./xai.server.ts");
  const live = await ingestLive();
  const snap = assembleSnapshot(live.mentions);
  return scanVisibility(snap);
});

export const refreshSocialFn = createServerFn({ method: "POST" }).handler(async () => {
  const { refreshSocialLive } = await import("./xai.server.ts");
  return refreshSocialLive();
});
