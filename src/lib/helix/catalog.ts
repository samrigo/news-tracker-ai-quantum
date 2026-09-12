import type { Channel, LanguageCode, RegionCode, Topic } from "./types";

export const APP_NAME = "Tideline";
export const APP_TAGLINE = "Intelligence, policy and tape for AI & quantum";

export const REGIONS: { code: RegionCode; label: string }[] = [
  { code: "NA", label: "North America" },
  { code: "UK", label: "United Kingdom" },
  { code: "EU", label: "Europe" },
  { code: "LATAM", label: "Latin America" },
  { code: "MENA", label: "Middle East & Africa" },
  { code: "IN", label: "India" },
  { code: "JP", label: "Japan" },
  { code: "CN", label: "Greater China" },
  { code: "APAC", label: "Rest of APAC" },
  { code: "GLOBAL", label: "Global" },
];

export const LANGUAGES: { code: LanguageCode; label: string }[] = [
  { code: "en", label: "English" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "pt", label: "Portuguese" },
  { code: "ja", label: "Japanese" },
  { code: "zh", label: "Chinese" },
  { code: "ko", label: "Korean" },
  { code: "hi", label: "Hindi" },
  { code: "other", label: "Other" },
];

export const CHANNELS: { code: Channel; label: string }[] = [
  { code: "news", label: "News" },
  { code: "x", label: "X" },
  { code: "tiktok", label: "TikTok" },
  { code: "instagram", label: "Instagram" },
  { code: "reddit", label: "Reddit" },
];

export const TOPICS: { id: Topic; label: string }[] = [
  { id: "ai", label: "Artificial intelligence" },
  { id: "quantum", label: "Quantum computing" },
  { id: "policy", label: "Politics & regulation" },
];

export const BRANDS: {
  id: string;
  name: string;
  topic: Topic;
  aliases: string[];
}[] = [
  { id: "openai", name: "OpenAI", topic: "ai", aliases: ["openai", "chatgpt", "gpt-6", "gpt-5", "sam altman"] },
  { id: "anthropic", name: "Anthropic", topic: "ai", aliases: ["anthropic", "claude", "mythos", "fable"] },
  { id: "google", name: "Google", topic: "ai", aliases: ["google", "gemini", "deepmind", "alphabet"] },
  { id: "nvidia", name: "NVIDIA", topic: "ai", aliases: ["nvidia", "nvda", "jensen huang", "hugging face"] },
  { id: "meta", name: "Meta", topic: "ai", aliases: ["meta", "llama", "muse spark"] },
  { id: "xai", name: "xAI", topic: "ai", aliases: ["xai", "grok"] },
  { id: "microsoft", name: "Microsoft", topic: "ai", aliases: ["microsoft", "msft", "copilot", "azure openai"] },
  { id: "amazon", name: "Amazon", topic: "ai", aliases: ["amazon", "aws", "bedrock", "anthropic on aws"] },
  { id: "ibmq", name: "IBM Quantum", topic: "quantum", aliases: ["ibm quantum", "ibm", "qiskit", "nighthawk", "starling", "heron"] },
  { id: "googleq", name: "Google Quantum", topic: "quantum", aliases: ["willow", "sycamore", "quantum echoes", "neven"] },
  { id: "ionq", name: "IonQ", topic: "quantum", aliases: ["ionq", "superion", "walking cat"] },
  { id: "quantinuum", name: "Quantinuum", topic: "quantum", aliases: ["quantinuum", "helios", "helix code"] },
  { id: "rigetti", name: "Rigetti", topic: "quantum", aliases: ["rigetti", "rgti"] },
  { id: "quera", name: "QuEra", topic: "quantum", aliases: ["quera", "libra", "neutral atom"] },
  { id: "psiquantum", name: "PsiQuantum", topic: "quantum", aliases: ["psiquantum"] },
  { id: "xanadu", name: "Xanadu", topic: "quantum", aliases: ["xanadu"] },
];

export const AI_MODELS = [
  { model: "Grok", provider: "xAI" },
  { model: "ChatGPT", provider: "OpenAI" },
  { model: "Gemini", provider: "Google" },
  { model: "Claude", provider: "Anthropic" },
  { model: "Perplexity", provider: "Perplexity" },
] as const;

export const WATCHLIST = [
  { ticker: "NVDA", name: "NVIDIA", sleeve: "ai" as const },
  { ticker: "MSFT", name: "Microsoft", sleeve: "ai" as const },
  { ticker: "GOOGL", name: "Alphabet", sleeve: "ai" as const },
  { ticker: "AMZN", name: "Amazon", sleeve: "ai" as const },
  { ticker: "META", name: "Meta", sleeve: "ai" as const },
  { ticker: "AVGO", name: "Broadcom", sleeve: "semis" as const },
  { ticker: "TSM", name: "TSMC", sleeve: "semis" as const },
  { ticker: "AMD", name: "AMD", sleeve: "semis" as const },
  { ticker: "SMH", name: "VanEck Semi", sleeve: "semis" as const },
  { ticker: "PLTR", name: "Palantir", sleeve: "ai" as const },
  { ticker: "IBM", name: "IBM", sleeve: "quantum" as const },
  { ticker: "IONQ", name: "IonQ", sleeve: "quantum" as const },
  { ticker: "RGTI", name: "Rigetti", sleeve: "quantum" as const },
  { ticker: "QBTS", name: "D-Wave", sleeve: "quantum" as const },
  { ticker: "QUBT", name: "Quantum Computing Inc", sleeve: "quantum" as const },
  { ticker: "HON", name: "Honeywell", sleeve: "quantum" as const },
  { ticker: "QQQ", name: "Invesco QQQ", sleeve: "index" as const },
  { ticker: "SPY", name: "SPDR S&P 500", sleeve: "index" as const },
];

export function regionLabel(code: RegionCode): string {
  return REGIONS.find((r) => r.code === code)?.label ?? code;
}

export function languageLabel(code: LanguageCode): string {
  return LANGUAGES.find((l) => l.code === code)?.label ?? code;
}

export function channelLabel(code: Channel): string {
  return CHANNELS.find((c) => c.code === code)?.label ?? code;
}

export function topicLabel(topic: Topic): string {
  return TOPICS.find((t) => t.id === topic)?.label ?? topic;
}
