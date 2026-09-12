import { useHelix } from "@/lib/helix/store";
import { cn } from "@/lib/utils";

export function TopicPills() {
  const topic = useHelix((s) => s.topic);
  const setTopic = useHelix((s) => s.setTopic);
  const range = useHelix((s) => s.range);
  const setRange = useHelix((s) => s.setRange);
  const items = [
    { id: "all" as const, label: "All coverage" },
    { id: "ai" as const, label: "Artificial intelligence" },
    { id: "quantum" as const, label: "Quantum computing" },
    { id: "policy" as const, label: "Politics & regulation" },
  ];
  const ranges = [
    { id: "24h" as const, label: "24h" },
    { id: "7d" as const, label: "7 days" },
    { id: "30d" as const, label: "30 days" },
  ];
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTopic(item.id)}
            className={cn(
              "min-h-10 rounded-full px-3.5 text-sm transition-colors duration-150",
              topic === item.id ? "bg-fg text-bg" : "bg-elevated text-muted hover:text-fg",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="flex gap-1 rounded-full bg-elevated p-1">
        {ranges.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setRange(item.id)}
            className={cn(
              "min-h-8 rounded-full px-3 text-xs transition-colors duration-150",
              range === item.id ? "bg-fg text-bg" : "text-muted hover:text-fg",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
