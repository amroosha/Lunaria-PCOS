"use client";

import { useId, useState } from "react";

import { Reveal } from "@/components/motion/Reveal";
import { AskButton } from "@/components/site/AskButton";
import { SectionHeading, SourceLinks } from "@/components/site/SourceLinks";
import { DIAGNOSIS_RULE, EXPLAINER_STEPS, type ExplainerStep } from "@/content/pcos";

const TONE_COLORS: Record<ExplainerStep["tone"], { stroke: string; soft: string; text: string; chip: string }> = {
  lilac: { stroke: "#b49bd1", soft: "#efe8f6", text: "text-plum-700", chip: "bg-lilac-100 text-plum-800 border-lilac-200" },
  coral: { stroke: "#f0a58f", soft: "#fdf3ef", text: "text-coral-700", chip: "bg-coral-50 text-coral-700 border-coral-200" },
  sage: { stroke: "#92ad84", soft: "#f3f7f1", text: "text-sage-700", chip: "bg-sage-50 text-sage-700 border-sage-200" },
  plum: { stroke: "#7f5c87", soft: "#f6f1f8", text: "text-plum-800", chip: "bg-plum-100 text-plum-800 border-plum-200" },
};

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, start: number, end: number) {
  const s = polar(cx, cy, r, start);
  const e = polar(cx, cy, r, end);
  const large = end - start > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

const RING = [
  { id: "ovulation" as const, start: 8, end: 112, label: "Ovulation" },
  { id: "androgens" as const, start: 128, end: 232, label: "Androgens" },
  { id: "ovaries" as const, start: 248, end: 352, label: "Ovaries" },
];

function Diagram({ active }: { active: ExplainerStep["id"] }) {
  const cx = 160;
  const cy = 160;
  const r = 112;
  const insulinActive = active === "insulin";

  return (
    <svg viewBox="0 0 320 320" className="h-full w-full" role="img" aria-label="Diagram of the three features used to recognise PCOS, with insulin's influence in the centre">
      <defs>
        <radialGradient id="explainer-core" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f6f1f8" />
        </radialGradient>
      </defs>

      <circle cx={cx} cy={cy} r={r + 26} fill="url(#explainer-core)" opacity="0.9" />

      {RING.map((segment) => {
        const step = EXPLAINER_STEPS.find((s) => s.id === segment.id)!;
        const tone = TONE_COLORS[step.tone];
        const isActive = active === segment.id;
        const mid = polar(cx, cy, r + 40, (segment.start + segment.end) / 2);
        return (
          <g key={segment.id} style={{ transition: "opacity 0.4s ease" }} opacity={isActive || insulinActive ? 1 : 0.42}>
            <path
              d={arcPath(cx, cy, r, segment.start, segment.end)}
              stroke={tone.stroke}
              strokeWidth={isActive ? 30 : 18}
              strokeLinecap="round"
              fill="none"
              style={{ transition: "stroke-width 0.45s cubic-bezier(0.2,0.7,0.2,1)" }}
            />
            <text
              x={mid.x}
              y={mid.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-plum-900"
              style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.04em" }}
            >
              {segment.label}
            </text>
          </g>
        );
      })}

      {/* Insulin's influence */}
      <circle
        cx={cx}
        cy={cy}
        r={insulinActive ? 64 : 54}
        fill={insulinActive ? "#7f5c87" : "#ffffff"}
        stroke="#7f5c87"
        strokeWidth={insulinActive ? 0 : 1.5}
        strokeDasharray={insulinActive ? undefined : "4 5"}
        style={{ transition: "all 0.45s cubic-bezier(0.2,0.7,0.2,1)" }}
      />
      {[20, 140, 260].map((deg) => {
        const from = polar(cx, cy, 70, deg);
        const to = polar(cx, cy, 92, deg);
        return (
          <line
            key={deg}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="#7f5c87"
            strokeWidth={2}
            strokeLinecap="round"
            opacity={insulinActive ? 1 : 0.35}
            style={{ transition: "opacity 0.4s ease" }}
          />
        );
      })}
      <text
        x={cx}
        y={cy - 4}
        textAnchor="middle"
        style={{ fontSize: 13, fontWeight: 700, fill: insulinActive ? "#fdfbf7" : "#553b5b", transition: "fill 0.4s" }}
      >
        Insulin
      </text>
      <text x={cx} y={cy + 13} textAnchor="middle" style={{ fontSize: 10, fill: insulinActive ? "#efe8f6" : "#6f6274", transition: "fill 0.4s" }}>
        for many people
      </text>
    </svg>
  );
}

const STRIP_DAYS = 180;
// Illustrative only: dots mark bleeds across six months in a typical regular pattern vs an irregular one.
const REGULAR_MARKS = [2, 30, 58, 86, 114, 142, 170];
const IRREGULAR_MARKS = [4, 56, 118, 165];

function CycleRow({ label, marks, color }: { label: string; marks: number[]; color: string }) {
  return (
    <div>
      <p className="m-0 mb-1.5 text-xs font-medium text-ink-700">{label}</p>
      <div className="relative h-3 rounded-full bg-plum-100/80">
        {marks.map((day) => (
          <span
            key={day}
            className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white"
            style={{ left: `${(day / STRIP_DAYS) * 100}%`, background: color }}
          />
        ))}
      </div>
    </div>
  );
}

function CycleStrip() {
  return (
    <div className="mt-5 space-y-3 rounded-2xl border border-plum-100 bg-white/70 p-4">
      <CycleRow label="A typical pattern — a bleed roughly every 4 weeks" marks={REGULAR_MARKS} color="#9a7cbd" />
      <CycleRow label="One possible PCOS pattern — longer, unpredictable gaps" marks={IRREGULAR_MARKS} color="#e58068" />
      <p className="m-0 text-[11px] text-ink-500">Illustration only. Patterns vary widely from person to person.</p>
    </div>
  );
}

export function PcosExplainer() {
  const [active, setActive] = useState<ExplainerStep["id"]>("ovulation");
  const step = EXPLAINER_STEPS.find((s) => s.id === active)!;
  const tone = TONE_COLORS[step.tone];
  const baseId = useId();

  return (
    <section id="explainer" className="relative scroll-mt-24 py-20 sm:py-28" aria-labelledby="explainer-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            id="explainer-title"
            eyebrow="PCOS, in simple terms"
            title="Three features, one condition — and insulin in the background."
            lede="PCOS is a common hormonal condition. Doctors look for three features; most people have some but not all of them, and they change over time. Tap each one to see what it means."
          />
        </Reveal>

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal delay={80} className="mx-auto w-full max-w-md lg:sticky lg:top-28">
            <div className="aspect-square rounded-[2rem] border border-white/70 bg-white/60 p-4 shadow-[0_30px_60px_-30px_rgba(66,45,72,0.35)] backdrop-blur">
              <Diagram active={active} />
            </div>
          </Reveal>

          <Reveal delay={160}>
            <div role="tablist" aria-label="PCOS features" className="flex flex-wrap gap-2">
              {EXPLAINER_STEPS.map((s) => {
                const isActive = s.id === active;
                const t = TONE_COLORS[s.tone];
                return (
                  <button
                    key={s.id}
                    role="tab"
                    id={`${baseId}-tab-${s.id}`}
                    aria-selected={isActive}
                    aria-controls={`${baseId}-panel`}
                    type="button"
                    onClick={() => setActive(s.id)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-plum-400 ${
                      isActive ? `${t.chip} shadow-sm` : "border-plum-100 bg-white/60 text-ink-700 hover:border-plum-200 hover:bg-white"
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>

            <div
              id={`${baseId}-panel`}
              role="tabpanel"
              aria-labelledby={`${baseId}-tab-${step.id}`}
              className="mt-5 rounded-[1.75rem] border border-plum-100 bg-white/80 p-6 shadow-sm sm:p-8"
              style={{ background: `linear-gradient(135deg, ${tone.soft}, rgba(255,255,255,0.9) 60%)` }}
            >
              <h3 key={step.id} className="m-0 font-display text-2xl font-medium text-plum-950 animate-fade-up">
                {step.title}
              </h3>
              <p className="mt-3 text-[1.02rem] leading-relaxed text-ink-700">{step.body}</p>
              <p className={`mt-4 flex items-start gap-2 text-sm font-medium ${tone.text}`}>
                <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
                </svg>
                {step.takeaway}
              </p>
              {step.id === "ovulation" && <CycleStrip />}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <SourceLinks ids={step.sources} />
                <AskButton variant="ghost" prompt={`Can you explain this in simple terms: ${step.title.toLowerCase()} in PCOS?`}>
                  Ask about this
                </AskButton>
              </div>
            </div>

            <div className="mt-5 rounded-[1.75rem] border border-sage-200 bg-sage-50/70 p-6 sm:p-7">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex h-11 min-w-11 items-center justify-center rounded-full bg-sage-600 px-3 font-display text-lg font-semibold text-cream-50">
                  2 / 3
                </span>
                <h3 className="m-0 font-display text-xl font-medium text-plum-950">{DIAGNOSIS_RULE.title}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-700 sm:text-[0.95rem]">{DIAGNOSIS_RULE.body}</p>
              <SourceLinks ids={DIAGNOSIS_RULE.sources} className="mt-4" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
