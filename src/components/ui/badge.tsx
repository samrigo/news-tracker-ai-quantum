import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium tracking-wide",
  {
    variants: {
      tone: {
        default: "bg-elevated text-muted",
        accent: "bg-accent/15 text-accent",
        pos: "bg-pos/15 text-pos",
        neg: "bg-neg/15 text-neg",
        warn: "bg-warn/15 text-warn",
        fg: "bg-fg/10 text-fg",
      },
    },
    defaultVariants: { tone: "default" },
  },
);

export function Badge({
  className,
  tone,
  ...props
}: HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone, className }))} {...props} />;
}

export function SentimentBadge({ value }: { value: string }) {
  const tone = value === "positive" ? "pos" : value === "negative" ? "neg" : value === "mixed" ? "warn" : "default";
  return <Badge tone={tone}>{value}</Badge>;
}
