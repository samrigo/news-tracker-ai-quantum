import { BRANDS, CHANNELS, regionLabel, languageLabel } from "./catalog";
import { seedClusters, seedMentions, seedShifts, seedVisibility, seedVolume } from "./seed";
import { seedPolicyMentions, seedPolicyShifts } from "./seed-policy";
import { sentimentToScore } from "./sentiment";
import type {
  BrandVoice,
  IntelligenceSnapshot,
  Mention,
  NamedCount,
  SnapshotMeta,
  TopicFilter,
  VolumePoint,
} from "./types";

function named(key: string, label: string, value: number, total: number, delta?: number): NamedCount {
  return { key, label, value, share: total === 0 ? 0 : value / total, delta };
}

export function filterMentions(mentions: Mention[], topic: TopicFilter): Mention[] {
  if (topic === "all") return mentions;
  return mentions.filter((m) => m.topic === topic);
}

export function buildBrands(mentions: Mention[]): BrandVoice[] {
  const total = mentions.length || 1;
  return BRANDS.map((b) => {
    const rows = mentions.filter((m) => m.brands.includes(b.id));
    const mentionsN = rows.length;
    const sentiment =
      mentionsN === 0 ? 0 : rows.reduce((s, m) => s + sentimentToScore(m), 0) / mentionsN;
    const reach = rows.reduce((s, m) => s + m.reach, 0);
    const delta = mentionsN === 0 ? 0 : Math.round((mentionsN / total) * 100 - 8);
    return {
      id: b.id,
      name: b.name,
      topic: b.topic,
      mentions: mentionsN,
      share: mentionsN / total,
      sentiment,
      reach,
      delta,
    };
  })
    .filter((b) => b.mentions > 0)
    .sort((a, b) => b.mentions - a.mentions);
}

function groupCount(
  mentions: Mention[],
  keyFn: (m: Mention) => string,
  labelFn: (key: string) => string,
): NamedCount[] {
  const map = new Map<string, number>();
  for (const m of mentions) map.set(keyFn(m), (map.get(keyFn(m)) ?? 0) + 1);
  const total = mentions.length || 1;
  return [...map.entries()]
    .map(([key, value]) => named(key, labelFn(key), value, total))
    .sort((a, b) => b.value - a.value);
}

export function overlayTodayVolume(volume: VolumePoint[], live: Mention[]): VolumePoint[] {
  if (volume.length === 0) return volume;
  const today = volume[volume.length - 1];
  const todayMentions = live.filter((m) => m.publishedAt.slice(0, 10) === today.date);
  if (todayMentions.length < 4) return volume;
  const ai = todayMentions.filter((m) => m.topic === "ai").length;
  const quantum = todayMentions.filter((m) => m.topic === "quantum").length;
  const policy = todayMentions.filter((m) => m.topic === "policy").length;
  const scale = Math.max(
    1,
    Math.round((today.ai + today.quantum + today.policy) / Math.max(1, todayMentions.length)),
  );
  const pos = todayMentions.filter((m) => m.sentiment === "positive").length * scale;
  const neg = todayMentions.filter((m) => m.sentiment === "negative").length * scale;
  const neu = Math.max(0, (ai + quantum + policy) * scale - pos - neg);
  const next = volume.slice();
  next[next.length - 1] = {
    ...today,
    ai: Math.max(today.ai, ai * scale),
    quantum: Math.max(today.quantum, quantum * scale),
    policy: Math.max(today.policy, policy * scale),
    positive: pos,
    negative: neg,
    neutral: neu,
  };
  return next;
}

export function assembleSnapshot(live: Mention[], meta: Partial<SnapshotMeta> = {}): IntelligenceSnapshot {
  const seeded = [...seedMentions(), ...seedPolicyMentions()];
  const urls = new Set(live.map((m) => m.url));
  const titles = new Set(live.map((m) => m.title.toLowerCase()));
  const merged = [
    ...live,
    ...seeded.filter((s) => !urls.has(s.url) && !titles.has(s.title.toLowerCase())),
  ].sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));

  const volume = overlayTodayVolume(seedVolume(), merged);
  const last = volume[volume.length - 1];
  const prev = volume[volume.length - 2];
  const mentions24h = last.ai + last.quantum + last.policy;
  const prevMentions = prev.ai + prev.quantum + prev.policy;
  const reach24h = merged.slice(0, 40).reduce((s, m) => s + m.reach, 0);
  const sentimentNow =
    mentions24h === 0 ? 0 : (last.positive - last.negative) / Math.max(1, mentions24h);
  const sentimentPrev =
    prevMentions === 0 ? 0 : (prev.positive - prev.negative) / Math.max(1, prevMentions);
  const vis = seedVisibility();
  const visAvg = vis.reduce((s, v) => s + v.overall, 0) / vis.length;

  const brands = buildBrands(merged);
  const regions = groupCount(merged, (m) => m.region, (k) => regionLabel(k as never));
  const languages = groupCount(merged, (m) => m.language, (k) => languageLabel(k as never));
  const channels = CHANNELS.map((c) => {
    const value = merged.filter((m) => m.channel === c.code).length;
    return named(c.code, c.label, value, merged.length);
  }).sort((a, b) => b.value - a.value);
  const outlets = groupCount(
    merged.filter((m) => m.channel === "news"),
    (m) => m.source,
    (k) => k,
  ).slice(0, 10);

  const shifts = [...seedPolicyShifts(), ...seedShifts()];

  return {
    meta: {
      generatedAt: new Date().toISOString(),
      liveNews: live.filter((m) => m.channel === "news").length,
      liveSocial: live.filter((m) => m.channel !== "news").length,
      sources: meta.sources ?? [
        "Google News",
        "Reddit",
        "X sample",
        "TikTok clusters",
        "Instagram clusters",
        "Policy wires",
        "Market tape",
      ],
      aiAvailable: meta.aiAvailable ?? false,
    },
    mentions: merged,
    volume,
    regions,
    languages,
    channels,
    outlets,
    brands,
    shifts,
    clusters: seedClusters(),
    visibility: vis,
    kpis: {
      mentions24h,
      mentionsDelta: prevMentions === 0 ? 0 : ((mentions24h - prevMentions) / prevMentions) * 100,
      reach24h,
      reachDelta: 12.4,
      sentiment: sentimentNow,
      sentimentDelta: (sentimentNow - sentimentPrev) * 100,
      shareAi: mentions24h === 0 ? 0 : last.ai / mentions24h,
      shareQuantum: mentions24h === 0 ? 0 : last.quantum / mentions24h,
      sharePolicy: mentions24h === 0 ? 0 : last.policy / mentions24h,
      visibilityIndex: visAvg,
      visibilityDelta: vis.reduce((s, v) => s + v.delta, 0) / vis.length,
      spikeCount: shifts.filter((s) => s.magnitude >= 2).length,
    },
  };
}
