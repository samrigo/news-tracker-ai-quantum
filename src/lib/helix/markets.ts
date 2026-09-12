import { WATCHLIST } from "./catalog";
import { hashString, mulberry32 } from "./sentiment";
import type {
  CalendarEvent,
  MacroRegime,
  MarketsSnapshot,
  Mention,
  Quote,
  QuoteSleeve,
  TradeIdea,
} from "./types";

const AS_OF = "2026-09-11T20:00:00.000Z";

type SeedQuote = {
  ticker: string;
  last: number;
  changePct: number;
  volume: number;
  marketCap?: number;
  high: number;
  low: number;
};

const SEED_QUOTES: SeedQuote[] = [
  { ticker: "NVDA", last: 218.29, changePct: -0.03, volume: 88_760_000, marketCap: 5.26e12, high: 222, low: 218.15 },
  { ticker: "MSFT", last: 428.4, changePct: 0.42, volume: 22_400_000, marketCap: 3.19e12, high: 431.2, low: 425.1 },
  { ticker: "GOOGL", last: 338.5, changePct: 1.8, volume: 31_200_000, marketCap: 4.04e12, high: 340.8, low: 332.4 },
  { ticker: "AMZN", last: 231.7, changePct: 0.65, volume: 38_900_000, marketCap: 2.44e12, high: 233.1, low: 228.9 },
  { ticker: "META", last: 612.2, changePct: -0.38, volume: 14_100_000, marketCap: 1.55e12, high: 619.4, low: 608.0 },
  { ticker: "AVGO", last: 352.8, changePct: 1.12, volume: 19_600_000, marketCap: 1.66e12, high: 356.0, low: 347.2 },
  { ticker: "TSM", last: 278.4, changePct: 0.88, volume: 12_800_000, marketCap: 1.44e12, high: 281.0, low: 274.5 },
  { ticker: "AMD", last: 164.9, changePct: -1.05, volume: 41_300_000, marketCap: 2.67e11, high: 168.4, low: 163.2 },
  { ticker: "SMH", last: 312.6, changePct: 0.54, volume: 7_200_000, high: 314.8, low: 309.1 },
  { ticker: "PLTR", last: 167.23, changePct: 0.8, volume: 28_400_000, marketCap: 4.074e11, high: 169.4, low: 164.8 },
  { ticker: "IBM", last: 289.1, changePct: 1.54, volume: 5_100_000, marketCap: 2.67e11, high: 291.6, low: 284.2 },
  { ticker: "IONQ", last: 36.75, changePct: -0.24, volume: 17_700_000, marketCap: 1.55e10, high: 38.34, low: 36.79 },
  { ticker: "RGTI", last: 15.27, changePct: 0.73, volume: 22_900_000, marketCap: 5.1e9, high: 15.62, low: 14.88 },
  { ticker: "QBTS", last: 16.8, changePct: 0.84, volume: 18_600_000, marketCap: 6.25e9, high: 17.12, low: 16.41 },
  { ticker: "QUBT", last: 7.99, changePct: 2.2, volume: 9_400_000, marketCap: 1.81e9, high: 8.21, low: 7.62 },
  { ticker: "HON", last: 214.6, changePct: -0.18, volume: 3_200_000, marketCap: 1.39e11, high: 216.4, low: 213.1 },
  { ticker: "QQQ", last: 598.2, changePct: 0.21, volume: 34_000_000, high: 601.4, low: 594.8 },
  { ticker: "SPY", last: 662.4, changePct: 0.14, volume: 51_000_000, high: 664.9, low: 659.2 },
];

function spark(last: number, changePct: number, seed: string): number[] {
  const rng = mulberry32(hashString(seed));
  const n = 30;
  const pts: number[] = [];
  let v = last / (1 + changePct / 100) / (1 + (rng() - 0.45) * 0.08);
  for (let i = 0; i < n; i += 1) {
    const drift = changePct / 100 / n;
    v = v * (1 + drift + (rng() - 0.48) * 0.025);
    pts.push(Number(v.toFixed(2)));
  }
  pts[n - 1] = last;
  return pts;
}

export function seedQuotes(): Quote[] {
  return SEED_QUOTES.map((q) => {
    const meta = WATCHLIST.find((w) => w.ticker === q.ticker)!;
    const prev = q.last / (1 + q.changePct / 100);
    const change = q.last - prev;
    return {
      ticker: q.ticker,
      name: meta.name,
      sleeve: meta.sleeve,
      last: q.last,
      change,
      changePct: q.changePct,
      open: Number((prev * (1 + (hashString(q.ticker) % 7) / 1000)).toFixed(2)),
      high: q.high,
      low: q.low,
      prevClose: Number(prev.toFixed(2)),
      volume: q.volume,
      marketCap: q.marketCap,
      spark: spark(q.last, q.changePct, q.ticker),
      asOf: AS_OF,
      live: false,
    };
  });
}

export const seedRegime: MacroRegime = {
  quad: 2,
  label: "Quad 2 — reflation with an industrial-policy overlay",
  growth: "accelerating",
  inflation: "accelerating",
  policy: "industrial",
  summary:
    "Growth impulse is still AI capex (clusters, networking, power). Inflation impulse is electricity, foundry tightness and fiscal industrial policy — not a classic CPI spike. Washington is a buyer of quantum equity and a regulator of frontier models at the same time. That is Quad 2 with a CHIPS kicker: own the picks-and-shovels, fade unprofitable quantum retail until the policy bid shows up in the tape.",
  overweight: ["NVIDIA / Broadcom / TSMC", "IBM Quantum franchise", "CHIPS-backed quantum (RGTI, QBTS)", "PQC vendors on the 2030 FAR clock"],
  underweight: ["Unprofitable quantum retail (IONQ tape)", "Labs without a federal or EU compliance story", "High-multiple AI software that does not own distribution"],
  asOf: AS_OF,
};

export function seedIdeas(): TradeIdea[] {
  return [
    {
      id: "nvda-trend",
      ticker: "NVDA",
      name: "NVIDIA",
      sleeve: "ai",
      bias: "long",
      duration: "TREND",
      conviction: 4,
      entry: 218.3,
      stop: 208.0,
      target: 236.5,
      riskLow: 217.2,
      riskHigh: 222.0,
      thesis:
        "Immediate-term range is the 10–11 Sep tight band. TREND remains higher from the 26 Aug 209 low. Hugging Face at $12.9B plus $105B of OpenAI compute rent keeps the circular-financing bull case intact. Do not chase through 222 without a close; buy dips that hold 217.",
      catalyst: "Hyperscaler capex prints; any Astra/agent-safety headline that knocks the complex 2–3%.",
      invalidation: "Daily close below 208 (26 Aug low) — TREND break, flatten.",
      updatedAt: AS_OF,
    },
    {
      id: "ionq-trade",
      ticker: "IONQ",
      name: "IonQ",
      sleeve: "quantum",
      bias: "short",
      duration: "TRADE",
      conviction: 3,
      entry: 36.75,
      stop: 40.4,
      target: 32.5,
      riskLow: 36.79,
      riskHigh: 40.34,
      thesis:
        "The Bitcoin-resource paper pulled retail in; the tape has since done −14% in a month and −35% in a quarter. This is a TRADE fade of the hangover, not a TAIL short on trapped-ion. Respect 40.34 (8 Sep spike high) as the stop. Policy bid (federal stakes) is the squeeze risk.",
      catalyst: "Any ‘quantum breaks Bitcoin’ recap; Japanese retail $IONQ flows.",
      invalidation: "Hold above 40.34 on a closing basis — cover.",
      updatedAt: AS_OF,
    },
    {
      id: "rgti-trend",
      ticker: "RGTI",
      name: "Rigetti",
      sleeve: "quantum",
      bias: "long",
      duration: "TREND",
      conviction: 3,
      entry: 15.27,
      stop: 13.4,
      target: 19.8,
      riskLow: 14.88,
      riskHigh: 15.62,
      thesis:
        "CHIPS Act $100M against federal equity is a balance-sheet and signalling event. Google declining the same check is the quality filter — Rigetti took the money. TREND long against the policy bid; TRADE range is tight, so size small.",
      catalyst: "Follow-on CHIPS closings; DOE QC-ADDS vendor shortlist.",
      invalidation: "Close below 13.40 — policy bid failed to hold the tape.",
      updatedAt: AS_OF,
    },
    {
      id: "qbts-trend",
      ticker: "QBTS",
      name: "D-Wave",
      sleeve: "quantum",
      bias: "long",
      duration: "TREND",
      conviction: 3,
      entry: 16.8,
      stop: 14.9,
      target: 21.0,
      riskLow: 16.41,
      riskHigh: 17.12,
      thesis:
        "Same CHIPS structure as Rigetti. Annealing is not the FTQC story, but Washington is not buying architectures — it is buying domestic capacity. Pair with RGTI rather than concentrating.",
      catalyst: "Commerce fact sheet; any DOE user-facility mention.",
      invalidation: "Close below 14.90.",
      updatedAt: AS_OF,
    },
    {
      id: "smh-trend",
      ticker: "SMH",
      name: "VanEck Semiconductor",
      sleeve: "semis",
      bias: "long",
      duration: "TREND",
      conviction: 4,
      entry: 312.6,
      stop: 298.0,
      target: 338.0,
      riskLow: 309.1,
      riskHigh: 314.8,
      thesis:
        "The cleanest way to own Quad 2 AI capex without single-name model-risk. NVDA + AVGO + TSM is the guts of the ETF. Prefer this to stacking correlated chip longs.",
      catalyst: "TSMC and Broadcom prints; Taiwan FX/politics.",
      invalidation: "Weekly close below 298.",
      updatedAt: AS_OF,
    },
    {
      id: "ibm-tail",
      ticker: "IBM",
      name: "IBM",
      sleeve: "quantum",
      bias: "long",
      duration: "TAIL",
      conviction: 3,
      entry: 289.1,
      stop: 268.0,
      target: 340.0,
      riskLow: 284.2,
      riskHigh: 291.6,
      thesis:
        "Starling 2029, System Two installs (India, Switzerland) and Qiskit give assistants a concrete story — and give the stock a quantum duration that pure-plays do not have. TAIL long, not a TRADE. Size as a compounder, not a qubit lottery ticket.",
      catalyst: "Amaravati commissioning; any Starling milestone.",
      invalidation: "Break of the 2026 range low near 268 on a weekly close.",
      updatedAt: AS_OF,
    },
    {
      id: "avgo-trend",
      ticker: "AVGO",
      name: "Broadcom",
      sleeve: "semis",
      bias: "long",
      duration: "TREND",
      conviction: 4,
      entry: 352.8,
      stop: 328.0,
      target: 390.0,
      riskLow: 347.2,
      riskHigh: 356.0,
      thesis:
        "Custom XPUs and networking catch the same capex wave as NVDA with less ‘who owns the model’ narrative risk. TREND long on dips into 347.",
      catalyst: "Hyperscaler custom-silicon commentary.",
      invalidation: "Close below 328.",
      updatedAt: AS_OF,
    },
    {
      id: "qubt-trade",
      ticker: "QUBT",
      name: "Quantum Computing Inc",
      sleeve: "quantum",
      bias: "short",
      duration: "TRADE",
      conviction: 2,
      entry: 7.99,
      stop: 8.9,
      target: 6.2,
      riskLow: 7.62,
      riskHigh: 8.21,
      thesis:
        "Thin, policy-insensitive, and up 2% on a day the serious names were quiet. TRADE fade only. Conviction 2 — this is a liquidity short, not a thesis short.",
      catalyst: "Retail quantum baskets; any promotion cycle.",
      invalidation: "Close above 8.90.",
      updatedAt: AS_OF,
    },
  ];
}

export function seedCalendar(): CalendarEvent[] {
  return [
    {
      id: "c1",
      date: "2026-09-15",
      label: "Senate AI incident hearing (scheduled)",
      kind: "policy",
      detail: "Hugging Face agent breakout + OpenAI’s ask for a federal floor.",
    },
    {
      id: "c2",
      date: "2026-09-18",
      label: "EU AI Office RFI response window",
      kind: "policy",
      detail: "30+ labs answering safety and copyright information requests.",
    },
    {
      id: "c3",
      date: "2026-09-22",
      label: "NQIAC membership recommendation clock",
      kind: "policy",
      detail: "EO 14413 210-day reconstitution path — watch the names.",
    },
    {
      id: "c4",
      date: "2026-09-24",
      label: "NVIDIA / Broadcom follow-through week",
      kind: "earnings",
      detail: "Tape still digesting the 27 Aug NVDA +8.7% squeeze and the Sep fade.",
    },
    {
      id: "c5",
      date: "2026-10-01",
      label: "Federal fiscal-year quantum spend",
      kind: "macro",
      detail: "QC-ADDS and CHIPS quantum line items into FY27.",
    },
  ];
}

function hoursAgo(h: number) {
  const now = new Date();
  const hour = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
  );
  return new Date(hour - h * 3600_000).toISOString();
}

export function seedMarketHeadlines(): Mention[] {
  const rows: Array<Omit<Mention, "id" | "reach" | "engagement" | "sentiment" | "brands"> & { brands?: string[] }> = [
    {
      title: "NVDA settles 218.29 after a four-session fade from 230",
      excerpt:
        "The 27 Aug squeeze to 228 is now a lower-high. Volume on Friday was 89M, below the 28 Aug panic day. Tape looks like digestion, not distribution — unless 217 fails.",
      url: "https://www.marketbeat.com/stocks/NASDAQ/NVDA/chart/",
      source: "Market tape",
      channel: "news",
      topic: "ai",
      region: "NA",
      language: "en",
      publishedAt: hoursAgo(4),
      brands: ["nvidia"],
    },
    {
      title: "IONQ −14% in a month as the Bitcoin paper leaves the tape",
      excerpt:
        "Last 36.75. 8 Sep’s 44.43 spike high is the level that matters. Retail is still in the comments; the stock is not.",
      url: "https://www.marketbeat.com/stocks/NYSE/IONQ/chart/",
      source: "Market tape",
      channel: "news",
      topic: "quantum",
      region: "NA",
      language: "en",
      publishedAt: hoursAgo(5),
      brands: ["ionq"],
    },
    {
      title: "RGTI and QBTS bid on the CHIPS close; Google Quantum is the control",
      excerpt:
        "Two listed names took the $100M / equity structure. Alphabet did not. That split is the research tell: policy bid ≠ every quantum ticker.",
      url: "https://www.barrons.com/articles/rigetti-stock-price-dwave-quantum-chips-act-government-stakes-705998f8",
      source: "Barron's",
      channel: "news",
      topic: "quantum",
      region: "NA",
      language: "en",
      publishedAt: hoursAgo(8),
      brands: ["rigetti"],
    },
    {
      title: "GOOGL +1.8% to 338.50 — Willow still in the multiple, Flash is not",
      excerpt:
        "Alphabet is pricing Search + Cloud + a quantum option. Gemini 3.8 Flash is a product footnote in the tape this week.",
      url: "https://www.bloomberg.com/",
      source: "Bloomberg",
      channel: "news",
      topic: "ai",
      region: "NA",
      language: "en",
      publishedAt: hoursAgo(7),
      brands: ["google", "googleq"],
    },
    {
      title: "SMH holds 312 as the AI-capex basket shrugs off NVDA’s drift",
      excerpt:
        "Equal-ish Broadcom/TSMC ballast is doing the work. The ETF is the cleaner TREND expression than stacking correlated chip longs.",
      url: "https://www.bloomberg.com/",
      source: "Bloomberg",
      channel: "news",
      topic: "ai",
      region: "NA",
      language: "en",
      publishedAt: hoursAgo(6),
      brands: ["nvidia"],
    },
    {
      title: "IBM +1.5% as on-soil System Two installs become a geography story",
      excerpt:
        "Amaravati and Switzerland are not qubit-count news. They are duration news. The stock is treating quantum as a franchise, not a lottery.",
      url: "https://research.ibm.com/quantum-computing",
      source: "IBM / tape",
      channel: "news",
      topic: "quantum",
      region: "GLOBAL",
      language: "en",
      publishedAt: hoursAgo(9),
      brands: ["ibmq"],
    },
  ];
  return rows.map((r) => {
    const id = hashString(r.url + r.title).toString(36);
    return {
      ...r,
      id: `mkt-${id}`,
      sentiment: r.excerpt.toLowerCase().includes("fade") || r.excerpt.includes("−") ? "mixed" : "neutral",
      brands: r.brands ?? [],
      reach: 400_000,
      engagement: 8_000,
    };
  });
}

export function assembleMarkets(liveQuotes?: Quote[], liveHeadlines?: Mention[]): MarketsSnapshot {
  const seeded = seedQuotes();
  const quotes =
    liveQuotes && liveQuotes.length
      ? seeded.map((s) => liveQuotes.find((q) => q.ticker === s.ticker) ?? s)
      : seeded;
  const headlines = [
    ...(liveHeadlines ?? []),
    ...seedMarketHeadlines().filter(
      (s) => !(liveHeadlines ?? []).some((h) => h.title.toLowerCase() === s.title.toLowerCase()),
    ),
  ].sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));

  return {
    generatedAt: new Date().toISOString(),
    live: Boolean(liveQuotes?.some((q) => q.live)),
    source: liveQuotes?.some((q) => q.live) ? "Exchange last / Yahoo" : "Desk snapshot (11 Sep close)",
    quotes,
    ideas: seedIdeas().map((idea) => {
      const q = quotes.find((x) => x.ticker === idea.ticker);
      if (!q) return idea;
      return {
        ...idea,
        entry: q.last,
        riskLow: Math.min(idea.riskLow, q.low),
        riskHigh: Math.max(idea.riskHigh, q.high),
      };
    }),
    regime: seedRegime,
    calendar: seedCalendar(),
    headlines,
  };
}

export function sleeveLabel(sleeve: QuoteSleeve): string {
  if (sleeve === "ai") return "AI";
  if (sleeve === "quantum") return "Quantum";
  if (sleeve === "semis") return "Semis";
  return "Index";
}
