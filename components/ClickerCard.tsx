"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSyncExternalStore } from "react";
import { createPersistentStore } from "@/lib/hooks/usePersistentStore";
import { PiCursorClickBold } from "react-icons/pi";
import {
    FaHandPointer,
    FaHandFist,
    FaBolt,
    FaMeteor,
    FaAtom,
    FaRobot,
    FaTractor,
    FaIndustry,
} from "react-icons/fa6";
import type { IconType } from "react-icons";

// ---------------------------------------------------------------------------
// Types & data
// ---------------------------------------------------------------------------

interface ClickerState {
    count: number;
    clickPower: number;
    upgrades: Record<string, number>;
    autoClickers: Record<string, number>;
    totalAutoRate: number;
}

const defaultState: ClickerState = {
    count: 0,
    clickPower: 1,
    upgrades: {},
    autoClickers: {},
    totalAutoRate: 0,
};

interface UpgradeDef {
    id: string;
    name: string;
    icon: IconType;
    baseCost: number;
    power: number;
    kind: "click" | "auto";
}

const upgrades: UpgradeDef[] = [
    // Click power upgrades
    { id: "finger", name: "Better Finger", icon: FaHandPointer, baseCost: 50, power: 1, kind: "click" },
    { id: "double", name: "Double Click", icon: FaHandFist, baseCost: 250, power: 2, kind: "click" },
    { id: "turbo", name: "Turbo Tap", icon: FaBolt, baseCost: 1_000, power: 5, kind: "click" },
    { id: "mega", name: "Mega Press", icon: FaMeteor, baseCost: 5_000, power: 15, kind: "click" },
    { id: "quantum", name: "Quantum Click", icon: FaAtom, baseCost: 25_000, power: 50, kind: "click" },
    // Auto-clicker upgrades
    { id: "cursor", name: "Cursor Bot", icon: FaRobot, baseCost: 100, power: 1, kind: "auto" },
    { id: "farm", name: "Click Farm", icon: FaTractor, baseCost: 500, power: 5, kind: "auto" },
    { id: "factory", name: "Click Factory", icon: FaIndustry, baseCost: 2_500, power: 20, kind: "auto" },
];

function getUpgradeCost(def: UpgradeDef, owned: number): number {
    return Math.floor(def.baseCost * Math.pow(1.5, owned));
}

// ---------------------------------------------------------------------------
// Persistent store
// ---------------------------------------------------------------------------

const clickerStore = createPersistentStore<ClickerState>("clicker-state", defaultState);

// Migrate from old "clicker-count" store on first load
if (typeof window !== "undefined") {
    try {
        const old = localStorage.getItem("clicker-count");
        const hasNew = localStorage.getItem("clicker-state");
        if (old && !hasNew) {
            const oldCount = JSON.parse(old) as number;
            if (typeof oldCount === "number" && oldCount > 0) {
                const migrated: ClickerState = { ...defaultState, count: oldCount };
                clickerStore.set(migrated);
            }
            localStorage.removeItem("clicker-count");
        }
    } catch {}
}

function useClickerState(): [ClickerState, (value: ClickerState) => void] {
    const state = useSyncExternalStore(
        clickerStore.subscribe,
        clickerStore.getSnapshot,
        clickerStore.getServerSnapshot,
    );
    return [state, clickerStore.set];
}

// ---------------------------------------------------------------------------
// Module-level auto-clicker tick
// ---------------------------------------------------------------------------
// Runs outside of any component so it persists across page navigations.
// The store is a module-level singleton — once loaded, the interval keeps
// ticking even when ClickerCard unmounts.

if (typeof window !== "undefined") {
    setInterval(() => {
        const s = clickerStore.getSnapshot();
        if (s.totalAutoRate > 0) {
            const increment = s.totalAutoRate / 10;
            clickerStore.set({ ...s, count: s.count + increment });
        }
    }, 100);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function recalcDerived(state: ClickerState): ClickerState {
    let clickPower = 1;
    let totalAutoRate = 0;
    for (const def of upgrades) {
        const owned = (def.kind === "click" ? state.upgrades[def.id] : state.autoClickers[def.id]) ?? 0;
        if (def.kind === "click") {
            clickPower += def.power * owned;
        } else {
            totalAutoRate += def.power * owned;
        }
    }
    return { ...state, clickPower, totalAutoRate };
}

function popSizeClass(power: number): string {
    if (power >= 50) return "text-xl";
    if (power >= 15) return "text-lg";
    if (power >= 5) return "text-base";
    return "text-sm";
}

// ---------------------------------------------------------------------------
// Milestones
// ---------------------------------------------------------------------------

const milestones: [number, string][] = [
    [0, "Click to begin..."],
    [1, "Curious Clicker"],
    [10, "Casual Tapper"],
    [50, "Committed Clicker"],
    [100, "Centurion"],
    [250, "Habitual Hitter"],
    [500, "Click Apprentice"],
    [1_000, "Kilo Clicker"],
    [2_500, "Click Addict"],
    [5_000, "Click Wizard"],
    [10_000, "Ascended"],
    [25_000, "Click Deity"],
    [50_000, "Transcendent Tapper"],
    [100_000, "Click Singularity"],
    [500_000, "Infinity Approacher"],
    [1_000_000, "Beyond Counting"],
];

function getMilestone(count: number): string {
    let title = milestones[0][1];
    for (const [threshold, label] of milestones) {
        if (count >= threshold) title = label;
    }
    return title;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ClickerCard() {
    const [state, setState] = useClickerState();
    const [pops, setPops] = useState<{ id: number; x: number; y: number; value: number }[]>([]);
    const popId = useRef(0);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [shopOpen, setShopOpen] = useState(false);

    // Rolling manual CPS tracker (power-weighted)
    const clickLog = useRef<{ time: number; power: number }[]>([]);
    const [manualCps, setManualCps] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            clickLog.current = clickLog.current.filter(
                (e) => now - e.time < 3000,
            );
            const totalValue = clickLog.current.reduce((sum, e) => sum + e.power, 0);
            setManualCps(
                totalValue > 0
                    ? Math.round((totalValue / 3) * 10) / 10
                    : 0,
            );
        }, 200);
        return () => clearInterval(interval);
    }, []);

    const handleClick = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            setState({ ...state, count: state.count + state.clickPower });
            clickLog.current.push({ time: Date.now(), power: state.clickPower });

            // Spawn floating "+N" pop at click position relative to button
            const rect = buttonRef.current?.getBoundingClientRect();
            if (rect) {
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const id = ++popId.current;
                setPops((prev) => [...prev, { id, x, y, value: state.clickPower }]);
                setTimeout(() => {
                    setPops((prev) => prev.filter((p) => p.id !== id));
                }, 600);
            }
        },
        [state, setState],
    );

    const handleBuy = useCallback(
        (def: UpgradeDef) => {
            const owned = (def.kind === "click" ? state.upgrades[def.id] : state.autoClickers[def.id]) ?? 0;
            const cost = getUpgradeCost(def, owned);
            if (state.count < cost) return;

            const next = { ...state, count: state.count - cost };
            if (def.kind === "click") {
                next.upgrades = { ...next.upgrades, [def.id]: owned + 1 };
            } else {
                next.autoClickers = { ...next.autoClickers, [def.id]: owned + 1 };
            }
            setState(recalcDerived(next));
        },
        [state, setState],
    );

    const handleReset = useCallback(() => {
        setState({ ...defaultState });
        clickLog.current = [];
        setManualCps(0);
        setShopOpen(false);
    }, [setState]);

    const milestone = getMilestone(state.count);
    const displayCount = Math.floor(state.count);
    const totalCps = Math.round((manualCps + state.totalAutoRate) * 10) / 10;

    const clickUpgrades = upgrades.filter((u) => u.kind === "click");
    const autoUpgrades = upgrades.filter((u) => u.kind === "auto");

    return (
        <div className="border-surface1 bg-base flex flex-col gap-2 rounded-xl border p-4 shadow-lg transition-colors duration-200 hover:border-accent/50">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-text">
                    <PiCursorClickBold className="text-accent size-5" />
                    <span>Clicker</span>
                </h2>
                <button
                    onClick={handleReset}
                    className="cursor-pointer text-[10px] text-overlay1 transition-colors hover:text-red"
                    title="Reset counter"
                >
                    reset
                </button>
            </div>

            {/* Click area */}
            <button
                ref={buttonRef}
                onClick={handleClick}
                className="relative flex flex-1 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg bg-surface0/50 py-6 transition-all duration-100 select-none active:scale-[0.97] active:bg-surface0"
            >
                <span className="text-4xl font-bold tabular-nums text-text">
                    {displayCount.toLocaleString()}
                </span>
                <span className="text-xs font-medium text-accent">
                    {milestone}
                </span>

                {/* Floating +N pops */}
                {pops.map((pop) => (
                    <span
                        key={pop.id}
                        className={`pointer-events-none absolute font-bold animate-pop ${popSizeClass(pop.value)}`}
                        style={{ left: pop.x, top: pop.y, color: 'var(--color-accent)' }}
                    >
                        +{pop.value}
                    </span>
                ))}
            </button>

            {/* CPS display */}
            <p className="text-center text-[11px] tabular-nums text-overlay1">
                {totalCps > 0 ? `${totalCps} clicks/sec` : "\u00A0"}
            </p>

            {/* Shop toggle */}
            <button
                onClick={() => setShopOpen(!shopOpen)}
                className="flex cursor-pointer items-center justify-center gap-1 text-[11px] font-medium text-overlay1 transition-colors hover:text-accent"
            >
                <span
                    className={`inline-block transition-transform duration-200 ${shopOpen ? "rotate-90" : ""}`}
                >
                    ▶
                </span>
                Shop
            </button>

            {/* Collapsible shop */}
            <div
                className={`grid transition-all duration-200 ease-in-out ${shopOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
            >
                <div className="overflow-hidden">
                    <div className="flex flex-col gap-2 pt-1">
                        {/* Click power section */}
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-semibold tracking-wide text-overlay0 uppercase">
                                Power
                            </span>
                            {clickUpgrades.map((def) => (
                                <UpgradeRow
                                    key={def.id}
                                    def={def}
                                    owned={(state.upgrades[def.id] ?? 0)}
                                    count={state.count}
                                    onBuy={handleBuy}
                                />
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="border-surface1 border-t" />

                        {/* Auto-clicker section */}
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-semibold tracking-wide text-overlay0 uppercase">
                                Auto
                            </span>
                            {autoUpgrades.map((def) => (
                                <UpgradeRow
                                    key={def.id}
                                    def={def}
                                    owned={(state.autoClickers[def.id] ?? 0)}
                                    count={state.count}
                                    onBuy={handleBuy}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Upgrade row sub-component
// ---------------------------------------------------------------------------

interface UpgradeRowProps {
    def: UpgradeDef;
    owned: number;
    count: number;
    onBuy: (def: UpgradeDef) => void;
}

function UpgradeRow({ def, owned, count, onBuy }: UpgradeRowProps) {
    const cost = getUpgradeCost(def, owned);
    const canAfford = count >= cost;
    const Icon = def.icon;

    return (
        <div className="flex items-center gap-2 text-[11px]">
            <Icon className="size-3.5 shrink-0 text-subtext0" />
            <span className="min-w-0 flex-1 truncate text-subtext1" title={def.name}>
                {def.name}
            </span>
            {owned > 0 && (
                <span className="tabular-nums text-overlay1">
                    x{owned}
                </span>
            )}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onBuy(def);
                }}
                disabled={!canAfford}
                className={`shrink-0 cursor-pointer rounded px-1.5 py-0.5 tabular-nums font-medium transition-colors ${
                    canAfford
                        ? "bg-accent/15 text-accent hover:bg-accent/25"
                        : "cursor-not-allowed bg-surface0/50 text-overlay0"
                }`}
                title={`Buy ${def.name} for ${cost.toLocaleString()} clicks`}
            >
                {cost.toLocaleString()}
            </button>
        </div>
    );
}
