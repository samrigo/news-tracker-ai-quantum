import { useQuery } from "@tanstack/react-query";
import { getMarkets } from "./api";
import { assembleMarkets } from "./markets";
import { useHelix } from "./store";

export function useMarkets() {
  const topic = useHelix((s) => s.topic);
  const q = useQuery({
    queryKey: ["markets"],
    queryFn: async () => {
      try {
        return await getMarkets();
      } catch {
        return assembleMarkets();
      }
    },
    placeholderData: () => assembleMarkets(),
    retry: 0,
    staleTime: 60_000,
  });

  const snap = q.data ?? assembleMarkets();
  const quotes =
    topic === "ai"
      ? snap.quotes.filter((x) => x.sleeve === "ai" || x.sleeve === "semis" || x.sleeve === "index")
      : topic === "quantum"
        ? snap.quotes.filter((x) => x.sleeve === "quantum" || x.sleeve === "index")
        : snap.quotes;
  const ideas =
    topic === "ai"
      ? snap.ideas.filter((x) => x.sleeve === "ai" || x.sleeve === "semis")
      : topic === "quantum"
        ? snap.ideas.filter((x) => x.sleeve === "quantum")
        : snap.ideas;
  const headlines =
    topic === "all" ? snap.headlines : snap.headlines.filter((h) => h.topic === topic || h.topic === "policy");

  return { ...q, snap, quotes, ideas, headlines, topic };
}
