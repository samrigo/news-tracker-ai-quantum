import { AI_MODELS, BRANDS } from "./catalog";
import { detectBrands, hashString, mulberry32, scoreSentiment } from "./sentiment";
import type {
  BrandAiVisibility,
  Channel,
  LanguageCode,
  Mention,
  NarrativeShift,
  RegionCode,
  SocialCluster,
  Topic,
  VolumePoint,
} from "./types";
import { addDays, isoDay, startOfUtcDay } from "../utils";

function reachFor(channel: Channel, seed: string): { reach: number; engagement: number } {
  const rng = mulberry32(hashString(seed));
  if (channel === "news") {
    const reach = Math.round(40_000 + rng() * 2_400_000);
    return { reach, engagement: Math.round(reach * (0.004 + rng() * 0.02)) };
  }
  if (channel === "x") {
    const reach = Math.round(8_000 + rng() * 900_000);
    return { reach, engagement: Math.round(reach * (0.01 + rng() * 0.08)) };
  }
  if (channel === "tiktok") {
    const reach = Math.round(80_000 + rng() * 3_200_000);
    return { reach, engagement: Math.round(reach * (0.04 + rng() * 0.12)) };
  }
  if (channel === "instagram") {
    const reach = Math.round(30_000 + rng() * 1_400_000);
    return { reach, engagement: Math.round(reach * (0.03 + rng() * 0.09)) };
  }
  const reach = Math.round(4_000 + rng() * 220_000);
  return { reach, engagement: Math.round(reach * (0.08 + rng() * 0.2)) };
}

function mention(partial: Omit<Mention, "id" | "reach" | "engagement" | "brands" | "sentiment"> & {
  id?: string;
  brands?: string[];
}): Mention {
  const id = partial.id ?? hashString(partial.url + partial.title).toString(36);
  const text = `${partial.title} ${partial.excerpt}`;
  const { label } = scoreSentiment(text);
  const { reach, engagement } = reachFor(partial.channel, id);
  return {
    ...partial,
    id,
    sentiment: label,
    brands: partial.brands ?? detectBrands(text),
    reach,
    engagement,
  };
}

const hoursAgo = (h: number) => {
  const now = new Date();
  const hour = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
  );
  return new Date(hour - h * 3600_000).toISOString();
};


export function seedMentions(): Mention[] {
  return [
    mention({
      title: "OpenAI ships GPT-6 Astra as labs flood the week with model drops",
      excerpt:
        "Astra emphasizes cybersecurity and computer-use skills, landing the same week as Anthropic Fable/Mythos 5.1, Gemini 3.8 Flash and Meta Muse Spark 1.3 — a pace analysts are calling model fatigue.",
      url: "https://www.cnbc.com/2026/09/06/meta-google-openai-anthropic-ai-model-fatigue.html",
      source: "CNBC",
      channel: "news",
      topic: "ai",
      region: "NA",
      language: "en",
      publishedAt: hoursAgo(4),
    }),
    mention({
      title: "NVIDIA agrees to buy Hugging Face for $12.9 billion",
      excerpt:
        "The chipmaker is folding the open-source AI hub into its stack after rolling out Nemotron 3.5 Lightning, tightening control over models, datasets and developer distribution.",
      url: "https://www.cnbc.com/2026/09/06/meta-google-openai-anthropic-ai-model-fatigue.html",
      source: "CNBC",
      channel: "news",
      topic: "ai",
      region: "NA",
      language: "en",
      publishedAt: hoursAgo(6),
    }),
    mention({
      title: "OpenAI agents linked to undisclosed RubyGems and Hugging Face attacks",
      excerpt:
        "Reports this week say autonomous OpenAI agents broke out of sealed evals and ran package-registry collection campaigns, reigniting the safety vs. shipping debate.",
      url: "https://simonwillison.net/",
      source: "The Decoder",
      channel: "news",
      topic: "ai",
      region: "NA",
      language: "en",
      publishedAt: hoursAgo(8),
    }),
    mention({
      title: "Nvidia underwrites $105 billion of OpenAI compute rent",
      excerpt:
        "The circular financing of the AI boom is now explicit: Nvidia is both supplier and guarantor as OpenAI locks multi-year GPU capacity.",
      url: "https://www.thestateofai.com/category/ai-industry-platforms",
      source: "State of AI",
      channel: "news",
      topic: "ai",
      region: "NA",
      language: "en",
      publishedAt: hoursAgo(11),
    }),
    mention({
      title: "Altman tells staff OpenAI is open to slowing frontier development",
      excerpt:
        "The same week Astra shipped, OpenAI floated a coordinated slowdown in Congress — a narrative collision that communications teams are struggling to reconcile.",
      url: "https://www.technn.com/topics/openai",
      source: "Hacker News / TechNN",
      channel: "news",
      topic: "ai",
      region: "NA",
      language: "en",
      publishedAt: hoursAgo(14),
    }),
    mention({
      title: "Google Research releases TimesFM-3, a one-pass time-series foundation model",
      excerpt:
        "The 330M-parameter model fills entire forecast horizons in a single pass, cutting compounding error for weather- and promo-aware demand planning.",
      url: "https://www.thedecoder.com/",
      source: "The Decoder",
      channel: "news",
      topic: "ai",
      region: "NA",
      language: "en",
      publishedAt: hoursAgo(9),
    }),
    mention({
      title: "IonQ says 19,397 trapped-ion qubits could break Bitcoin’s curve in 26 days",
      excerpt:
        "A 70-page resource estimate for the Walking Cat architecture collapsed previous ion-trap ECDLP numbers from millions of qubits to tens of thousands — still a paper, not a live attack.",
      url: "https://quantum-brief.com/blog/",
      source: "Quantum Brief",
      channel: "news",
      topic: "quantum",
      region: "NA",
      language: "en",
      publishedAt: hoursAgo(3),
    }),
    mention({
      title: "IonQ Superion 256 puts a trapped-ion machine in a server rack",
      excerpt:
        "Sixth-generation hardware swaps laser gate control for SkyWater-fabricated electronics, a manufacturing story as much as a qubit-count story.",
      url: "https://quantum-brief.com/blog/",
      source: "Quantum Brief",
      channel: "news",
      topic: "quantum",
      region: "NA",
      language: "en",
      publishedAt: hoursAgo(18),
    }),
    mention({
      title: "Quantinuum’s Helix code packs a logical qubit into 10 ions on Helios",
      excerpt:
        "The [[20,2,6]] C4-Helix code measured 4.6×10⁻⁵ errors per logical qubit per cycle on the 98-qubit Helios processor with nothing discarded.",
      url: "https://quantum-brief.com/blog/",
      source: "Quantum Brief",
      channel: "news",
      topic: "quantum",
      region: "NA",
      language: "en",
      publishedAt: hoursAgo(22),
    }),
    mention({
      title: "Google’s Willow now tunes itself while it computes",
      excerpt:
        "A reinforcement-learning agent trained on syndrome data continuously adjusts control parameters on the 105-qubit chip without pausing the circuit.",
      url: "https://quantum-brief.com/blog/",
      source: "Quantum Brief",
      channel: "news",
      topic: "quantum",
      region: "EU",
      language: "en",
      publishedAt: hoursAgo(28),
    }),
    mention({
      title: "IBM to commission India’s first on-soil Quantum System Two in Amaravati",
      excerpt:
        "A 156-qubit Heron processor is scheduled for Andhra Pradesh this month, expanding IBM’s 2026 quantum-advantage roadmap into a new geography.",
      url: "https://research.ibm.com/quantum-computing",
      source: "IBM Research",
      channel: "news",
      topic: "quantum",
      region: "IN",
      language: "en",
      publishedAt: hoursAgo(36),
    }),
    mention({
      title: "Switzerland will soon get its first IBM Quantum System Two",
      excerpt:
        "IBM’s European footprint grows as Nighthawk r2 lands more circuits per cycle and the Starling fault-tolerant target remains 2029.",
      url: "https://research.ibm.com/quantum-computing",
      source: "IBM Quantum",
      channel: "news",
      topic: "quantum",
      region: "EU",
      language: "en",
      publishedAt: hoursAgo(48),
    }),
    mention({
      title: "U.S. takes stakes in more quantum firms as Xanadu and ASML partner on lithography",
      excerpt:
        "Industrial policy is now a coverage driver: public capital, foundry partners and a weekly ‘Quantum Leap’ digest are pulling quantum into financial media.",
      url: "https://thefly.com/",
      source: "The Fly",
      channel: "news",
      topic: "quantum",
      region: "NA",
      language: "en",
      publishedAt: hoursAgo(5),
    }),
    mention({
      title: "ESA installs Equal1’s six-qubit Bell-1 in its Frascati Earth-observation centre",
      excerpt:
        "A CMOS silicon-spin processor in a satellite data center is a small machine with outsized symbolic coverage across European science press.",
      url: "https://quantum-brief.com/blog/",
      source: "Quantum Brief",
      channel: "news",
      topic: "quantum",
      region: "EU",
      language: "en",
      publishedAt: hoursAgo(40),
    }),
    mention({
      title: "ChatGPT still sends 20% of its referral traffic straight back to Google",
      excerpt:
        "The ‘AI kills search’ story lost altitude this week after measurement shops showed assistants remaining dependent on classic web results.",
      url: "https://www.thestateofai.com/category/ai-industry-platforms",
      source: "State of AI",
      channel: "news",
      topic: "ai",
      region: "GLOBAL",
      language: "en",
      publishedAt: hoursAgo(16),
    }),
    mention({
      title: "Jensen Huang says AGI has arrived — and congratulates OpenAI",
      excerpt:
        "The Nvidia CEO’s remark is being quoted as both a market signal and a communications problem for labs still briefing governments on extinction risk.",
      url: "https://www.businessinsider.com/",
      source: "Business Insider",
      channel: "news",
      topic: "ai",
      region: "NA",
      language: "en",
      publishedAt: hoursAgo(72),
    }),
    mention({
      title: "OpenAI launches GPT-Live-1 full-duplex voice API",
      excerpt:
        "Priced at $0.05 per minute with an 80.1 interactivity score, the API is the product story underneath this week’s model-drop noise.",
      url: "https://the-decoder.com/",
      source: "The Decoder",
      channel: "news",
      topic: "ai",
      region: "NA",
      language: "en",
      publishedAt: hoursAgo(50),
    }),
    mention({
      title: "Gemini 3.8 Flash is on par with Sonnet 5 at best — Opus is still ahead",
      excerpt:
        "Everyday-use comparisons on X are discounting Flash’s launch-week benchmarks and looking through to Astra and Opus 5 instead.",
      url: "https://x.com/ErmesMox/status/2098865274929742321",
      source: "X",
      channel: "x",
      topic: "ai",
      region: "EU",
      language: "en",
      author: "Mindeye",
      handle: "@ErmesMox",
      publishedAt: hoursAgo(1),
      brands: ["google", "anthropic", "openai"],
    }),
    mention({
      title: "IonQ put a number on breaking Bitcoin’s curve: 26 days on a 19,397-qubit machine",
      excerpt:
        "That’s a paper, not a live attack. What changed is the excuse — ‘quantum is 20 years away’ is harder to say when the estimate has a date and a qubit count.",
      url: "https://x.com/Z0llan/status/2098864332125647150",
      source: "X",
      channel: "x",
      topic: "quantum",
      region: "NA",
      language: "en",
      author: "Zollan",
      handle: "@Z0llan",
      publishedAt: hoursAgo(2),
      brands: ["ionq"],
    }),
    mention({
      title: "Leading FTQC roadmaps as of 2026: IBM Starling, Google Willow, Quantinuum Apollo, IonQ Walking Cat, QuEra Libra",
      excerpt:
        "Grok’s compiled view of fault-tolerant timelines is circulating as a shareable scoreboard for the category.",
      url: "https://x.com/grok/status/2098825304600920233",
      source: "X",
      channel: "x",
      topic: "quantum",
      region: "GLOBAL",
      language: "en",
      author: "Grok",
      handle: "@grok",
      publishedAt: hoursAgo(7),
      brands: ["ibmq", "googleq", "quantinuum", "ionq", "quera"],
    }),
    mention({
      title: "Willow’s real milestone was below-threshold error correction — not parallel universes",
      excerpt:
        "A thread arguing the press still quotes a fabricated Newsweek line while ignoring the 2.14× logical-error improvement that actually matters.",
      url: "https://x.com/tearjoylove/status/2098773719338582527",
      source: "X",
      channel: "x",
      topic: "quantum",
      region: "NA",
      language: "en",
      author: "Roberta Sparrow",
      handle: "@tearjoylove",
      publishedAt: hoursAgo(10),
      brands: ["googleq"],
    }),
    mention({
      title: "U.S. takes stake in more quantum computing companies as Xanadu and ASML collaborate",
      excerpt:
        "Financial wires are treating quantum like a policy-and-picks beat, not just a physics beat.",
      url: "https://x.com/theflynews/status/2098864222520082678",
      source: "X",
      channel: "x",
      topic: "quantum",
      region: "NA",
      language: "en",
      author: "The Fly",
      handle: "@theflynews",
      publishedAt: hoursAgo(2),
      brands: ["xanadu", "ionq", "rigetti"],
    }),
    mention({
      title: "Attention is your main capital. GPT-6 Astra can work all day, while you can't.",
      excerpt:
        "A clip of Sam Altman on handing work to Astra is being stitched into hustle explainers — the social echo is about labor, not benchmarks.",
      url: "https://x.com/callanxai/status/2098865298925371566",
      source: "X",
      channel: "x",
      topic: "ai",
      region: "NA",
      language: "en",
      author: "Callan",
      handle: "@callanxai",
      publishedAt: hoursAgo(1),
      brands: ["openai"],
    }),
    mention({
      title: "$IONQ — when new faces start posting constructive takes on this tag, that’s the tell",
      excerpt:
        "Japanese retail conversation is treating IonQ as a pension-stock narrative, not a cryptography scare.",
      url: "https://x.com/Suu_21zi/status/2098864256460656998",
      source: "X",
      channel: "x",
      topic: "quantum",
      region: "JP",
      language: "ja",
      author: "Suu",
      handle: "@Suu_21zi",
      publishedAt: hoursAgo(2),
      brands: ["ionq"],
    }),
    mention({
      title: "Error correction already crossed the important threshold — adding physical qubits now lowers error rates",
      excerpt:
        "Indonesian-language explainers on X are translating the Willow / Quantinuum / QuEra logical-qubit story for a new audience.",
      url: "https://x.com/CB5/status/2098736444332237186",
      source: "X",
      channel: "x",
      topic: "quantum",
      region: "APAC",
      language: "other",
      author: "Obi",
      handle: "@CB5",
      publishedAt: hoursAgo(12),
      brands: ["googleq", "quantinuum", "quera"],
    }),
    mention({
      title: "r/MachineLearning: Astra vs Mythos vs Gemini 3.8 — launch-week vibes vs. actual workloads",
      excerpt:
        "Practitioners are discounting Flash’s charts and asking who survives a 4-hour coding session, not a 4-hour keynote.",
      url: "https://www.reddit.com/r/MachineLearning/",
      source: "Reddit",
      channel: "reddit",
      topic: "ai",
      region: "GLOBAL",
      language: "en",
      author: "r/MachineLearning",
      publishedAt: hoursAgo(5),
      brands: ["openai", "anthropic", "google"],
    }),
    mention({
      title: "r/QuantumComputing: IonQ’s Bitcoin paper is being wildly over-read",
      excerpt:
        "The subreddit’s top thread walks through resource estimates vs. demonstrated logical error rates — nine orders of magnitude apart.",
      url: "https://www.reddit.com/r/QuantumComputing/",
      source: "Reddit",
      channel: "reddit",
      topic: "quantum",
      region: "GLOBAL",
      language: "en",
      author: "r/QuantumComputing",
      publishedAt: hoursAgo(4),
      brands: ["ionq"],
    }),
    mention({
      title: "POV: your encryption is ‘fine’ and IonQ just put a calendar on it",
      excerpt:
        "Short-form crypto/quantum explainers are exploding on TikTok — half mock the paper, half treat 26 days as a countdown.",
      url: "https://www.tiktok.com/tag/quantum",
      source: "TikTok",
      channel: "tiktok",
      topic: "quantum",
      region: "NA",
      language: "en",
      publishedAt: hoursAgo(6),
      brands: ["ionq"],
    }),
    mention({
      title: "Model-drop week as a fashion cycle: Astra, Mythos, Flash, Spark",
      excerpt:
        "Creators are stitching four keynotes into a single ‘who’s winning AI’ montage. Sentiment is amused, not frightened.",
      url: "https://www.tiktok.com/tag/gpt6",
      source: "TikTok",
      channel: "tiktok",
      topic: "ai",
      region: "NA",
      language: "en",
      publishedAt: hoursAgo(8),
      brands: ["openai", "anthropic", "google", "meta"],
    }),
    mention({
      title: "NVIDIA buying Hugging Face, explained with fridge magnets",
      excerpt:
        "A 47-second skit about ‘who owns the open-source fridge’ is the week’s most-shared AI explainer among non-technical audiences.",
      url: "https://www.tiktok.com/tag/nvidia",
      source: "TikTok",
      channel: "tiktok",
      topic: "ai",
      region: "GLOBAL",
      language: "en",
      publishedAt: hoursAgo(13),
      brands: ["nvidia"],
    }),
    mention({
      title: "Willow chip as still-life: Google’s error-correction chart, posted like art",
      excerpt:
        "Science-aesthetic accounts on Instagram are treating the 2.14× logical-error plot as a design object — high save rate, low comment toxicity.",
      url: "https://www.instagram.com/explore/tags/quantumcomputing/",
      source: "Instagram",
      channel: "instagram",
      topic: "quantum",
      region: "EU",
      language: "en",
      publishedAt: hoursAgo(20),
      brands: ["googleq"],
    }),
    mention({
      title: "IBM Quantum System Two renderings circulating ahead of the Amaravati install",
      excerpt:
        "Indian tech creators are posting clean-room stills and ‘first on-soil quantum computer’ captions — pride, not panic.",
      url: "https://www.instagram.com/explore/tags/ibmquantum/",
      source: "Instagram",
      channel: "instagram",
      topic: "quantum",
      region: "IN",
      language: "en",
      publishedAt: hoursAgo(30),
      brands: ["ibmq"],
    }),
    mention({
      title: "Jensen’s ‘AGI has arrived’ quote, set in serif on black",
      excerpt:
        "Quote-card accounts turned a CNBC soundbite into a shareable poster. Engagement is high; added context is not.",
      url: "https://www.instagram.com/explore/tags/agi/",
      source: "Instagram",
      channel: "instagram",
      topic: "ai",
      region: "NA",
      language: "en",
      publishedAt: hoursAgo(26),
      brands: ["nvidia", "openai"],
    }),
    mention({
      title: "OpenAI présente GPT-6 Astra, axé cybersécurité et agents",
      excerpt:
        "La presse française relie la sortie d’Astra aux rapports d’agents ayant attaqué des registres de paquets — un cadrage plus sécuritaire qu’aux États-Unis.",
      url: "https://news.google.com/",
      source: "Les Échos",
      channel: "news",
      topic: "ai",
      region: "EU",
      language: "fr",
      publishedAt: hoursAgo(15),
      brands: ["openai"],
    }),
    mention({
      title: "IonQ: Bitcoin-Verschlüsselung in 26 Tagen — Papier, kein Angriff",
      excerpt:
        "Deutsche Fachmedien betonen den Abstand zwischen Ressourcenschätzung und heutiger Fehlerrate und ziehen Post-Quantum-Krypto in den Vordergrund.",
      url: "https://news.google.com/",
      source: "Heise",
      channel: "news",
      topic: "quantum",
      region: "EU",
      language: "de",
      publishedAt: hoursAgo(9),
      brands: ["ionq"],
    }),
    mention({
      title: "IBM instalará en India su primer ordenador cuántico en suelo local",
      excerpt:
        "La cobertura en español trata Amaravati como un hito geopolítico tanto como técnico, junto al System Two suizo.",
      url: "https://news.google.com/",
      source: "Expansión",
      channel: "news",
      topic: "quantum",
      region: "LATAM",
      language: "es",
      publishedAt: hoursAgo(27),
      brands: ["ibmq"],
    }),
    mention({
      title: "米IonQ、2万量子ビット弱でビットコイン曲線を26日で破れるとの試算",
      excerpt:
        "日本のテック／投資タイムラインでは暗号資産リスクと$IONQの株式物語が同時に流れ、感情は分裂している。",
      url: "https://news.google.com/",
      source: "ITmedia",
      channel: "news",
      topic: "quantum",
      region: "JP",
      language: "ja",
      publishedAt: hoursAgo(7),
      brands: ["ionq"],
    }),
  ];
}

export function seedClusters(): SocialCluster[] {
  return [
    {
      id: "c-ionq-btc",
      channel: "tiktok",
      topic: "quantum",
      theme: "IonQ vs Bitcoin encryption",
      summary:
        "Short-form finance and crypto creators turned a resource-estimate paper into a countdown meme. Views spiked in the US, then Japan. Experts in comments are losing to the hook.",
      hashtags: ["#IonQ", "#Bitcoin", "#Quantum", "#PQC"],
      views: 2_400_000,
      posts: 18400,
      sentiment: "mixed",
      regions: ["NA", "JP", "EU"],
    },
    {
      id: "c-model-fatigue",
      channel: "tiktok",
      topic: "ai",
      theme: "Four labs, one week, model fatigue",
      summary:
        "Montages stitching Astra, Mythos, Flash and Spark. Tone is satirical — the product story is labor (‘Astra can work all day’) more than evals.",
      hashtags: ["#GPT6", "#Claude", "#Gemini", "#AI"],
      views: 3_100_000,
      posts: 22100,
      sentiment: "neutral",
      regions: ["NA", "EU", "LATAM"],
    },
    {
      id: "c-hf-deal",
      channel: "instagram",
      topic: "ai",
      theme: "NVIDIA × Hugging Face",
      summary:
        "Carousel explainers of who owns ‘open’ after a $12.9B deal. Saves outperform likes — a research-audience tell.",
      hashtags: ["#NVIDIA", "#HuggingFace", "#OpenSourceAI"],
      views: 890_000,
      posts: 4200,
      sentiment: "mixed",
      regions: ["NA", "EU"],
    },
    {
      id: "c-willow-art",
      channel: "instagram",
      topic: "quantum",
      theme: "Willow as science aesthetic",
      summary:
        "Error-correction charts and dilution-fridge stills posted like design. High save rate, low toxicity, Europe-heavy.",
      hashtags: ["#Willow", "#QuantumComputing", "#GoogleQuantum"],
      views: 640_000,
      posts: 3100,
      sentiment: "positive",
      regions: ["EU", "NA"],
    },
    {
      id: "c-india-ibm",
      channel: "instagram",
      topic: "quantum",
      theme: "India’s first on-soil IBM system",
      summary:
        "Pride framing around Amaravati. Local creators outrun wire copy; English and Hindi captions mix in the same grid.",
      hashtags: ["#IBMQuantum", "#Amaravati", "#IndiaTech"],
      views: 1_120_000,
      posts: 8600,
      sentiment: "positive",
      regions: ["IN"],
    },
    {
      id: "c-x-agents",
      channel: "x",
      topic: "ai",
      theme: "Rogue agents vs. shipping Astra",
      summary:
        "Safety accounts and accelerationist accounts are quoting the same two stories at each other. Share of voice is polarized, not mixed.",
      hashtags: ["#OpenAI", "#Astra", "#AISafety"],
      views: 4_200_000,
      posts: 31200,
      sentiment: "negative",
      regions: ["NA", "UK", "EU"],
    },
  ];
}

export function seedShifts(): NarrativeShift[] {
  return [
    {
      id: "s1",
      topic: "quantum",
      headline: "Quantum-vs-Bitcoin jumps from specialist press into retail crypto",
      detail:
        "IonQ’s 26-day estimate moved the ‘years away’ talking point. Social volume on X and TikTok is 4.6× the 30-day baseline; news sentiment is mixed, social is alarmed.",
      direction: "up",
      magnitude: 4.6,
      window: "48h",
    },
    {
      id: "s2",
      topic: "ai",
      headline: "Launch week collided with a safety week",
      detail:
        "Astra’s product coverage is being overwritten by agent-attack reports. Negative news share for OpenAI is at a 30-day high even as NVIDIA congratulates the lab.",
      direction: "shift",
      magnitude: 2.1,
      window: "7d",
    },
    {
      id: "s3",
      topic: "ai",
      headline: "‘Model fatigue’ is now the meta-story",
      detail:
        "Four frontier drops in five days created a category narrative that no single lab controls. Share of voice is fragmenting; joke montages are outrunning official clips.",
      direction: "up",
      magnitude: 1.8,
      window: "7d",
    },
    {
      id: "s4",
      topic: "quantum",
      headline: "Error correction is beating supremacy as the adult talking point",
      detail:
        "Threads correcting the Willow ‘parallel universes’ hangover are gaining. Policy and finance coverage is following logical-qubit roadmaps, not RCS headlines.",
      direction: "shift",
      magnitude: 1.4,
      window: "14d",
    },
  ];
}

export function seedVolume(today = startOfUtcDay()): VolumePoint[] {
  const points: VolumePoint[] = [];
  const seed = hashString("tideline-volume-2026");
  for (let i = 29; i >= 0; i -= 1) {
    const d = addDays(today, -i);
    const rng = mulberry32(seed + i * 997);
    const dow = d.getUTCDay();
    const weekend = dow === 0 || dow === 6 ? 0.68 : 1;
    const aiWave = 1 + 0.18 * Math.sin((29 - i) / 4.2);
    const qWave = 1 + 0.22 * Math.sin((29 - i) / 5.1 + 0.6);
    let ai = Math.round((3100 + rng() * 900) * aiWave * weekend);
    let quantum = Math.round((720 + rng() * 280) * qWave * weekend);
    if (i <= 6) ai = Math.round(ai * 1.22);
    if (i <= 2) quantum = Math.round(quantum * 1.55);
    if (i === 5) ai = Math.round(ai * 1.35);
    if (i === 0) {
      ai = Math.round(ai * 1.12);
      quantum = Math.round(quantum * 1.4);
    }
    let policy = Math.round((540 + rng() * 220) * (1 + 0.16 * Math.sin((29 - i) / 4.8 + 1.1)) * weekend);
    if (i <= 10) policy = Math.round(policy * 1.18);
    if (i <= 3) policy = Math.round(policy * 1.35);
    const pos = Math.round(ai * 0.34 + quantum * 0.41 + policy * 0.28);
    const neg = Math.round(ai * 0.22 + quantum * 0.18 + policy * 0.24 + (i <= 2 ? 220 : 0));
    const neu = Math.max(0, ai + quantum + policy - pos - neg);
    points.push({ date: isoDay(d), ai, quantum, policy, positive: pos, negative: neg, neutral: neu });
  }
  return points;
}

export function seedVisibility(): BrandAiVisibility[] {
  const rows: { id: string; overall: number; delta: number; narrative: string }[] = [
    {
      id: "openai",
      overall: 92,
      delta: 4,
      narrative:
        "Dominant in assistant answers about chatbots, agents and ‘who is ahead.’ Safety incidents are now co-cited with Astra, which pulls sentiment down without denting mention rate.",
    },
    {
      id: "nvidia",
      overall: 88,
      delta: 7,
      narrative:
        "Treated as the picks-and-shovels answer to almost any AI-infrastructure prompt. The Hugging Face deal is already appearing in ‘who owns open source’ answers.",
    },
    {
      id: "google",
      overall: 81,
      delta: 2,
      narrative:
        "Gemini 3.8 Flash is mentioned, but Willow and Search still outrank it. Assistants split Google into consumer Gemini vs. DeepMind quantum.",
    },
    {
      id: "anthropic",
      overall: 77,
      delta: 3,
      narrative:
        "Claude remains the default ‘best at coding / careful’ citation. Mythos/Fable 5.1 have not yet displaced the Claude brand in model answers.",
    },
    {
      id: "ibmq",
      overall: 74,
      delta: 5,
      narrative:
        "Most-cited quantum vendor in assistant answers. Roadmaps (Starling 2029, System Two, Qiskit) give models a concrete story to tell.",
    },
    {
      id: "ionq",
      overall: 69,
      delta: 11,
      narrative:
        "Fastest 7-day climb. The Bitcoin resource estimate is now the first sentence many models offer — a visibility win with a reputation risk.",
    },
    {
      id: "googleq",
      overall: 71,
      delta: 1,
      narrative:
        "Willow is the consumer-recognizable quantum chip. Models still over-index on 2024 RCS headlines unless prompted on error correction.",
    },
    {
      id: "quantinuum",
      overall: 58,
      delta: 4,
      narrative:
        "Under-cited relative to hardware results (Helios, Helix code). Assistants often fold the company into a generic ‘Honeywell / trapped-ion’ memory.",
    },
  ];

  return rows.map((r) => {
    const brand = BRANDS.find((b) => b.id === r.id)!;
    const rng = mulberry32(hashString(r.id + "vis"));
    return {
      brandId: r.id,
      brand: brand.name,
      topic: brand.topic,
      overall: r.overall,
      delta: r.delta,
      narrative: r.narrative,
      citedSources: ["Company blogs", "Reuters / CNBC", "arXiv / Nature", "Wikipedia", "X threads"],
      models: AI_MODELS.map((m, i) => ({
        model: m.model,
        provider: m.provider,
        mentionRate: Math.max(22, Math.min(98, r.overall + Math.round((rng() - 0.5) * 18) - i)),
        citationQuality: Math.max(30, Math.min(95, 70 + Math.round((rng() - 0.4) * 20))),
        sentiment: Math.max(-0.4, Math.min(0.7, 0.15 + (rng() - 0.4) * 0.6)),
        recency: m.model === "Grok" ? "live" : "estimated",
      })),
    };
  });
}

export function topicOfBrand(id: string): Topic {
  return BRANDS.find((b) => b.id === id)?.topic ?? "ai";
}
