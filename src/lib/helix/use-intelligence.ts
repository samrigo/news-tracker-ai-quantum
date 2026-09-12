import { useQuery } from "@tanstack/react-query";
import { getIntelligence } from "./api";
import { applyFilters, sliceVolume } from "./filter";
import { useHelix } from "./store";
import { assembleSnapshot } from "./aggregate";

export function useIntelligence() {
  const topic = useHelix((s) => s.topic);
  const range = useHelix((s) => s.range);
  const channel = useHelix((s) => s.channel);
  const sentiment = useHelix((s) => s.sentiment);
  const query = useHelix((s) => s.query);

  const q = useQuery({
    queryKey: ["intelligence"],
    queryFn: async () => {
      try {
        return await getIntelligence();
      } catch {
        return assembleSnapshot([]);
      }
    },
    placeholderData: () => assembleSnapshot([]),
    retry: 0,
  });

  const snap = q.data ?? assembleSnapshot([]);
  const mentions = applyFilters(snap, { topic, range, channel, sentiment, query });
  const volume = sliceVolume(snap, range).map((p) => {
    if (topic === "ai") return { ...p, quantum: 0, policy: 0 };
    if (topic === "quantum") return { ...p, ai: 0, policy: 0 };
    if (topic === "policy") return { ...p, ai: 0, quantum: 0 };
    return p;
  });

  return { ...q, snap, mentions, volume, topic, range };
}
