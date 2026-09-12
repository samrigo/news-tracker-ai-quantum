import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCompact(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B`;
  if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (abs >= 10_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  if (abs >= 1_000) return n.toLocaleString();
  return String(Math.round(n));
}

export function formatPct(n: number, digits = 0): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)}%`;
}

export function formatPrice(n: number): string {
  if (Math.abs(n) >= 100) return n.toFixed(2);
  return n.toFixed(2);
}

export function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const delta = Date.now() - then;
  const mins = Math.round(delta / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function startOfUtcDay(d = new Date()): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

export function addDays(d: Date, n: number): Date {
  const next = new Date(d);
  next.setUTCDate(next.getUTCDate() + n);
  return next;
}

export function isoDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}
