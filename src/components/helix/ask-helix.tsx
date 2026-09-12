import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { askHelixFn } from "@/lib/helix/api";

const PROMPTS = [
  "Where did the IonQ Bitcoin story actually travel?",
  "What did Washington and Brussels actually do on AI this month?",
  "Which quantum names are a policy bid versus a retail fade?",
  "What should a comms lead watch in the next 48 hours?",
];

export function AskHelix({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const mut = useMutation({
    mutationFn: (q: string) => askHelixFn({ data: { question: q } }),
    onSuccess: (res) => {
      if (res.ok) setAnswer(res.text);
      else setAnswer(res.error);
    },
  });

  function submit(q: string) {
    const next = q.trim();
    if (!next) return;
    setQuestion(next);
    setAnswer(null);
    mut.mutate(next);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent title="Ask Helix" className="max-w-lg">
        <p className="mb-4 text-sm text-muted">
          Helix reads today's AI, quantum and policy coverage, then answers as a desk analyst. Questions stay on this
          machine.
        </p>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            submit(question);
          }}
        >
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={4}
            placeholder="Ask about coverage, sentiment, competitors, or a narrative shift…"
            className="w-full resize-none rounded-lg bg-elevated px-3 py-2.5 text-sm text-fg shadow-[var(--shadow-border)] placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
          <Button type="submit" disabled={mut.isPending} className="w-full">
            {mut.isPending ? "Reading the stream…" : "Ask Helix"}
          </Button>
        </form>
        <div className="mt-5 flex flex-col gap-2">
          {PROMPTS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => submit(p)}
              className="rounded-md bg-elevated px-3 py-2.5 text-left text-sm text-muted transition-colors hover:text-fg"
            >
              {p}
            </button>
          ))}
        </div>
        {answer ? (
          <div className="mt-6 rounded-lg bg-elevated p-4 text-sm leading-relaxed text-fg/90">{answer}</div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
