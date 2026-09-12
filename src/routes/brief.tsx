import { createFileRoute } from "@tanstack/react-router";
import { MoiraDigestCard } from "@/components/helix/moira-digest";
import { AppShell, PageHeader } from "@/components/layout/app-shell";
import { TopicPills } from "@/components/layout/filters";

export const Route = createFileRoute("/brief")({ component: BriefPage });

function BriefPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Daily briefing"
        title="What the desk is wearing to the wires"
        description="A short digest of AI, quantum, regulation and the tape — read, as requested, in the register of a certain cabaret legend. The facts are the desk's; the wigs are hers."
      />
      <TopicPills />
      <div className="mt-6">
        <MoiraDigestCard />
      </div>
    </AppShell>
  );
}
