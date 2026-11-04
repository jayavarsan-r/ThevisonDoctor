import type { Status, Verified } from "@/content/types";

/**
 * Draft gating (BUILD_PROMPT §9.2). Safe to import from client components.
 * Production builds never render draft items or unverified values unless
 * NEXT_PUBLIC_SHOW_DRAFTS is exactly "true" (preview deployments only).
 */
export const showDrafts = process.env.NEXT_PUBLIC_SHOW_DRAFTS === "true";

export function isVisible(item: { status: Status }) {
  return item.status === "published" || showDrafts;
}

export function onlyVisible<T extends { status: Status }>(items: T[]): T[] {
  return items.filter(isVisible);
}

/** A value that passed the gate, flagged when it is only shown as a draft. */
export type Gated<T> = { value: T; draft: boolean };

export function gate<T>(v: Verified<T> | undefined | null): Gated<T> | null {
  if (!v) return null;
  if (v.verified) return { value: v.value, draft: false };
  return showDrafts ? { value: v.value, draft: true } : null;
}

export function gateAll<T>(values: Verified<T>[]): Gated<T>[] {
  return values.map((v) => gate(v)).filter((v): v is Gated<T> => v !== null);
}
