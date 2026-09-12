import { WATCHLIST } from "./catalog";
import { seedQuotes } from "./markets";
import type { Quote } from "./types";

const UA = "TidelineMarkets/1.0 (research dashboard; +https://grok.com)";

type YahooQuote = {
  symbol?: string;
  shortName?: string;
  regularMarketPrice?: number;
  regularMarketChange?: number;
  regularMarketChangePercent?: number;
  regularMarketOpen?: number;
  regularMarketDayHigh?: number;
  regularMarketDayLow?: number;
  regularMarketPreviousClose?: number;
  regularMarketVolume?: number;
  marketCap?: number;
};

function sparkFromSeed(ticker: string, last: number): number[] {
  const seed = seedQuotes().find((q) => q.ticker === ticker);
  if (!seed) return [last];
  const scaled = seed.spark.map((p) => Number(((p / seed.last) * last).toFixed(2)));
  scaled[scaled.length - 1] = last;
  return scaled;
}

export async function fetchLiveQuotes(): Promise<Quote[]> {
  const symbols = WATCHLIST.map((w) => w.ticker).join(",");
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 8000);
  try {
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols}`;
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { "User-Agent": UA, Accept: "application/json" },
    });
    if (!res.ok) return seedQuotes();
    const body = (await res.json()) as { quoteResponse?: { result?: YahooQuote[] } };
    const rows = body.quoteResponse?.result ?? [];
    if (!rows.length) return seedQuotes();
    const asOf = new Date().toISOString();
    return WATCHLIST.map((meta) => {
      const hit = rows.find((r) => r.symbol === meta.ticker);
      const fallback = seedQuotes().find((q) => q.ticker === meta.ticker)!;
      if (!hit?.regularMarketPrice) return fallback;
      const last = hit.regularMarketPrice;
      return {
        ticker: meta.ticker,
        name: meta.name,
        sleeve: meta.sleeve,
        last,
        change: hit.regularMarketChange ?? 0,
        changePct: hit.regularMarketChangePercent ?? 0,
        open: hit.regularMarketOpen ?? last,
        high: hit.regularMarketDayHigh ?? last,
        low: hit.regularMarketDayLow ?? last,
        prevClose: hit.regularMarketPreviousClose ?? last,
        volume: hit.regularMarketVolume ?? 0,
        marketCap: hit.marketCap,
        spark: sparkFromSeed(meta.ticker, last),
        asOf,
        live: true,
      } satisfies Quote;
    });
  } catch {
    return seedQuotes();
  } finally {
    clearTimeout(t);
  }
}
