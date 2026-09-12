import type { BrandAiVisibility, DailyBrief, IntelligenceSnapshot, TopicFilter } from "./types";

const MODEL = "grok-4.5";

function apiKey(): string | null {
  return process.env.XAI_API_KEY ?? null;
}

export function isAiAvailable(): boolean {
  return Boolean(apiKey());
}

async function chatJson(system: string, user: string, maxTokens = 1400): Promise<string | null> {
  const key = apiKey();
  if (!key) return null;
  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.3,
      max_tokens: maxTokens,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });
  if (!res.ok) return null;
  const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return body.choices?.[0]?.message?.content ?? null;
}

async function chatText(system: string, user: string, maxTokens = 700): Promise<string | null> {
  const key = apiKey();
  if (!key) return null;
  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.4,
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });
  if (!res.ok) return null;
  const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return body.choices?.[0]?.message?.content ?? null;
}

function topHeadlines(snap: IntelligenceSnapshot, topic: TopicFilter, n = 18): string {
  return snap.mentions
    .filter((m) => topic === "all" || m.topic === topic)
    .slice(0, n)
    .map(
      (m) =>
        `- [${m.channel}/${m.language}/${m.region}] ${m.source}: ${m.title} (${m.sentiment}, ${m.publishedAt})`,
    )
    .join("\n");
}

export async function generateDailyBrief(
  snap: IntelligenceSnapshot,
  topic: TopicFilter,
): Promise<DailyBrief | { error: string }> {
  if (!isAiAvailable()) return { error: "AI is not available in this environment" };
  const system =
    "You are Tideline's executive briefing editor. Write tight, skeptical, source-aware copy for comms, strategy and markets leads tracking AI, quantum, and the regulation around both. Return JSON only.";
  const user = `Today is ${new Date().toISOString().slice(0, 10)}. Topic filter: ${topic}.
Headlines:
${topHeadlines(snap, topic)}

Narrative shifts:
${snap.shifts.map((s) => `- ${s.headline}: ${s.detail}`).join("\n")}

Return JSON:
{
  "headline": "max 16 words",
  "lede": "2 sentences",
  "bullets": [{"title": "", "body": "", "topic": "ai"|"quantum"|"policy"}],
  "risks": ["..."],
  "opportunities": ["..."],
  "watchNext": ["..."]
}
3-5 bullets, 2-3 risks, 2-3 opportunities, 3 watchNext items. No markdown.`;

  const raw = await chatJson(system, user, 1400);
  if (!raw) return { error: "The briefing model did not respond. Try again in a moment." };
  try {
    const parsed = JSON.parse(raw) as DailyBrief;
    return { ...parsed, generatedAt: new Date().toISOString() };
  } catch {
    return { error: "Could not parse the briefing. Try again." };
  }
}

export async function askHelix(
  snap: IntelligenceSnapshot,
  question: string,
): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  if (!isAiAvailable()) return { ok: false, error: "AI is not available in this environment" };
  const q = question.trim().slice(0, 500);
  if (!q) return { ok: false, error: "Ask a question about coverage, sentiment, or competitors." };
  const text = await chatText(
    "You are Helix, Tideline's media-intelligence analyst. Answer from the supplied coverage. Be specific, cite outlets and platforms, flag uncertainty. No emoji. 180 words max.",
    `Question: ${q}\n\nCoverage:\n${topHeadlines(snap, "all", 22)}\n\nShifts:\n${snap.shifts.map((s) => s.headline).join("; ")}`,
    600,
  );
  if (!text) return { ok: false, error: "Helix could not answer just now." };
  return { ok: true, text };
}

export async function scanVisibility(
  snap: IntelligenceSnapshot,
): Promise<BrandAiVisibility[] | { error: string }> {
  if (!isAiAvailable()) return { error: "AI is not available in this environment" };
  const brands = snap.visibility.map((v) => v.brand).join(", ");
  const raw = await chatJson(
    "You are measuring how AI assistants currently describe companies in AI and quantum computing. Return JSON only.",
    `For each brand in: ${brands}.
Using your own knowledge as Grok plus these headlines:
${topHeadlines(snap, "all", 16)}

Return JSON: { "brands": [{ "brand": "", "overall": 0-100, "delta": int, "narrative": "2 sentences", "citedSources": ["..."], "models": [{ "model": "Grok"|"ChatGPT"|"Gemini"|"Claude"|"Perplexity", "mentionRate": 0-100, "citationQuality": 0-100, "sentiment": -1 to 1 }] }] }
Be opinionated but fair. Grok scores are live; other models are your best estimate of typical answers.`,
    1600,
  );
  if (!raw) return { error: "Visibility scan failed. Try again." };
  try {
    const parsed = JSON.parse(raw) as {
      brands: {
        brand: string;
        overall: number;
        delta: number;
        narrative: string;
        citedSources: string[];
        models: { model: string; mentionRate: number; citationQuality: number; sentiment: number }[];
      }[];
    };
    return snap.visibility.map((row) => {
      const hit = parsed.brands.find((b) => b.brand.toLowerCase().includes(row.brand.split(" ")[0].toLowerCase()));
      if (!hit) return { ...row, models: row.models.map((m) => ({ ...m, recency: m.model === "Grok" ? "live" as const : m.recency })) };
      return {
        ...row,
        overall: hit.overall,
        delta: hit.delta,
        narrative: hit.narrative,
        citedSources: hit.citedSources?.length ? hit.citedSources : row.citedSources,
        models: row.models.map((m) => {
          const mm = hit.models?.find((x) => x.model === m.model);
          return {
            ...m,
            mentionRate: mm?.mentionRate ?? m.mentionRate,
            citationQuality: mm?.citationQuality ?? m.citationQuality,
            sentiment: mm?.sentiment ?? m.sentiment,
            recency: m.model === "Grok" ? "live" : "estimated",
          };
        }),
      };
    });
  } catch {
    return { error: "Could not parse the visibility scan." };
  }
}

export async function refreshSocialLive(): Promise<{ ok: true; notes: string } | { ok: false; error: string }> {
  const key = apiKey();
  if (!key) return { ok: false, error: "AI is not available in this environment" };
  const res = await fetch("https://api.x.ai/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: MODEL,
      input: [
        {
          role: "user",
          content:
            "Summarize the last 24 hours of conversation on X about (1) GPT-6 Astra / OpenAI / NVIDIA Hugging Face and (2) IonQ Bitcoin quantum / IBM Quantum / Willow. 180 words. Name notable posts and the mood. Then add 4 bullets on TikTok/Instagram-style themes if the web mentions them.",
        },
      ],
      tools: [{ type: "x_search" }, { type: "web_search" }],
      max_output_tokens: 700,
    }),
  });
  if (!res.ok) return { ok: false, error: `Live social refresh returned ${res.status}` };
  const body = (await res.json()) as {
    output_text?: string;
    output?: { type?: string; content?: { type?: string; text?: string }[] }[];
  };
  const text =
    body.output_text ||
    body.output
      ?.flatMap((o) => o.content ?? [])
      .map((c) => c.text ?? "")
      .join("\n")
      .trim();
  if (!text) return { ok: false, error: "No live social summary returned." };
  return { ok: true, notes: text };
}
