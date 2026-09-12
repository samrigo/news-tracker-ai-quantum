import { detectBrands, detectLanguage, detectRegion, detectTopic, hashString, scoreSentiment } from "./sentiment";
import type { Channel, LanguageCode, Mention, RegionCode } from "./types";

const UA =
  "TidelineMediaIntelligence/1.0 (research dashboard; +https://grok.com)";

type FeedSpec = {
  url: string;
  channel: Channel;
  region?: RegionCode;
  language?: LanguageCode;
  sourceHint?: string;
};

const NEWS_FEEDS: FeedSpec[] = [
  {
    url: "https://news.google.com/rss/search?q=artificial+intelligence+OR+OpenAI+OR+Anthropic+OR+NVIDIA+when:2d&hl=en-US&gl=US&ceid=US:en",
    channel: "news",
    region: "NA",
    language: "en",
  },
  {
    url: "https://news.google.com/rss/search?q=quantum+computing+OR+IonQ+OR+IBM+Quantum+OR+Willow+when:7d&hl=en-US&gl=US&ceid=US:en",
    channel: "news",
    region: "NA",
    language: "en",
  },
  {
    url: "https://news.google.com/rss/search?q=%22AI+Act%22+OR+%22AI+regulation%22+OR+%22executive+order%22+AI+when:7d&hl=en-US&gl=US&ceid=US:en",
    channel: "news",
    region: "NA",
    language: "en",
  },
  {
    url: "https://news.google.com/rss/search?q=CHIPS+Act+quantum+OR+%22post-quantum%22+OR+Rigetti+Commerce+when:14d&hl=en-US&gl=US&ceid=US:en",
    channel: "news",
    region: "NA",
    language: "en",
  },
  {
    url: "https://news.google.com/rss/search?q=NVIDIA+stock+OR+IonQ+stock+OR+%22quantum+computing%22+shares+when:3d&hl=en-US&gl=US&ceid=US:en",
    channel: "news",
    region: "NA",
    language: "en",
  },
  {
    url: "https://feeds.finance.yahoo.com/rss/2.0/headline?s=NVDA,MSFT,GOOGL,IONQ,RGTI,QBTS,IBM,AVGO&region=US&lang=en-US",
    channel: "news",
    region: "NA",
    language: "en",
    sourceHint: "Yahoo Finance",
  },
  {
    url: "https://news.google.com/rss/search?q=inteligencia+artificial+OR+computaci%C3%B3n+cu%C3%A1ntica+when:3d&hl=es&gl=ES&ceid=ES:es",
    channel: "news",
    region: "EU",
    language: "es",
  },
  {
    url: "https://news.google.com/rss/search?q=intelligence+artificielle+OR+informatique+quantique+when:3d&hl=fr&gl=FR&ceid=FR:fr",
    channel: "news",
    region: "EU",
    language: "fr",
  },
  {
    url: "https://news.google.com/rss/search?q=k%C3%BCnstliche+Intelligenz+OR+Quantencomputing+when:3d&hl=de&gl=DE&ceid=DE:de",
    channel: "news",
    region: "EU",
    language: "de",
  },
  {
    url: "https://news.google.com/rss/search?q=%E4%BA%BA%E5%B7%A5%E7%9F%A5%E8%83%BD+OR+%E9%87%8F%E5%AD%90%E3%82%B3%E3%83%B3%E3%83%94%E3%83%A5%E3%83%BC%E3%82%BF+when:3d&hl=ja&gl=JP&ceid=JP:ja",
    channel: "news",
    region: "JP",
    language: "ja",
  },
];

function stripHtml(s: string): string {
  return s
    .replace(/<[^>]*>/g, " ")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/href\s*=\s*("([^"]*)"|'([^']*)')/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decode(xml: string): string {
  const entities: Record<string, string> = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    nbsp: " ",
  };
  return xml
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (_, name: string) => entities[name.toLowerCase()] ?? "")
    .trim();
}

function tag(block: string, name: string): string {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i"));
  return m ? decode(m[1]) : "";
}

function parseRss(xml: string, spec: FeedSpec): Mention[] {
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].slice(0, 18);
  const out: Mention[] = [];
  for (const match of items) {
    const block = match[1];
    const rawTitle = stripHtml(tag(block, "title"));
    if (!rawTitle) continue;
    const split = rawTitle.split(/\s+[-–—|]\s+/);
    const source = split.length > 1 ? split.pop()!.trim() : spec.sourceHint ?? "Google News";
    const title = split.join(" — ").trim() || rawTitle;
    const url =
      tag(block, "link") ||
      tag(block, "guid") ||
      `https://news.google.com/search?q=${encodeURIComponent(title)}`;
    let excerpt = stripHtml(tag(block, "description")).slice(0, 280);
    if (
      !excerpt ||
      excerpt === title ||
      excerpt.startsWith(title) ||
      /href=|_blank|font color|<\/?[a-z]/i.test(excerpt)
    ) {
      excerpt = "";
    }
    const pub = tag(block, "pubDate") || tag(block, "published");
    const publishedAt = pub ? new Date(pub).toISOString() : new Date().toISOString();
    if (Number.isNaN(+new Date(publishedAt))) continue;
    const text = `${title} ${excerpt}`;
    const topic = detectTopic(text);
    const { label } = scoreSentiment(text);
    const id = hashString(url + title).toString(36);
    out.push({
      id: `rss-${id}`,
      title,
      excerpt,
      url,
      source,
      channel: spec.channel,
      topic,
      sentiment: label,
      region: detectRegion(text, spec.region),
      language: detectLanguage(title, spec.language),
      publishedAt,
      reach: 80_000 + (hashString(id) % 1_200_000),
      engagement: 1_200 + (hashString(id + "e") % 40_000),
      brands: detectBrands(text),
    });
  }
  return out;
}

type RedditChild = {
  data: {
    id: string;
    title: string;
    selftext?: string;
    url: string;
    permalink: string;
    author: string;
    created_utc: number;
    subreddit: string;
    score: number;
    num_comments: number;
    over_18?: boolean;
  };
};

async function fetchText(url: string, timeoutMs = 7000): Promise<string | null> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { "User-Agent": UA, Accept: "application/rss+xml, application/json, text/xml, */*" },
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

async function fetchReddit(sub: string): Promise<Mention[]> {
  const body = await fetchText(`https://www.reddit.com/r/${sub}/hot.json?limit=12`, 7000);
  if (!body) return [];
  try {
    const json = JSON.parse(body) as { data?: { children?: RedditChild[] } };
    const children = json.data?.children ?? [];
    return children
      .map((c) => c.data)
      .filter((d) => d && !d.over_18 && d.title)
      .map((d) => {
        const excerpt = (d.selftext || "").replace(/\s+/g, " ").slice(0, 260);
        const text = `${d.title} ${excerpt}`;
        const topic = detectTopic(`${d.subreddit} ${text}`);
        const { label } = scoreSentiment(text);
        return {
          id: `reddit-${d.id}`,
          title: d.title,
          excerpt: excerpt || `Discussion on r/${d.subreddit}`,
          url: d.url?.startsWith("http") ? d.url : `https://www.reddit.com${d.permalink}`,
          source: `r/${d.subreddit}`,
          channel: "reddit" as const,
          topic,
          sentiment: label,
          region: "GLOBAL" as const,
          language: detectLanguage(d.title, "en"),
          publishedAt: new Date(d.created_utc * 1000).toISOString(),
          reach: Math.max(3_000, d.score * 180 + d.num_comments * 90),
          engagement: d.score + d.num_comments,
          brands: detectBrands(text),
          author: d.author ? `u/${d.author}` : undefined,
        } satisfies Mention;
      });
  } catch {
    return [];
  }
}

let cacheV4: { at: number; mentions: Mention[]; sources: string[] } | null = null;
const TTL = 8 * 60 * 1000;

export async function ingestLive(): Promise<{ mentions: Mention[]; sources: string[] }> {
  if (cacheV4 && Date.now() - cacheV4.at < TTL) return cacheV4;

  const sources: string[] = [];
  const mentions: Mention[] = [];

  const newsResults = await Promise.all(
    NEWS_FEEDS.map(async (spec) => {
      const xml = await fetchText(spec.url);
      if (!xml) return [] as Mention[];
      sources.push(spec.sourceHint ?? (spec.language ? `Google News (${spec.language})` : "Google News"));
      return parseRss(xml, spec);
    }),
  );
  for (const batch of newsResults) mentions.push(...batch);

  const reddit = await Promise.all([
    fetchReddit("MachineLearning"),
    fetchReddit("artificial"),
    fetchReddit("QuantumComputing"),
    fetchReddit("singularity"),
    fetchReddit("technology"),
  ]);
  if (reddit.some((b) => b.length)) sources.push("Reddit");
  for (const batch of reddit) mentions.push(...batch);

  const seen = new Set<string>();
  const deduped: Mention[] = [];
  for (const m of mentions) {
    const key = m.title.toLowerCase().slice(0, 80);
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(m);
  }

  cacheV4 = { at: Date.now(), mentions: deduped, sources: [...new Set(sources)] };
  return cacheV4;
}


