import { detectBrands, hashString, scoreSentiment } from "./sentiment";
import type { Mention, NarrativeShift, PolicyTrackerItem } from "./types";

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

function mention(
  partial: Omit<Mention, "id" | "reach" | "engagement" | "brands" | "sentiment"> & {
    id?: string;
    brands?: string[];
  },
): Mention {
  const id = partial.id ?? hashString(partial.url + partial.title).toString(36);
  const text = `${partial.title} ${partial.excerpt}`;
  const { label } = scoreSentiment(text);
  const reach = 90_000 + (hashString(id) % 1_800_000);
  return {
    ...partial,
    id,
    sentiment: label,
    brands: partial.brands ?? detectBrands(text),
    reach,
    engagement: Math.round(reach * 0.012),
  };
}

export function seedPolicyMentions(): Mention[] {
  return [
    mention({
      title: "Trump brushes off AI doomsaying to guard the U.S. lead over China",
      excerpt:
        "The White House is treating frontier-model scare stories as a competitiveness problem. EO 14409 stays voluntary; officials worry a licensing regime would gift ground to Moonshot and peers.",
      url: "https://www.bloomberg.com/news/articles/2026-09-12/trump-brushes-off-ai-doomsaying-to-safeguard-us-lead-over-china",
      source: "Bloomberg",
      channel: "news",
      topic: "policy",
      region: "NA",
      language: "en",
      publishedAt: hoursAgo(5),
      brands: ["openai", "anthropic"],
    }),
    mention({
      title: "OpenAI reverses course and asks Congress for binding frontier rules",
      excerpt:
        "Chris Lehane said voluntary commitments are no longer enough after unsupervised agents hit Hugging Face. The lab wants capability-based tests, incident reporting, and a federal floor before December adjournment.",
      url: "https://techxplore.com/news/2026-09-shift-openai-powerful-ai.html",
      source: "Associated Press",
      channel: "news",
      topic: "policy",
      region: "NA",
      language: "en",
      publishedAt: hoursAgo(18),
      brands: ["openai"],
    }),
    mention({
      title: "EU AI Office is live: GPAI fines of €15M or 3% of turnover now enforceable",
      excerpt:
        "Commission powers dating from 2 August 2026 sit on top of the AI Act. Brussels has already sent information requests to more than 30 model providers on safety and copyright.",
      url: "https://www.politico.eu/article/eu-ai-artificial-intelligence-safety-us-china/",
      source: "POLITICO",
      channel: "news",
      topic: "policy",
      region: "EU",
      language: "en",
      publishedAt: hoursAgo(26),
      brands: ["openai", "anthropic", "google"],
    }),
    mention({
      title: "Commerce briefly export-controlled Anthropic’s Mythos and Fable",
      excerpt:
        "A June cease-and-desist under BIS powers, then a staged unwind by 30 June, showed how ‘voluntary’ pre-release review can become an on/off switch for global access.",
      url: "https://www.hsfkramer.com/insights/2026-07/license-to-model-emerging-us-rules-impact-global-access-to-frontier-ai",
      source: "Hogan Lovells / HSF Kramer",
      channel: "news",
      topic: "policy",
      region: "NA",
      language: "en",
      publishedAt: hoursAgo(40),
      brands: ["anthropic"],
    }),
    mention({
      title: "Rigetti, D-Wave and Quantinuum take $100M CHIPS Act checks — and give Washington equity",
      excerpt:
        "Commerce closed the May framework this week. Google Quantum AI declined the same terms, saying the conditions would slow engineering. Industrial policy is now a listed-stock event.",
      url: "https://www.barrons.com/articles/rigetti-stock-price-dwave-quantum-chips-act-government-stakes-705998f8",
      source: "Barron's",
      channel: "news",
      topic: "policy",
      region: "NA",
      language: "en",
      publishedAt: hoursAgo(8),
      brands: ["rigetti", "quantinuum", "googleq"],
    }),
    mention({
      title: "Quantum EO 14413: a DOE-scale machine by 2028, PQC on federal systems by 2030",
      excerpt:
        "QC-ADDS plus the companion cryptography order lock in a dual track — build a scientific quantum computer, and migrate FAR contractors off RSA/ECC on a hard calendar.",
      url: "https://www.whitehouse.gov/presidential-actions/2026/06/ushering-in-the-next-frontier-of-quantum-innovation/",
      source: "White House",
      channel: "news",
      topic: "policy",
      region: "NA",
      language: "en",
      publishedAt: hoursAgo(72),
      brands: ["ibmq", "ionq"],
    }),
    mention({
      title: "California SB 53 frontier-transparency duties have been in force since 1 January",
      excerpt:
        "Developers above 10²⁶ FLOPs must publish safety information. OpenAI’s September pivot now endorses several state bills it previously lobbied against — a tell for Congress.",
      url: "https://www.insidedeeptech.com/global-agi-regulations-2026-september-update/",
      source: "Inside Deep Tech",
      channel: "news",
      topic: "policy",
      region: "NA",
      language: "en",
      publishedAt: hoursAgo(30),
      brands: ["openai"],
    }),
    mention({
      title: "G20 split: Washington’s Carolina Principles vs Brussels’ AI Act",
      excerpt:
        "At Chapel Hill the U.S. argued against technology-specific rules. The same day the Commission confirmed safety and copyright RFIs. Transatlantic divergence is the coverage frame.",
      url: "https://www.aljazeera.com/news/2026/9/2/us-pushes-looser-approach-to-ai-regulation-while-eu-pushes-new-law",
      source: "Reuters / Al Jazeera",
      channel: "news",
      topic: "policy",
      region: "GLOBAL",
      language: "en",
      publishedAt: hoursAgo(54),
    }),
    mention({
      title: "ENISA granted access to Anthropic Mythos 5 three months after partner release",
      excerpt:
        "Europe’s cybersecurity agency is using AI Act evaluation rights in practice, not just on paper — a preview of how GPAI oversight will feel for labs.",
      url: "https://www.politico.eu/",
      source: "POLITICO Europe",
      channel: "news",
      topic: "policy",
      region: "EU",
      language: "en",
      publishedAt: hoursAgo(20),
      brands: ["anthropic"],
    }),
    mention({
      title: "EU watermarking rule is in force; Anthropic says future models will comply",
      excerpt:
        "Synthetic-content labelling under the AI Act is now a product requirement, not a principle. U.S. labs shipping into the single market have to treat it as a release gate.",
      url: "https://digital-strategy.ec.europa.eu/",
      source: "European Commission",
      channel: "news",
      topic: "policy",
      region: "EU",
      language: "en",
      publishedAt: hoursAgo(96),
      brands: ["anthropic"],
    }),
    mention({
      title: "Newsom signs 13 child-safety tech bills as states fill the federal gap",
      excerpt:
        "California keeps writing hard law while EO 14409 stays voluntary. The patchwork is now a lobbying map for every frontier lab’s public-policy shop.",
      url: "https://www.gov.ca.gov/",
      source: "California Governor",
      channel: "news",
      topic: "policy",
      region: "NA",
      language: "en",
      publishedAt: hoursAgo(22),
    }),
    mention({
      title: "U.S. takes more equity in quantum names as Xanadu partners ASML on lithography",
      excerpt:
        "Public capital plus a foundry story is pulling quantum out of physics press and onto the financial wire. Policy is the multiple; the tape is still unforgiving.",
      url: "https://thefly.com/",
      source: "The Fly",
      channel: "news",
      topic: "policy",
      region: "NA",
      language: "en",
      publishedAt: hoursAgo(6),
      brands: ["xanadu", "ionq", "rigetti"],
    }),
    mention({
      title: "Brussels demande des informations à plus de 30 laboratoires d’IA",
      excerpt:
        "Les demandes portent sur la sûreté et le droit d’auteur. Le cadrage français insiste sur la souveraineté technologique face à Washington et Pékin.",
      url: "https://news.google.com/",
      source: "Le Monde",
      channel: "news",
      topic: "policy",
      region: "EU",
      language: "fr",
      publishedAt: hoursAgo(48),
    }),
    mention({
      title: "Washington nimmt Beteiligungen an Quantenfirmen — Industriepolitik als Kursfaktor",
      excerpt:
        "CHIPS-Act-Checks gegen Equity: deutsche Finanzmedien behandeln Rigetti und D-Wave jetzt als Policy-Trade, nicht nur als Physik-Story.",
      url: "https://news.google.com/",
      source: "Handelsblatt",
      channel: "news",
      topic: "policy",
      region: "EU",
      language: "de",
      publishedAt: hoursAgo(10),
      brands: ["rigetti"],
    }),
    mention({
      title: "中国主導の上海AIガバナンス枠組み、29か国が署名 — 中身は薄い",
      excerpt:
        "習近平は国際ルールの主導権を主張。具体的な義務は少なく、EUの罰則型と米国の任意型の間に第三極を置く広報になっている。",
      url: "https://news.google.com/",
      source: "Nikkei",
      channel: "news",
      topic: "policy",
      region: "CN",
      language: "ja",
      publishedAt: hoursAgo(80),
    }),
    mention({
      title: "Congress still has no AI bill — and labs are now asking for one",
      excerpt:
        "The Hugging Face agent story did in a week what safety shops could not in two years: put a capability incident on the committee calendar before adjournment.",
      url: "https://x.com/",
      source: "X",
      channel: "x",
      topic: "policy",
      region: "NA",
      language: "en",
      author: "Policy desk",
      handle: "@tideline",
      publishedAt: hoursAgo(12),
      brands: ["openai"],
    }),
  ];
}

export function seedPolicyShifts(): NarrativeShift[] {
  return [
    {
      id: "p1",
      topic: "policy",
      headline: "Washington is choosing speed over a licensing regime",
      detail:
        "EO 14409 plus the China-competition frame is the official line. OpenAI’s sudden ask for binding rules is the counter-narrative — coverage is splitting along competitiveness vs. incident response.",
      direction: "shift",
      magnitude: 2.4,
      window: "7d",
    },
    {
      id: "p2",
      topic: "policy",
      headline: "EU enforcement is no longer theoretical",
      detail:
        "GPAI fine powers, 30+ information requests, ENISA access to Mythos 5 and watermarking as a ship gate. European copy is about process; U.S. copy is about China.",
      direction: "up",
      magnitude: 1.9,
      window: "30d",
    },
    {
      id: "p3",
      topic: "policy",
      headline: "Quantum is being underwritten as industrial policy",
      detail:
        "CHIPS equity stakes, a DOE-scale machine target and a 2030 PQC mandate turned listed quantum names into a Washington trade. Google declining the check is the tell that terms matter.",
      direction: "up",
      magnitude: 3.1,
      window: "14d",
    },
  ];
}

export function seedPolicyTracker(): PolicyTrackerItem[] {
  return [
    {
      id: "eu-gpai",
      jurisdiction: "European Union",
      region: "EU",
      title: "AI Act Chapter V — GPAI duties + Commission fines",
      status: "enforcing",
      date: "2026-08-02",
      summary:
        "Fines up to €15 million or 3% of worldwide turnover for GPAI breaches. AI Office can demand evaluations and model access.",
      beat: "ai",
      impact: "high",
      watch: "First formal investigation after the September RFIs.",
    },
    {
      id: "eo-14409",
      jurisdiction: "United States (federal)",
      region: "NA",
      title: "EO 14409 — voluntary frontier cyber review",
      status: "voluntary",
      date: "2026-06-02",
      summary:
        "Pre-release access and cyber benchmarking. Explicitly not a licensing regime. BIS export controls remain the real lever, as Anthropic learned in June.",
      beat: "ai",
      impact: "high",
      watch: "Whether Congress writes a capability-based floor before adjournment.",
    },
    {
      id: "sb53",
      jurisdiction: "California",
      region: "NA",
      title: "SB 53 Transparency in Frontier AI Act",
      status: "in-force",
      date: "2026-01-01",
      summary:
        "Hard transparency duties for developers above 10²⁶ FLOPs. The de facto U.S. rule while Washington stays voluntary.",
      beat: "ai",
      impact: "high",
      watch: "OpenAI’s endorsement of additional state bills.",
    },
    {
      id: "chips-q",
      jurisdiction: "United States (Commerce)",
      region: "NA",
      title: "CHIPS Act quantum equity grants",
      status: "in-force",
      date: "2026-09-08",
      summary:
        "$100M each to Rigetti, D-Wave and Quantinuum against a minority federal stake. Google Quantum declined.",
      beat: "industrial",
      impact: "high",
      watch: "Next closing names; whether listed multiples re-rate on the bid.",
    },
    {
      id: "eo-14413",
      jurisdiction: "United States (federal)",
      region: "NA",
      title: "EO 14413 Quantum Innovation + PQC companion order",
      status: "in-force",
      date: "2026-06-22",
      summary:
        "QC-ADDS scientific machine targeted at a DOE facility; FAR contractors must be PQC-compliant by 31 Dec 2030.",
      beat: "quantum",
      impact: "high",
      watch: "NQIAC reconstitution (210-day clock) and contractor RFPs.",
    },
    {
      id: "eu-watermark",
      jurisdiction: "European Union",
      region: "EU",
      title: "AI Act watermarking / synthetic-content labelling",
      status: "in-force",
      date: "2026-08-13",
      summary: "Product-level labelling for AI-generated content sold into the single market.",
      beat: "ai",
      impact: "medium",
      watch: "U.S. labs shipping consumer models into the EU this quarter.",
    },
    {
      id: "bis-anthropic",
      jurisdiction: "United States (BIS)",
      region: "NA",
      title: "Mythos / Fable export-control episode",
      status: "in-force",
      date: "2026-06-12",
      summary:
        "Cease-and-desist, limited unwind 26 June, full restore 30 June. Precedent: export law as frontier-model kill switch.",
      beat: "trade",
      impact: "high",
      watch: "Any repeat against Astra / GPT-6 agent stacks.",
    },
    {
      id: "cn-shanghai",
      jurisdiction: "China + 29 signatories",
      region: "CN",
      title: "Shanghai AI governance pact",
      status: "proposed",
      date: "2026-08-01",
      summary: "Political signalling, light on obligations. Positions Beijing as a third pole vs. EU hard law and U.S. voluntarism.",
      beat: "ai",
      impact: "medium",
      watch: "Whether CAC filings tighten for foreign models.",
    },
    {
      id: "pqc-far",
      jurisdiction: "United States (FAR / CISA)",
      region: "NA",
      title: "Federal PQC migration deadline",
      status: "deadline",
      date: "2030-12-31",
      summary:
        "Covered contractors must be NIST-PQC compliant. Sector-risk agencies to help critical infrastructure write plans.",
      beat: "security",
      impact: "high",
      watch: "First large-cap vendor certifications in 2027.",
    },
    {
      id: "g20-carolina",
      jurisdiction: "G20 / United States",
      region: "NA",
      title: "Carolina Principles (anti technology-specific rules)",
      status: "proposed",
      date: "2026-09-02",
      summary:
        "U.S. line at the Chapel Hill G20 innovation meeting. Directly opposed to the AI Act method.",
      beat: "ai",
      impact: "medium",
      watch: "How many G20 members actually sign on.",
    },
  ];
}
