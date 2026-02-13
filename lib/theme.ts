import { useSyncExternalStore } from "react";
import { createPersistentStore } from "./hooks/usePersistentStore";

// --- Palettes ---
export const paletteNames = ['latte', 'frappe', 'macchiato', 'mocha'] as const;
export type PaletteName = (typeof paletteNames)[number];

// Create stores
export const paletteStore = createPersistentStore<PaletteName>(
  "palette",
  "mocha",
  paletteNames,
);

// Hook to use it
export function usePalette() {
  const palette = useSyncExternalStore(
    paletteStore.subscribe,
    paletteStore.getSnapshot,
    paletteStore.getServerSnapshot,
  );
  return [palette, paletteStore.set] as const;
}

// --- Accent Colors ---
export const accentColorNames = [
	'rosewater',
	'flamingo',
	'pink',
	'mauve',
	'red',
	'maroon',
	'peach',
	'yellow',
	'green',
	'teal',
	'sky',
	'sapphire',
	'blue',
	'lavender'
] as const;
export type AccentColorName = (typeof accentColorNames)[number];

export const accentStore = createPersistentStore<AccentColorName>(
  "accent",
  "mauve",
  accentColorNames,
);

export function useAccent() {
  const accent = useSyncExternalStore(
    accentStore.subscribe,
    accentStore.getSnapshot,
    accentStore.getServerSnapshot,
  );
  return [accent, accentStore.set] as const;
}
