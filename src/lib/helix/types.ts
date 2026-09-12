export type Topic = "ai" | "quantum" | "policy";
export type TopicFilter = "all" | Topic;
export type Channel = "news" | "x" | "tiktok" | "instagram" | "reddit";
export type Sentiment = "positive" | "neutral" | "negative" | "mixed";
export type RangeKey = "24h" | "7d" | "30d";

export type RegionCode =
  | "NA"
  | "LATAM"
  | "UK"
  | "EU"
  | "MENA"
  | "IN"
  | "JP"
  | "CN"
  | "APAC"
  | "GLOBAL";

export type LanguageCode =
  | "en"
  | "es"
  | "fr"
  | "de"
  | "pt"
  | "ja"
  | "zh"
  | "ko"
  | "hi"
  | "other";

export interface Mention {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  source: string;
  channel: Channel;
  topic: Topic;
  sentiment: Sentiment;
  region: RegionCode;
  language: LanguageCode;
  publishedAt: string;
  reach: number;
  engagement: number;
  brands: string[];
  author?: string;
  handle?: string;
}

export interface VolumePoint {
  date: string;
  ai: number;
  quantum: number;
  policy: number;
  positive: number;
  negative: number;
  neutral: number;
}

export interface NamedCount {
  key: string;
  label: string;
  value: number;
  share: number;
  delta?: number;
}

export interface BrandVoice {
  id: string;
  name: string;
  topic: Topic;
  mentions: number;
  share: number;
  sentiment: number;
  reach: number;
  delta: number;
}

export interface NarrativeShift {
  id: string;
  topic: Topic;
  headline: string;
  detail: string;
  direction: "up" | "down" | "shift";
  magnitude: number;
  window: string;
}

export interface SocialCluster {
  id: string;
  channel: Channel;
  topic: Topic;
  theme: string;
  summary: string;
  hashtags: string[];
  views: number;
  posts: number;
  sentiment: Sentiment;
  regions: RegionCode[];
}

export interface AiModelScore {
  model: string;
  provider: string;
  mentionRate: number;
  citationQuality: number;
  sentiment: number;
  recency: "live" | "estimated";
}

export interface BrandAiVisibility {
  brandId: string;
  brand: string;
  topic: Topic;
  overall: number;
  delta: number;
  narrative: string;
  models: AiModelScore[];
  citedSources: string[];
}

export interface DailyBrief {
  generatedAt: string;
  headline: string;
  lede: string;
  bullets: { title: string; body: string; topic: Topic }[];
  risks: string[];
  opportunities: string[];
  watchNext: string[];
}

export interface SnapshotMeta {
  generatedAt: string;
  liveNews: number;
  liveSocial: number;
  sources: string[];
  aiAvailable: boolean;
}

export interface IntelligenceSnapshot {
  meta: SnapshotMeta;
  mentions: Mention[];
  volume: VolumePoint[];
  regions: NamedCount[];
  languages: NamedCount[];
  channels: NamedCount[];
  outlets: NamedCount[];
  brands: BrandVoice[];
  shifts: NarrativeShift[];
  clusters: SocialCluster[];
  visibility: BrandAiVisibility[];
  kpis: {
    mentions24h: number;
    mentionsDelta: number;
    reach24h: number;
    reachDelta: number;
    sentiment: number;
    sentimentDelta: number;
    shareAi: number;
    shareQuantum: number;
    sharePolicy: number;
    visibilityIndex: number;
    visibilityDelta: number;
    spikeCount: number;
  };
}

export type PolicyStatus = "in-force" | "enforcing" | "voluntary" | "proposed" | "deadline";

export interface PolicyTrackerItem {
  id: string;
  jurisdiction: string;
  region: RegionCode;
  title: string;
  status: PolicyStatus;
  date: string;
  summary: string;
  beat: "ai" | "quantum" | "trade" | "security" | "industrial";
  impact: "high" | "medium" | "low";
  watch: string;
}

export type QuoteSleeve = "ai" | "quantum" | "semis" | "index";
export type TradeDuration = "TRADE" | "TREND" | "TAIL";
export type TradeBias = "long" | "short";
export type Quad = 1 | 2 | 3 | 4;

export interface Quote {
  ticker: string;
  name: string;
  sleeve: QuoteSleeve;
  last: number;
  change: number;
  changePct: number;
  open: number;
  high: number;
  low: number;
  prevClose: number;
  volume: number;
  marketCap?: number;
  spark: number[];
  asOf: string;
  live: boolean;
}

export interface TradeIdea {
  id: string;
  ticker: string;
  name: string;
  sleeve: QuoteSleeve;
  bias: TradeBias;
  duration: TradeDuration;
  conviction: 1 | 2 | 3 | 4 | 5;
  entry: number;
  stop: number;
  target: number;
  riskLow: number;
  riskHigh: number;
  thesis: string;
  catalyst: string;
  invalidation: string;
  updatedAt: string;
}

export interface MacroRegime {
  quad: Quad;
  label: string;
  growth: "accelerating" | "decelerating";
  inflation: "accelerating" | "decelerating";
  policy: "tightening" | "easing" | "industrial";
  summary: string;
  overweight: string[];
  underweight: string[];
  asOf: string;
}

export interface CalendarEvent {
  id: string;
  date: string;
  label: string;
  kind: "policy" | "earnings" | "macro" | "product";
  detail: string;
}

export interface MarketsSnapshot {
  generatedAt: string;
  live: boolean;
  source: string;
  quotes: Quote[];
  ideas: TradeIdea[];
  regime: MacroRegime;
  calendar: CalendarEvent[];
  headlines: Mention[];
}
