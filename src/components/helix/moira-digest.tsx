import { Link } from "@tanstack/react-router";
import { digestDateLabel, MOIRA_DIGEST } from "@/lib/helix/moira-digest";
import { cn } from "@/lib/utils";

export function MoiraDigestCard({ variant = "full" }: { variant?: "full" | "teaser" }) {
  const d = MOIRA_DIGEST;
  const dated = digestDateLabel();
  const grafs = variant === "teaser" ? d.grafs.slice(0, 2) : d.grafs;

  return (
    <article
      className={cn(
        "panel relative overflow-hidden rounded-xl",
        variant === "full" ? "p-6 md:p-8" : "p-5",
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-px bg-warn/50"
      />
      <p className="text-xs tracking-[0.18em] text-warn uppercase">{d.kicker}</p>
      <p className="mt-1 text-xs text-subtle">
        {dated}
        <span className="mx-2 text-border-strong">·</span>
        {d.byline}
      </p>
      <h2
        className={cn(
          "mt-3 font-display italic leading-[1.15] text-fg",
          variant === "full" ? "text-3xl md:text-4xl" : "text-2xl",
        )}
      >
        {d.headline}
      </h2>
      <div className="mt-4 max-w-3xl space-y-3">
        {grafs.map((g) => (
          <p key={g.slice(0, 32)} className="font-display text-base leading-relaxed text-muted italic">
            {g}
          </p>
        ))}
      </div>
      {variant === "teaser" ? (
        <Link
          to="/brief"
          className="mt-5 inline-flex min-h-11 items-center text-sm text-fg underline-offset-4 hover:underline"
        >
          Continue the digest
        </Link>
      ) : (
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {d.watch.map((item) => (
            <li key={item.title} className="border-t border-border pt-3">
              <p className="text-xs tracking-[0.16em] text-subtle uppercase">Watch</p>
              <h3 className="mt-1 font-display text-lg italic">{item.title}</h3>
              <p className="mt-1 text-sm text-muted">{item.body}</p>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
