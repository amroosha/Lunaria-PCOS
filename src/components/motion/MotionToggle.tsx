"use client";

import { useCallback, useSyncExternalStore } from "react";

const KEY = "lunaria:motion";
const listeners = new Set<() => void>();

function readPreference(): boolean {
  const attr = document.documentElement.getAttribute("data-motion");
  if (attr === "reduced") return true;
  if (attr === "full") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  return () => {
    listeners.delete(callback);
    media.removeEventListener("change", callback);
  };
}

function getServerSnapshot() {
  return false;
}

/** Lets visitors switch animations off (or on, overriding the system default). */
export function MotionToggle({ className = "" }: { className?: string }) {
  const reduced = useSyncExternalStore(subscribe, readPreference, getServerSnapshot);

  const toggle = useCallback(() => {
    const value = reduced ? "full" : "reduced";
    document.documentElement.setAttribute("data-motion", value);
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* storage unavailable */
    }
    listeners.forEach((listener) => listener());
  }, [reduced]);

  return (
    <button
      type="button"
      onClick={toggle}
      role="switch"
      aria-checked={reduced}
      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-plum-200/80 bg-white/70 px-3 py-1.5 text-xs font-medium text-ink-700 transition hover:border-plum-300 hover:text-plum-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-plum-400 ${className}`}
      title="Turn gentle animations on or off"
    >
      <span
        className={`relative inline-block h-4 w-7 rounded-full transition ${reduced ? "bg-plum-500" : "bg-plum-200"}`}
        aria-hidden="true"
      >
        <span
          className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition-transform ${reduced ? "translate-x-3.5" : "translate-x-0.5"}`}
        />
      </span>
      <span>{reduced ? "Reduced motion on" : "Reduce motion"}</span>
    </button>
  );
}
