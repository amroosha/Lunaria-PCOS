"use client";

import Link from "next/link";

import { deleteAccountAction, logoutAction } from "@/app/actions/auth";
import type { ConversationSummary } from "@/lib/types";

interface ConversationSidebarProps {
  conversations: ConversationSummary[];
  activeId: string | null;
  userEmail: string;
  open: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onDeleteAll: () => void;
}

function formatRelative(iso: string): string {
  const date = new Date(iso);
  const diff = Date.now() - date.getTime();
  const minutes = Math.round(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

export function ConversationSidebar(props: ConversationSidebarProps) {
  const { conversations, activeId, userEmail, open, onClose, onSelect, onNew, onDelete, onDeleteAll } = props;

  const panel = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 px-4 pt-4 pb-3">
        <h2 className="m-0 text-sm font-semibold uppercase tracking-wide text-ink-500">Your conversations</h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-ink-500 hover:bg-plum-100/70 md:hidden"
          aria-label="Close conversation list"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>

      <div className="px-3">
        <button
          type="button"
          onClick={onNew}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-brand-300 bg-brand-50/60 px-3 py-2.5 text-sm font-medium text-brand-800 transition hover:bg-brand-100"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New conversation
        </button>
      </div>

      <nav className="scroll-slim mt-3 flex-1 overflow-y-auto px-3 pb-3" aria-label="Conversations">
        {conversations.length === 0 ? (
          <p className="m-0 px-2 py-6 text-center text-sm text-ink-500">
            No saved conversations yet. Only you can see what appears here.
          </p>
        ) : (
          <ul className="m-0 list-none space-y-1 p-0">
            {conversations.map((conversation) => {
              const active = conversation.id === activeId;
              return (
                <li key={conversation.id} className="group relative">
                  <button
                    type="button"
                    onClick={() => onSelect(conversation.id)}
                    className={`block w-full rounded-xl px-3 py-2 pr-9 text-left transition ${
                      active ? "bg-white shadow-sm ring-1 ring-plum-100" : "hover:bg-plum-100/60"
                    }`}
                    aria-current={active ? "true" : undefined}
                  >
                    <span className="block truncate text-sm font-medium text-ink-900">{conversation.title}</span>
                    <span className="block text-xs text-ink-300">{formatRelative(conversation.updatedAt)}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(conversation.id)}
                    className="absolute top-1/2 right-1.5 -translate-y-1/2 rounded-lg p-1.5 text-ink-300 opacity-0 transition group-hover:opacity-100 hover:bg-coral-50 hover:text-coral-600 focus:opacity-100"
                    aria-label={`Delete conversation "${conversation.title}"`}
                  >
                    <TrashIcon />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </nav>

      <div className="border-t border-plum-100/80 px-4 py-3 text-xs text-ink-500">
        <p className="m-0 truncate font-medium text-ink-700" title={userEmail}>
          {userEmail}
        </p>
        <p className="mt-0.5 mb-2">Saved privately to your account.</p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {conversations.length > 0 && (
            <button type="button" onClick={onDeleteAll} className="text-coral-600 hover:underline">
              Delete all
            </button>
          )}
          <form action={logoutAction}>
            <button type="submit" className="hover:text-plum-900 hover:underline">
              Sign out
            </button>
          </form>
          <form
            action={deleteAccountAction}
            onSubmit={(event) => {
              if (!window.confirm("Delete your account and every saved conversation? This cannot be undone.")) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit" className="hover:text-coral-700 hover:underline">
              Delete account
            </button>
          </form>
          <Link href="/privacy" className="hover:text-plum-900 hover:underline">
            Privacy
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop column */}
      <aside className="hidden w-72 shrink-0 border-r border-plum-100/80 bg-plum-50/60 md:block">{panel}</aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true" aria-label="Your conversations">
          <button type="button" className="absolute inset-0 bg-plum-900/40" aria-label="Close" onClick={onClose} />
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-xs bg-[#f7f3ea] shadow-2xl">{panel}</div>
        </div>
      )}
    </>
  );
}
