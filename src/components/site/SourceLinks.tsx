import { SOURCES, type SourceId } from "@/content/pcos";

/** Inline list of source links for a piece of content. */
export function SourceLinks({ ids, className = "" }: { ids: SourceId[]; className?: string }) {
  return (
    <p className={`m-0 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-500 ${className}`}>
      <span className="font-semibold uppercase tracking-[0.12em]">Source{ids.length > 1 ? "s" : ""}</span>
      {ids.map((id) => (
        <a
          key={id}
          href={SOURCES[id].url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-plum-200/80 bg-white/70 px-2.5 py-0.5 font-medium text-plum-700 transition hover:border-plum-300 hover:text-plum-900"
        >
          {SOURCES[id].short}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ))}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lede,
  id,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  id?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-plum-600">{eyebrow}</p>
      <h2 id={id} className="mt-3 font-display text-[clamp(1.9rem,4vw,2.8rem)] font-medium leading-[1.1] tracking-tight text-plum-950">
        {title}
      </h2>
      {lede && <p className="mt-4 text-base leading-relaxed text-ink-700 sm:text-lg">{lede}</p>}
    </div>
  );
}
