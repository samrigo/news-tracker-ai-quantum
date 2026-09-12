import { BRANDS } from "./catalog";
import type { LanguageCode, Mention, RegionCode, Sentiment, Topic } from "./types";

const POSITIVE = [
  "breakthrough",
  "beats",
  "lead",
  "leads",
  "wins",
  "surge",
  "record",
  "advantage",
  "milestone",
  "outperform",
  "partnership",
  "invest",
  "launch",
  "unveils",
  "arrives",
  "fault-tolerant",
  "below-threshold",
  "faster",
  "open",
  "agrees",
  "acquire",
];

const NEGATIVE = [
  "hack",
  "attack",
  "breach",
  "risk",
  "threat",
  "lawsuit",
  "sues",
  "weapon",
  "bioweapon",
  "slowdown",
  "fatigue",
  "escape",
  "rogue",
  "undisclosed",
  "fail",
  "warning",
  "break bitcoin",
  "extinction",
  "concern",
  "uneasy",
  "immature",
  "fine",
  "probe",
  "crackdown",
];

export function scoreSentiment(text: string): { label: Sentiment; score: number } {
  const t = text.toLowerCase();
  let pos = 0;
  let neg = 0;
  for (const w of POSITIVE) if (t.includes(w)) pos += 1;
  for (const w of NEGATIVE) if (t.includes(w)) neg += 1;
  if (pos > 0 && neg > 0) return { label: "mixed", score: (pos - neg) / (pos + neg) };
  if (pos > neg) return { label: "positive", score: Math.min(1, 0.25 + pos * 0.2) };
  if (neg > pos) return { label: "negative", score: -Math.min(1, 0.25 + neg * 0.2) };
  return { label: "neutral", score: 0 };
}

export function detectTopic(text: string): Topic {
  const t = text.toLowerCase();
  const pHits = (
    t.match(
      /regulat|congress|senate|white house|executive order|ai act|export control|antitrust|chips act|sb 53|gpai|commerce department|nist|watermark|licensing|compliance|cfius|bis |national security|doj |ftc |brussels|european commission|ai office|enisa|carolina principles|post-quantum|pqc mandate|industrial policy|equity stake|lawmaker|capitol|parliament/g,
    ) ?? []
  ).length;
  const qHits = (
    t.match(
      /quantum|qubit|ionq|qiskit|willow chip|trapped-ion|superconducting|fault-tolerant|quantinuum|rigetti|quera|psiquantum|xanadu|post-quantum|pqc|d-wave|qbts|rgti/g,
    ) ?? []
  ).length;
  const aHits = (
    t.match(
      /openai|chatgpt|gpt-|anthropic|claude|gemini|nvidia|llm|generative ai|artificial intelligence|hugging face|grok|xai|model/g,
    ) ?? []
  ).length;
  if (pHits >= 2 || (pHits > 0 && pHits >= Math.max(aHits, qHits))) return "policy";
  if (qHits > aHits) return "quantum";
  if (aHits > 0) return "ai";
  if (qHits > 0) return "quantum";
  return "ai";
}

export function detectBrands(text: string): string[] {
  const t = text.toLowerCase();
  const hits = BRANDS.filter((b) => b.aliases.some((a) => t.includes(a))).map((b) => b.id);
  return [...new Set(hits)];
}

export function detectRegion(text: string, hint?: RegionCode): RegionCode {
  if (hint && hint !== "GLOBAL") return hint;
  const t = text.toLowerCase();
  if (/\b(india|amaravati|andhra|bengaluru|hyderabad)\b/.test(t)) return "IN";
  if (/\b(japan|tokyo|japanese)\b/.test(t)) return "JP";
  if (/\b(china|beijing|shanghai|shenzhen|alibaba)\b/.test(t)) return "CN";
  if (/\b(uk|britain|london|oxford|cambridge)\b/.test(t)) return "UK";
  if (/\b(frascati|esa|germany|france|sweden|chalmers|switzerland|europe|eu |brussels)\b/.test(t))
    return "EU";
  if (/\b(brazil|mexico|argentina|latam|são paulo)\b/.test(t)) return "LATAM";
  if (/\b(uae|abu dhabi|saudi|israel|africa|mena)\b/.test(t)) return "MENA";
  if (/\b(korea|singapore|australia|taiwan|apac)\b/.test(t)) return "APAC";
  if (/\b(united states|u\.s\.|usa|silicon valley|washington|congress|white house|california)\b/.test(t))
    return "NA";
  return hint ?? "GLOBAL";
}

export function detectLanguage(text: string, hint?: LanguageCode): LanguageCode {
  if (hint && hint !== "other") return hint;
  if (/[\u3040-\u30ff\u31f0-\u31ff]/.test(text)) return "ja";
  if (/[\u4e00-\u9fff]/.test(text)) return "zh";
  if (/[\uac00-\ud7af]/.test(text)) return "ko";
  if (/[\u0900-\u097f]/.test(text)) return "hi";
  if (/[áéíóúñ¿¡]/i.test(text) && /\b(el|la|los|las|una|qué)\b/i.test(text)) return "es";
  if (/[àâçéèêëîïôùû]/i.test(text) && /\b(le|la|les|une|des)\b/i.test(text)) return "fr";
  if (/[äöüß]/i.test(text)) return "de";
  if (/[ãõáéíóúç]/i.test(text) && /\b(não|uma|os|as)\b/i.test(text)) return "pt";
  return hint ?? "en";
}

export function sentimentToScore(m: Mention): number {
  if (m.sentiment === "positive") return 1;
  if (m.sentiment === "negative") return -1;
  if (m.sentiment === "mixed") return 0.15;
  return 0;
}

export function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
