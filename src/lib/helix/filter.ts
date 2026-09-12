import type { IntelligenceSnapshot, Mention, RangeKey, TopicFilter } from "./types";

export function rangeStart(range: RangeKey): number {
  const hours = range === "24h" ? 24 : range === "7d" ? 24 * 7 : 24 * 30;
  return Date.now() - hours * 3600_000;
}

export function applyFilters(
  snap: IntelligenceSnapshot,
  opts: {
    topic: TopicFilter;
    range: RangeKey;
    channel?: string;
    sentiment?: string;
    query?: string;
  },
): Mention[] {
  const start = rangeStart(opts.range);
  const q = opts.query?.trim().toLowerCase() ?? "";
  return snap.mentions.filter((m) => {
    if (opts.topic !== "all" && m.topic !== opts.topic) return false;
    if (+new Date(m.publishedAt) < start) return false;
    if (opts.channel && opts.channel !== "all" && m.channel !== opts.channel) return false;
    if (opts.sentiment && opts.sentiment !== "all" && m.sentiment !== opts.sentiment) return false;
    if (q) {
      const hay = `${m.title} ${m.excerpt} ${m.source} ${m.author ?? ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function sliceVolume(snap: IntelligenceSnapshot, range: RangeKey) {
  if (range === "24h") return snap.volume.slice(-2);
  if (range === "7d") return snap.volume.slice(-7);
  return snap.volume;
}
