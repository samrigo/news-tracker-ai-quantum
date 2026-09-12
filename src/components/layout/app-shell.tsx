import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  Bot,
  Crosshair,
  Landmark,
  LineChart,
  Menu,
  Newspaper,
  Radio,
  Sparkles,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Wordmark } from "@/components/brand/logo";
import { AskHelix } from "@/components/helix/ask-helix";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const GROUPS = [
  {
    label: "Intelligence",
    items: [
      { to: "/", label: "Overview", icon: Activity },
      { to: "/media", label: "Media", icon: Newspaper },
      { to: "/social", label: "Social", icon: Radio },
      { to: "/visibility", label: "AI Visibility", icon: Bot },
    ],
  },
  {
    label: "Desk",
    items: [
      { to: "/policy", label: "Policy", icon: Landmark },
      { to: "/markets", label: "Markets", icon: LineChart },
      { to: "/signals", label: "Signals", icon: Crosshair },
      { to: "/brief", label: "Daily Brief", icon: Sparkles },
    ],
  },
] as const;

const MOBILE_TABS = [
  { to: "/", label: "Overview", icon: Activity },
  { to: "/policy", label: "Policy", icon: Landmark },
  { to: "/markets", label: "Markets", icon: LineChart },
  { to: "/signals", label: "Signals", icon: Crosshair },
  { to: "/brief", label: "Brief", icon: Sparkles },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-5">
      {GROUPS.map((group) => (
        <div key={group.label}>
          <p className="mb-1.5 px-3 text-[10px] tracking-[0.18em] text-subtle uppercase">{group.label}</p>
          <div className="flex flex-col gap-1">
            {group.items.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onNavigate}
                  className={cn(
                    "flex min-h-11 items-center gap-3 rounded-md px-3 text-sm transition-colors duration-150",
                    active ? "bg-elevated text-fg" : "text-muted hover:bg-elevated/60 hover:text-fg",
                  )}
                >
                  <Icon className="size-4 shrink-0" strokeWidth={1.6} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [ask, setAsk] = useState(false);

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <aside className="fixed top-0 left-0 z-30 hidden h-dvh w-56 flex-col border-r border-border bg-bg p-4 md:flex">
        <Link to="/" className="mb-8 px-1">
          <Wordmark />
        </Link>
        <NavLinks />
        <div className="mt-auto space-y-3 px-1">
          <Button variant="secondary" className="w-full" onClick={() => setAsk(true)}>
            Ask Helix
          </Button>
          <p className="text-xs leading-relaxed text-subtle">
            Coverage, regulation and the AI / quantum tape. Static-ready for GitHub Pages and custom domains.
          </p>
        </div>
      </aside>

      <header className="sticky top-0 z-20 flex items-center gap-2 overflow-x-clip border-b border-border bg-bg/90 px-3 py-3 backdrop-blur-sm md:hidden">
        <Button variant="ghost" size="icon" aria-label="Open menu" onClick={() => setOpen(true)}>
          <Menu />
        </Button>
        <div className="min-w-0 flex-1">
          <Wordmark />
        </div>
        <Button variant="secondary" size="sm" onClick={() => setAsk(true)}>
          Ask Helix
        </Button>
      </header>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" title="Tideline" className="max-w-xs">
          <NavLinks onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <AskHelix open={ask} onOpenChange={setAsk} />

      <main className="min-w-0 overflow-x-clip md:pl-56">
        <div className="mx-auto max-w-7xl px-4 py-6 pb-24 md:px-8 md:py-8 md:pb-10">{children}</div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-border bg-bg/95 px-1 py-1 backdrop-blur-sm md:hidden">
        {MOBILE_TABS.map((item) => (
          <MobileTab key={item.to} {...item} />
        ))}
      </nav>
    </div>
  );
}

function MobileTab({ to, label, icon: Icon }: (typeof MOBILE_TABS)[number]) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
  return (
    <Link
      to={to}
      className={cn(
        "flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-sm text-xs",
        active ? "text-fg" : "text-subtle",
      )}
    >
      <Icon className="size-4" strokeWidth={1.6} />
      {label.split(" ")[0]}
    </Link>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="mb-2 text-xs tracking-[0.18em] text-subtle uppercase">{eyebrow}</p>
        ) : null}
        <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">{title}</h1>
        {description ? <p className="mt-2 max-w-xl text-sm text-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
