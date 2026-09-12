import { createFileRoute, Link } from "@tanstack/react-router";
import { MentionList } from "@/components/feed/mentions";
import { AppShell, PageHeader } from "@/components/layout/app-shell";
import { TopicPills } from "@/components/layout/filters";
import { Badge } from "@/components/ui/badge";
import { seedPolicyTracker } from "@/lib/helix/seed-policy";
import { useIntelligence } from "@/lib/helix/use-intelligence";
import { regionLabel } from "@/lib/helix/catalog";
import type { PolicyStatus } from "@/lib/helix/types";

export const Route = createFileRoute("/policy")({ component: PolicyPage });

const STATUS_TONE: Record<PolicyStatus, "pos" | "warn" | "accent" | "fg" | "default" | "neg"> = {
  enforcing: "neg",
  "in-force": "pos",
  deadline: "warn",
  voluntary: "accent",
  proposed: "default",
};

function PolicyPage() {
  const { snap, mentions } = useIntelligence();
  const tracker = seedPolicyTracker();
  const political = mentions.filter((m) => m.topic === "policy");
  const stream = political.length ? political : snap.mentions.filter((m) => m.topic === "policy");
  const shifts = snap.shifts.filter((s) => s.topic === "policy");

  return (
    <AppShell>
      <PageHeader
        eyebrow="Politics & regulation"
        title="The rules being written around AI and quantum"
        description="Washington, Brussels, statehouses and industrial policy — enforcement clocks, export-control levers, CHIPS equity, and the PQC deadline. This is the desk that moves the tape."
        actions={
          <Link to="/signals" className="text-xs text-muted hover:text-fg">
            Open trade signals
          </Link>
        }
      />
      <TopicPills />

      <div className="mt-6 grid min-w-0 gap-4 lg:grid-cols-3">
        {shifts.map((s) => (
          <section key={s.id} className="panel rounded-xl p-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="warn">policy</Badge>
              <span className="text-xs text-subtle">
                {s.window} · {s.magnitude.toFixed(1)}×
              </span>
            </div>
            <h2 className="mt-2 font-display text-xl leading-snug">{s.headline}</h2>
            <p className="mt-2 text-sm text-muted">{s.detail}</p>
          </section>
        ))}
      </div>

      <section className="mt-6">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="font-display text-xl">Regulatory tracker</h2>
          <span className="text-xs text-subtle">{tracker.length} live files</span>
        </div>
        <div className="grid min-w-0 gap-3 lg:grid-cols-2">
          {tracker.map((item) => (
            <article key={item.id} className="panel rounded-xl p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={STATUS_TONE[item.status]}>{item.status.replaceAll("-", " ")}</Badge>
                <Badge>{item.beat}</Badge>
                <span className="text-xs text-subtle">
                  {regionLabel(item.region)} · {item.date}
                </span>
              </div>
              <h3 className="mt-2 font-display text-lg leading-snug">{item.title}</h3>
              <p className="mt-1 text-xs tracking-wide text-subtle uppercase">{item.jurisdiction}</p>
              <p className="mt-2 text-sm text-muted">{item.summary}</p>
              <p className="mt-3 text-xs text-subtle">Watch: {item.watch}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="mt-8 flex items-end justify-between">
        <h2 className="font-display text-xl">Political wire</h2>
        <span className="text-xs text-subtle">{stream.length} items</span>
      </div>
      <div className="mt-3">
        <MentionList mentions={stream.slice(0, 24)} />
      </div>
    </AppShell>
  );
}
