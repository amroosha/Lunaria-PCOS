"use client";

import { useState } from "react";

import { Reveal } from "@/components/motion/Reveal";
import { AskButton } from "@/components/site/AskButton";
import { MealPhoto } from "@/components/site/MealPhoto";
import { SectionHeading, SourceLinks } from "@/components/site/SourceLinks";
import {
  DAY_NAMES,
  DAY_SHORT,
  EATING_PRINCIPLES,
  MEAL_BY_ID,
  MEAL_OPTIONS,
  MEAL_PLANS,
  PLAN_NOTE,
  SLOT_LABELS,
  SLOT_ORDER,
  swapOptionsFor,
  type MealOption,
  type MealPlanDef,
  type MealSlot,
  type PlanId,
} from "@/content/meals";

/** Matches the photo column widths so the browser downloads the right size. */
const PHOTO_SIZES = "(min-width: 1024px) 20rem, (min-width: 768px) 16rem, calc(100vw - 2.5rem)";

type Overrides = Record<string, string>;

const overrideKey = (plan: PlanId, day: number, slot: MealSlot) => `${plan}:${day}:${slot}`;

function SwapIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 7h13l-3-3M20 17H7l3 3" />
    </svg>
  );
}

function MealCard({
  slot,
  meal,
  swapped,
  swapCount,
  onSwap,
  onUndo,
  photoOnRight,
}: {
  slot: MealSlot;
  meal: MealOption;
  swapped: boolean;
  swapCount: number;
  onSwap: () => void;
  onUndo: () => void;
  photoOnRight: boolean;
}) {
  return (
    <article
      className={`lift grid gap-4 rounded-[1.75rem] border bg-white/85 p-3 shadow-sm sm:p-4 md:items-center ${
        swapped ? "border-sage-300" : "border-plum-100"
      } ${
        photoOnRight
          ? "md:grid-cols-[minmax(0,1fr)_16rem] lg:grid-cols-[minmax(0,1fr)_20rem]"
          : "md:grid-cols-[16rem_minmax(0,1fr)] lg:grid-cols-[20rem_minmax(0,1fr)]"
      }`}
    >
      <figure className={`relative m-0 aspect-[4/3] w-full overflow-hidden rounded-[1.25rem] bg-cream-200 ${photoOnRight ? "md:order-2" : ""}`}>
        <MealPhoto key={meal.image.src} photo={meal.image} alt={meal.alt} sizes={PHOTO_SIZES} />
      </figure>

      <div className="flex min-w-0 flex-col px-2 pb-2 sm:px-3 sm:pb-3 md:py-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="m-0 text-xs font-semibold uppercase tracking-[0.14em] text-coral-600">{SLOT_LABELS[slot]}</p>
          {swapped && (
            <span className="rounded-full bg-sage-100 px-2 py-0.5 text-[11px] font-semibold text-sage-700">Swapped</span>
          )}
          {!meal.vegetarian && (
            <span className="rounded-full border border-plum-100 bg-white px-2 py-0.5 text-[11px] font-medium text-ink-500">Contains fish or meat</span>
          )}
        </div>
        <h4 className="mt-1.5 font-display text-lg font-medium leading-snug text-plum-950 sm:text-xl">{meal.title}</h4>
        <p className="mt-2 text-sm leading-relaxed text-ink-700">{meal.description}</p>

        <ul className="m-0 mt-3 flex list-none flex-wrap gap-1.5 p-0" aria-label="What makes it balanced">
          {meal.balance.map((item) => (
            <li key={item} className="rounded-full border border-sage-200 bg-sage-50 px-2.5 py-1 text-xs font-medium text-sage-700">
              {item}
            </li>
          ))}
        </ul>

        <p className="mt-3 text-sm leading-relaxed text-ink-500">
          <span className="font-semibold text-plum-700">Tip: </span>
          {meal.tip}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onSwap}
            disabled={swapCount < 2}
            className="inline-flex items-center gap-1.5 rounded-full border border-plum-200 bg-white px-3.5 py-2 text-sm font-semibold text-plum-800 transition hover:border-plum-400 hover:bg-plum-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-plum-400 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={`Swap ${SLOT_LABELS[slot].toLowerCase()} for a different option`}
          >
            <SwapIcon />
            Swap meal
          </button>
          {swapped && (
            <button type="button" onClick={onUndo} className="rounded-full px-3 py-2 text-sm font-medium text-ink-500 hover:text-plum-900 hover:underline underline-offset-4">
              Back to the plan&apos;s pick
            </button>
          )}
          <span className="ml-auto">
            <AskButton variant="link" prompt={`Can you explain what makes this meal balanced and how I could adapt it: ${meal.title}?`} icon={false}>
              Ask about this meal →
            </AskButton>
          </span>
        </div>
      </div>
    </article>
  );
}

export function MealPlan() {
  const [planId, setPlanId] = useState<PlanId>("everyday");
  const [dayIndex, setDayIndex] = useState(0);
  const [overrides, setOverrides] = useState<Overrides>({});
  const [listCopied, setListCopied] = useState(false);

  const plan = MEAL_PLANS.find((p) => p.id === planId) ?? MEAL_PLANS[0];

  const mealFor = (p: MealPlanDef, day: number, slot: MealSlot): MealOption => {
    const id = overrides[overrideKey(p.id, day, slot)] ?? p.days[day][slot];
    return MEAL_BY_ID[id] ?? MEAL_OPTIONS[0];
  };

  const swap = (slot: MealSlot) => {
    const options = swapOptionsFor(plan, slot);
    if (options.length < 2) return;
    const current = mealFor(plan, dayIndex, slot);
    const next = options[(options.findIndex((m) => m.id === current.id) + 1) % options.length];
    const key = overrideKey(plan.id, dayIndex, slot);
    setOverrides((prev) => {
      const copy = { ...prev };
      if (next.id === plan.days[dayIndex][slot]) delete copy[key];
      else copy[key] = next.id;
      return copy;
    });
  };

  const undo = (slot: MealSlot) => {
    const key = overrideKey(plan.id, dayIndex, slot);
    setOverrides((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const planSwapCount = Object.keys(overrides).filter((k) => k.startsWith(`${plan.id}:`)).length;

  const resetPlan = () =>
    setOverrides((prev) => Object.fromEntries(Object.entries(prev).filter(([k]) => !k.startsWith(`${plan.id}:`))));

  const copyShoppingList = async () => {
    const text = [
      `Shopping list — ${plan.name} (Lunaria)`,
      ...plan.shoppingList.flatMap((group) => ["", `${group.group}:`, ...group.items.map((item) => `- ${item}`)]),
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setListCopied(true);
      setTimeout(() => setListCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  const todaysMeals = SLOT_ORDER.map((slot) => ({ slot, meal: mealFor(plan, dayIndex, slot) }));

  return (
    <section id="eating-well" className="relative scroll-mt-24 py-20 sm:py-28" aria-labelledby="meal-plans-title">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="blob animate-drift-slow absolute top-24 left-[-10rem] h-[24rem] w-[24rem] bg-sage-100/80 [animation-delay:-16s]" />
        <div className="blob animate-drift-slower absolute right-[-8rem] bottom-32 h-[22rem] w-[22rem] bg-coral-100/60" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            id="meal-plans-title"
            eyebrow="Eating well with PCOS"
            title="7-Day Meal Plans You Can Mix and Match"
            lede="Three example weeks, each with breakfast, lunch, dinner and an optional snack for all seven days. Pick the plan that suits how you like to cook, then swap any meal for another to add variety. They're built from flexible, affordable ingredients, include vegetarian choices throughout, and follow the 2023 international PCOS guideline: no one diet composition has been shown to beat another, so the best plan is one you enjoy and can sustain."
          />
        </Reveal>

        {/* Principles */}
        <Reveal delay={60}>
          <ul className="m-0 mt-10 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {EATING_PRINCIPLES.map((principle, index) => (
              <li key={principle.id} className="flex flex-col rounded-[1.5rem] border border-plum-100 bg-white/75 p-5 shadow-sm">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sage-100 font-display text-sm font-semibold text-sage-700">
                  {index + 1}
                </span>
                <h3 className="mt-3 font-display text-lg font-medium leading-snug text-plum-950">{principle.title}</h3>
                <p className="mt-1.5 mb-3 flex-1 text-sm leading-relaxed text-ink-700">{principle.body}</p>
                <SourceLinks ids={principle.sources} />
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Plan switcher */}
        <Reveal delay={80}>
          <div className="mt-12" role="radiogroup" aria-label="Choose a meal plan">
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-plum-600">Step 1 · Choose a plan</p>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {MEAL_PLANS.map((p) => {
                const active = p.id === planId;
                return (
                  <button
                    key={p.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => {
                      setPlanId(p.id);
                      setDayIndex(0);
                    }}
                    className={`flex h-full flex-col rounded-[1.5rem] border p-5 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-plum-400 ${
                      active ? "border-plum-700 bg-plum-900 text-cream-50 shadow-[0_24px_48px_-28px_rgba(33,20,37,0.7)]" : "border-plum-100 bg-white/80 text-plum-950 hover:border-plum-300"
                    }`}
                  >
                    <span className="font-display text-xl font-medium">{p.name}</span>
                    <span className={`mt-1.5 text-sm leading-relaxed ${active ? "text-lilac-100/90" : "text-ink-700"}`}>{p.tagline}</span>
                    <span className="mt-3 flex flex-wrap gap-1.5">
                      {p.badges.map((badge) => (
                        <span
                          key={badge}
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${active ? "bg-white/15 text-cream-50" : "bg-sage-50 text-sage-700 ring-1 ring-sage-200"}`}
                        >
                          {badge}
                        </span>
                      ))}
                    </span>
                  </button>
                );
              })}
            </div>
            <p key={plan.id} className="mt-4 max-w-3xl animate-fade-up text-[0.95rem] leading-relaxed text-ink-700">{plan.description}</p>
          </div>
        </Reveal>

        {/* Day tabs + meals */}
        <Reveal delay={100}>
          <div className="mt-10">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-plum-600">Step 2 · Pick a day, then swap anything you like</p>
              {planSwapCount > 0 && (
                <button type="button" onClick={resetPlan} className="text-sm font-medium text-ink-500 hover:text-plum-900 hover:underline underline-offset-4">
                  Reset {planSwapCount} swap{planSwapCount === 1 ? "" : "s"} in this plan
                </button>
              )}
            </div>
            <div role="tablist" aria-label="Day of the week" className="mt-3 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]">
              {DAY_NAMES.map((name, index) => {
                const active = index === dayIndex;
                return (
                  <button
                    key={name}
                    role="tab"
                    aria-selected={active}
                    aria-controls="meal-day-panel"
                    type="button"
                    onClick={() => setDayIndex(index)}
                    className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-plum-400 ${
                      active ? "border-plum-700 bg-plum-700 text-cream-50 shadow-sm" : "border-plum-100 bg-white/70 text-ink-700 hover:border-plum-300 hover:text-plum-900"
                    }`}
                  >
                    <span className="sm:hidden">{DAY_SHORT[index]}</span>
                    <span className="hidden sm:inline">{name}</span>
                  </button>
                );
              })}
            </div>

            <div id="meal-day-panel" role="tabpanel" key={`${plan.id}-${dayIndex}`} className="animate-fade-up mt-4">
              <h3 className="m-0 font-display text-2xl font-medium text-plum-950">
                {DAY_NAMES[dayIndex]} <span className="text-ink-500">· {plan.name}</span>
              </h3>
              <ol className="m-0 mt-4 list-none space-y-5 p-0">
                {todaysMeals.map(({ slot, meal }, index) => {
                  const key = overrideKey(plan.id, dayIndex, slot);
                  return (
                    <li key={slot}>
                      <MealCard
                        slot={slot}
                        meal={meal}
                        swapped={Boolean(overrides[key])}
                        swapCount={swapOptionsFor(plan, slot).length}
                        onSwap={() => swap(slot)}
                        onUndo={() => undo(slot)}
                        photoOnRight={index % 2 === 1}
                      />
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </Reveal>

        {/* Week at a glance */}
        <Reveal delay={60}>
          <div className="mt-10 rounded-[1.75rem] border border-plum-100 bg-white/80 p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="m-0 font-display text-xl font-medium text-plum-950">The whole week at a glance</h3>
              <p className="m-0 text-xs text-ink-500">Tap a day to open it. Swapped meals are marked •</p>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[40rem] border-separate border-spacing-0 text-left text-sm">
                <thead>
                  <tr>
                    <th scope="col" className="pb-2 pr-3 text-xs font-semibold uppercase tracking-wide text-plum-600">Day</th>
                    {SLOT_ORDER.map((slot) => (
                      <th key={slot} scope="col" className="pb-2 pr-3 text-xs font-semibold uppercase tracking-wide text-plum-600">
                        {SLOT_LABELS[slot]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {plan.days.map((_, day) => {
                    const active = day === dayIndex;
                    return (
                      <tr key={day} className={active ? "bg-lilac-50/80" : ""}>
                        <th scope="row" className="rounded-l-xl border-t border-plum-100 py-2.5 pr-3 pl-2 align-top font-semibold text-plum-900">
                          <button type="button" onClick={() => setDayIndex(day)} className="rounded hover:underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-plum-400">
                            {DAY_SHORT[day]}
                          </button>
                        </th>
                        {SLOT_ORDER.map((slot, i) => {
                          const meal = mealFor(plan, day, slot);
                          const swapped = Boolean(overrides[overrideKey(plan.id, day, slot)]);
                          return (
                            <td key={slot} className={`border-t border-plum-100 py-2.5 pr-3 align-top leading-snug text-ink-700 ${i === SLOT_ORDER.length - 1 ? "rounded-r-xl" : ""}`}>
                              <button type="button" onClick={() => setDayIndex(day)} className="text-left hover:text-plum-900 hover:underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-plum-400">
                                {swapped && <span className="text-sage-600" aria-label="swapped">• </span>}
                                {meal.title}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>

        {/* Shopping list + substitutions */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Reveal delay={60}>
            <div className="flex h-full flex-col rounded-[1.75rem] border border-plum-200 bg-plum-900 p-6 text-cream-50 shadow-[0_30px_60px_-30px_rgba(33,20,37,0.6)] sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="m-0 text-xs font-semibold uppercase tracking-[0.14em] text-lilac-300">Shopping list</p>
                  <h3 className="mt-1 font-display text-2xl font-medium">{plan.name}</h3>
                </div>
                <button
                  type="button"
                  onClick={copyShoppingList}
                  className="inline-flex items-center gap-2 rounded-full bg-cream-50 px-4 py-2 text-sm font-semibold text-plum-900 transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-lilac-300"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="9" y="9" width="11" height="11" rx="2" />
                    <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                  </svg>
                  {listCopied ? "Copied" : "Copy list"}
                </button>
              </div>
              <div className="mt-5 grid gap-5 sm:grid-cols-3">
                {plan.shoppingList.map((group) => (
                  <div key={group.group}>
                    <h4 className="m-0 text-sm font-semibold text-lilac-200">{group.group}</h4>
                    <ul className="m-0 mt-2 list-none space-y-1.5 p-0 text-sm leading-snug text-cream-100/90">
                      {group.items.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-coral-300" aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="mt-5 mb-0 text-xs leading-relaxed text-lilac-200/70">
                A short list for the plan as written — adjust for the swaps you make, what&apos;s already in your cupboard, and what&apos;s on offer.
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="flex h-full flex-col rounded-[1.75rem] border border-plum-100 bg-white/85 p-6 shadow-sm sm:p-7">
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.14em] text-coral-600">Practical substitutions</p>
              <h3 className="mt-1 font-display text-2xl font-medium text-plum-950">Make it work for you</h3>
              <dl className="m-0 mt-4 divide-y divide-plum-100">
                {plan.substitutions.map((sub) => (
                  <div key={sub.instead} className="grid gap-1 py-3 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-4">
                    <dt className="text-sm font-semibold text-plum-800">Instead of {sub.instead.charAt(0).toLowerCase() + sub.instead.slice(1)}</dt>
                    <dd className="m-0 text-sm leading-relaxed text-ink-700">{sub.use}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-auto pt-4">
                <AskButton variant="ghost" prompt={`I'm looking at the "${plan.name}" example meal plan. Can you suggest more swaps for my preferences, and what questions I should bring to a dietitian?`}>
                  Ask about adapting this plan
                </AskButton>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Note */}
        <Reveal delay={60}>
          <div className="mt-8 rounded-[1.75rem] border border-lilac-200 bg-gradient-to-br from-lilac-50 via-white to-sage-50 p-6 shadow-sm sm:p-8">
            <h3 className="m-0 font-display text-xl font-medium text-plum-950 sm:text-2xl">{PLAN_NOTE.title}</h3>
            {PLAN_NOTE.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="mt-3 text-[0.95rem] leading-relaxed text-ink-700">
                {paragraph}
              </p>
            ))}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <SourceLinks ids={PLAN_NOTE.sources} />
              <AskButton variant="ghost" prompt="How can I find a registered dietitian who understands PCOS, and what should I ask them?">
                Ask about finding a dietitian
              </AskButton>
            </div>
          </div>
        </Reveal>

        <p className="mt-6 text-xs leading-relaxed text-ink-500">
          Photos via Pexels:{" "}
          {Array.from(new Map(MEAL_OPTIONS.map((meal) => [meal.credit.url, meal.credit])).values()).map((credit, index, all) => (
            <span key={credit.url}>
              <a href={credit.url} target="_blank" rel="noopener noreferrer" className="hover:text-plum-800 hover:underline underline-offset-4">
                {credit.name}
              </a>
              {index < all.length - 1 ? ", " : "."}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
