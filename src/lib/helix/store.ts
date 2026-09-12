import { create } from "zustand";
import type { Channel, RangeKey, Sentiment, TopicFilter } from "./types";

type HelixState = {
  topic: TopicFilter;
  range: RangeKey;
  channel: Channel | "all";
  sentiment: Sentiment | "all";
  query: string;
  setTopic: (topic: TopicFilter) => void;
  setRange: (range: RangeKey) => void;
  setChannel: (channel: Channel | "all") => void;
  setSentiment: (sentiment: Sentiment | "all") => void;
  setQuery: (query: string) => void;
};

export const useHelix = create<HelixState>((set) => ({
  topic: "all",
  range: "7d",
  channel: "all",
  sentiment: "all",
  query: "",
  setTopic: (topic) => set({ topic }),
  setRange: (range) => set({ range }),
  setChannel: (channel) => set({ channel }),
  setSentiment: (sentiment) => set({ sentiment }),
  setQuery: (query) => set({ query }),
}));
