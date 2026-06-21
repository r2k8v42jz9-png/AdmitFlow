"use client";

import { useSyncExternalStore } from "react";

/** Reason drives the upgrade modal's contextual headline/copy. */
export type UpgradeReason = "mentor-limit" | "chance-limit" | "premium-feature" | "generic";

interface UpgradeState {
  open: boolean;
  reason: UpgradeReason;
}

let state: UpgradeState = { open: false, reason: "generic" };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function openUpgrade(reason: UpgradeReason = "generic") {
  state = { open: true, reason };
  emit();
}
export function closeUpgrade() {
  state = { ...state, open: false };
  emit();
}

const serverSnap: UpgradeState = { open: false, reason: "generic" };

export function useUpgrade(): UpgradeState {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state,
    () => serverSnap,
  );
}
