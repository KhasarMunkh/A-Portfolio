"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSyncExternalStore } from "react";
import { createPersistentStore } from "@/lib/hooks/usePersistentStore";
import { PiCursorClickBold } from "react-icons/pi";
import {
    FaHandPointer,
    FaLaptopCode,
    FaServer,
    FaDatabase,
    FaIndustry,
    FaBrain,
    FaAtom,
    FaArrowUp,
} from "react-icons/fa6";
import type { IconType } from "react-icons";

// ---------------------------------------------------------------------------
// Types & data — Buildings
// ---------------------------------------------------------------------------

interface BuildingDef {
    id: string;
    name: string;
    description: string;
    icon: IconType;
    baseCost: number;
    baseCps: number;
}

const buildingDefs: BuildingDef[] = [
    { id: "cursor",       name: "Cursor Bot",        description: "Autoclicks once every 10 seconds.",                               icon: FaHandPointer, baseCost: 15,         baseCps: 0.1 },
    { id: "dev",          name: "Developer",         description: "Writes scripts that click for you.",                              icon: FaLaptopCode,  baseCost: 100,        baseCps: 1 },
    { id: "server",       name: "Server Farm",       description: "Racks of servers clicking around the clock.",                     icon: FaServer,      baseCost: 1_100,      baseCps: 8 },
    { id: "mine",         name: "Data Mine",         description: "Digs deep into data to extract clicks.",                          icon: FaDatabase,    baseCost: 12_000,     baseCps: 47 },
    { id: "clickfactory", name: "Click Factory",     description: "Produces clicks with industrial efficiency.",                     icon: FaIndustry,    baseCost: 130_000,    baseCps: 260 },
    { id: "bank",         name: "Neural Bank",       description: "Stores and compounds clicks at interest.",                        icon: FaBrain,       baseCost: 1_400_000,  baseCps: 1_400 },
    { id: "temple",       name: "Quantum Temple",    description: "Harnesses quantum superposition to click in parallel universes.", icon: FaAtom,        baseCost: 20_000_000, baseCps: 7_800 },
];

function getBuildingCost(def: BuildingDef, owned: number): number {
    return Math.ceil(def.baseCost * Math.pow(1.15, owned));
}

// ---------------------------------------------------------------------------
// Types & data — Upgrades
// ---------------------------------------------------------------------------

interface UpgradeDef {
    id: string;
    name: string;
    icon: IconType;
    cost: number;
    description: string;
    kind: "building" | "click";
    buildingId?: string;
    unlockCondition: (state: ClickerState) => boolean;
}

const upgradeDefs: UpgradeDef[] = [
    // --- Cursor Bot tiers ---
    { id: "cursor-t1", name: "Carpal Tunnel Prevention", icon: FaArrowUp, cost: 100,
      description: "Cursor Bots are twice as efficient", kind: "building", buildingId: "cursor",
      unlockCondition: (s) => (s.buildings["cursor"] ?? 0) >= 1 },
    { id: "cursor-t2", name: "Ambidextrous", icon: FaArrowUp, cost: 500,
      description: "Cursor Bots are twice as efficient", kind: "building", buildingId: "cursor",
      unlockCondition: (s) => (s.buildings["cursor"] ?? 0) >= 10 },
    { id: "cursor-t3", name: "Thousand Fingers", icon: FaArrowUp, cost: 10_000,
      description: "Cursor Bots are twice as efficient", kind: "building", buildingId: "cursor",
      unlockCondition: (s) => (s.buildings["cursor"] ?? 0) >= 50 },

    // --- Developer tiers ---
    { id: "dev-t1", name: "Pair Programming", icon: FaArrowUp, cost: 1_000,
      description: "Developers are twice as efficient", kind: "building", buildingId: "dev",
      unlockCondition: (s) => (s.buildings["dev"] ?? 0) >= 1 },
    { id: "dev-t2", name: "Code Review", icon: FaArrowUp, cost: 5_000,
      description: "Developers are twice as efficient", kind: "building", buildingId: "dev",
      unlockCondition: (s) => (s.buildings["dev"] ?? 0) >= 10 },
    { id: "dev-t3", name: "10x Engineer", icon: FaArrowUp, cost: 100_000,
      description: "Developers are twice as efficient", kind: "building", buildingId: "dev",
      unlockCondition: (s) => (s.buildings["dev"] ?? 0) >= 50 },

    // --- Server Farm tiers ---
    { id: "server-t1", name: "Load Balancer", icon: FaArrowUp, cost: 11_000,
      description: "Server Farms are twice as efficient", kind: "building", buildingId: "server",
      unlockCondition: (s) => (s.buildings["server"] ?? 0) >= 1 },
    { id: "server-t2", name: "Auto-Scaling", icon: FaArrowUp, cost: 55_000,
      description: "Server Farms are twice as efficient", kind: "building", buildingId: "server",
      unlockCondition: (s) => (s.buildings["server"] ?? 0) >= 10 },
    { id: "server-t3", name: "Edge Computing", icon: FaArrowUp, cost: 1_100_000,
      description: "Server Farms are twice as efficient", kind: "building", buildingId: "server",
      unlockCondition: (s) => (s.buildings["server"] ?? 0) >= 50 },

    // --- Data Mine tiers ---
    { id: "mine-t1", name: "Better Algorithms", icon: FaArrowUp, cost: 120_000,
      description: "Data Mines are twice as efficient", kind: "building", buildingId: "mine",
      unlockCondition: (s) => (s.buildings["mine"] ?? 0) >= 1 },
    { id: "mine-t2", name: "Parallel Processing", icon: FaArrowUp, cost: 600_000,
      description: "Data Mines are twice as efficient", kind: "building", buildingId: "mine",
      unlockCondition: (s) => (s.buildings["mine"] ?? 0) >= 10 },
    { id: "mine-t3", name: "Deep Learning", icon: FaArrowUp, cost: 12_000_000,
      description: "Data Mines are twice as efficient", kind: "building", buildingId: "mine",
      unlockCondition: (s) => (s.buildings["mine"] ?? 0) >= 50 },

    // --- Click Factory tiers ---
    { id: "clickfactory-t1", name: "Assembly Line", icon: FaArrowUp, cost: 1_300_000,
      description: "Click Factories are twice as efficient", kind: "building", buildingId: "clickfactory",
      unlockCondition: (s) => (s.buildings["clickfactory"] ?? 0) >= 1 },
    { id: "clickfactory-t2", name: "Automation", icon: FaArrowUp, cost: 6_500_000,
      description: "Click Factories are twice as efficient", kind: "building", buildingId: "clickfactory",
      unlockCondition: (s) => (s.buildings["clickfactory"] ?? 0) >= 10 },
    { id: "clickfactory-t3", name: "Mass Production", icon: FaArrowUp, cost: 130_000_000,
      description: "Click Factories are twice as efficient", kind: "building", buildingId: "clickfactory",
      unlockCondition: (s) => (s.buildings["clickfactory"] ?? 0) >= 50 },

    // --- Neural Bank tiers ---
    { id: "bank-t1", name: "Neural Networks", icon: FaArrowUp, cost: 14_000_000,
      description: "Neural Banks are twice as efficient", kind: "building", buildingId: "bank",
      unlockCondition: (s) => (s.buildings["bank"] ?? 0) >= 1 },
    { id: "bank-t2", name: "Self-Improvement", icon: FaArrowUp, cost: 70_000_000,
      description: "Neural Banks are twice as efficient", kind: "building", buildingId: "bank",
      unlockCondition: (s) => (s.buildings["bank"] ?? 0) >= 10 },
    { id: "bank-t3", name: "Compound Interest", icon: FaArrowUp, cost: 1_400_000_000,
      description: "Neural Banks are twice as efficient", kind: "building", buildingId: "bank",
      unlockCondition: (s) => (s.buildings["bank"] ?? 0) >= 50 },

    // --- Quantum Temple tiers ---
    { id: "temple-t1", name: "Superposition", icon: FaArrowUp, cost: 200_000_000,
      description: "Quantum Temples are twice as efficient", kind: "building", buildingId: "temple",
      unlockCondition: (s) => (s.buildings["temple"] ?? 0) >= 1 },
    { id: "temple-t2", name: "Entanglement", icon: FaArrowUp, cost: 1_000_000_000,
      description: "Quantum Temples are twice as efficient", kind: "building", buildingId: "temple",
      unlockCondition: (s) => (s.buildings["temple"] ?? 0) >= 10 },
    { id: "temple-t3", name: "Wave Collapse", icon: FaArrowUp, cost: 20_000_000_000,
      description: "Quantum Temples are twice as efficient", kind: "building", buildingId: "temple",
      unlockCondition: (s) => (s.buildings["temple"] ?? 0) >= 50 },

    // --- Click upgrades (each adds +1% CpS to clicks) ---
    { id: "click-1", name: "Reinforced Finger", icon: FaHandPointer, cost: 1_000,
      description: "Clicking gains +1% of your CpS", kind: "click",
      unlockCondition: (s) => s.totalCps >= 100 },
    { id: "click-2", name: "Steel Finger", icon: FaHandPointer, cost: 50_000,
      description: "Clicking gains +1% of your CpS", kind: "click",
      unlockCondition: (s) => s.totalCps >= 1_000 },
    { id: "click-3", name: "Titanium Finger", icon: FaHandPointer, cost: 5_000_000,
      description: "Clicking gains +1% of your CpS", kind: "click",
      unlockCondition: (s) => s.totalCps >= 10_000 },
];

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

interface ClickerState {
    count: number;
    buildings: Record<string, number>;
    purchasedUpgrades: Record<string, true>;
    totalCps: number;
}

const defaultState: ClickerState = {
    count: 0,
    buildings: {},
    purchasedUpgrades: {},
    totalCps: 0,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function recalcDerived(state: ClickerState): ClickerState {
    let totalCps = 0;
    for (const def of buildingDefs) {
        const owned = state.buildings[def.id] ?? 0;
        if (owned === 0) continue;
        const tiers = upgradeDefs.filter(
            (u) => u.kind === "building" && u.buildingId === def.id && state.purchasedUpgrades[u.id],
        ).length;
        totalCps += def.baseCps * owned * Math.pow(2, tiers);
    }
    return { ...state, totalCps };
}

function getClickPower(state: ClickerState): number {
    const clickUpgradeCount = upgradeDefs.filter(
        (u) => u.kind === "click" && state.purchasedUpgrades[u.id],
    ).length;
    const clickPercent = 0.01 * (1 + clickUpgradeCount);
    return Math.round((1 + state.totalCps * clickPercent) * 10) / 10;
}

function getBuildingEffectiveCps(def: BuildingDef, state: ClickerState): number {
    const owned = state.buildings[def.id] ?? 0;
    if (owned === 0) return 0;
    const tiers = upgradeDefs.filter(
        (u) => u.kind === "building" && u.buildingId === def.id && state.purchasedUpgrades[u.id],
    ).length;
    return def.baseCps * owned * Math.pow(2, tiers);
}

function popSizeClass(power: number): string {
    if (power >= 100) return "text-xl";
    if (power >= 25) return "text-lg";
    if (power >= 5) return "text-base";
    return "text-sm";
}

function formatNumber(n: number): string {
    if (n >= 1_000_000_000_000_000) return `${(n / 1_000_000_000_000_000).toFixed(1)}Q`;
    if (n >= 1_000_000_000_000) return `${(n / 1_000_000_000_000).toFixed(1)}T`;
    if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
    if (n >= 10_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    return n.toLocaleString();
}

// ---------------------------------------------------------------------------
// Persistent store
// ---------------------------------------------------------------------------

const clickerStore = createPersistentStore<ClickerState>("clicker-state", defaultState);

// IDs from previous building sets that no longer exist
const legacyBuildingIds = ["farm", "factory", "quantum", "singularity", "overlord"];

// Migrate from old state formats on first load
if (typeof window !== "undefined") {
    try {
        const raw = localStorage.getItem("clicker-state");
        if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed) {
                // v1 format: had upgrades/autoClickers/clickPower (original)
                if ("upgrades" in parsed || "autoClickers" in parsed || "clickPower" in parsed) {
                    const migrated: ClickerState = { ...defaultState, count: Math.floor(parsed.count ?? 0) };
                    clickerStore.set(recalcDerived(migrated));
                }
                // v2/v3 format: has buildings — check for legacy IDs from old building sets
                else if ("buildings" in parsed) {
                    const blds = parsed.buildings as Record<string, number> | undefined;
                    const hasLegacy = blds && legacyBuildingIds.some((id) => id in blds);
                    if (hasLegacy || !("purchasedUpgrades" in parsed)) {
                        // Preserve count, reset buildings + upgrades (IDs no longer match)
                        const migrated: ClickerState = { ...defaultState, count: parsed.count ?? 0 };
                        clickerStore.set(recalcDerived(migrated));
                    }
                }
            }
        } else {
            // Migrate from ancient "clicker-count" store
            const old = localStorage.getItem("clicker-count");
            if (old) {
                const oldCount = JSON.parse(old) as number;
                if (typeof oldCount === "number" && oldCount > 0) {
                    clickerStore.set({ ...defaultState, count: oldCount });
                }
                localStorage.removeItem("clicker-count");
            }
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
        if (s.totalCps > 0) {
            const increment = s.totalCps / 10;
            clickerStore.set({ ...s, count: s.count + increment });
        }
    }, 100);
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

// ---------------------------------------------------------------------------
// Tooltip types
// ---------------------------------------------------------------------------

type TooltipData =
    | { kind: "building"; def: BuildingDef; owned: number; effectiveCps: number; perUnit: number }
    | { kind: "upgrade"; def: UpgradeDef };

export default function ClickerCard() {
    const [state, setState] = useClickerState();
    const [pops, setPops] = useState<{ id: number; x: number; y: number; value: number }[]>([]);
    const popId = useRef(0);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const [shopOpen, setShopOpen] = useState(false);

    // Tooltip state — rendered at card level to escape overflow-hidden
    const [tooltip, setTooltip] = useState<{ data: TooltipData; top: number; left: number } | null>(null);

    const showTooltip = useCallback((data: TooltipData, rowEl: HTMLElement) => {
        const card = cardRef.current;
        if (!card) return;
        const cardRect = card.getBoundingClientRect();
        const rowRect = rowEl.getBoundingClientRect();
        setTooltip({
            data,
            top: rowRect.bottom - cardRect.top,
            left: rowRect.left - cardRect.left,
        });
    }, []);

    const hideTooltip = useCallback(() => setTooltip(null), []);

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
            const power = getClickPower(state);
            setState({ ...state, count: state.count + power });
            clickLog.current.push({ time: Date.now(), power });

            // Spawn floating "+N" pop at click position relative to button
            const rect = buttonRef.current?.getBoundingClientRect();
            if (rect) {
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const id = ++popId.current;
                setPops((prev) => [...prev, { id, x, y, value: power }]);
                setTimeout(() => {
                    setPops((prev) => prev.filter((p) => p.id !== id));
                }, 600);
            }
        },
        [state, setState],
    );

    const handleBuyBuilding = useCallback(
        (def: BuildingDef) => {
            const owned = state.buildings[def.id] ?? 0;
            const cost = getBuildingCost(def, owned);
            if (state.count < cost) return;

            const next: ClickerState = {
                ...state,
                count: state.count - cost,
                buildings: { ...state.buildings, [def.id]: owned + 1 },
            };
            setState(recalcDerived(next));
        },
        [state, setState],
    );

    const handleBuyUpgrade = useCallback(
        (def: UpgradeDef) => {
            if (state.purchasedUpgrades[def.id]) return;
            if (state.count < def.cost) return;

            const next: ClickerState = {
                ...state,
                count: state.count - def.cost,
                purchasedUpgrades: { ...state.purchasedUpgrades, [def.id]: true },
            };
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
    const cpsDisplay = Math.round(state.totalCps * 10) / 10;

    // Visible upgrades: unlocked + not yet purchased
    const visibleUpgrades = upgradeDefs.filter(
        (u) => !state.purchasedUpgrades[u.id] && u.unlockCondition(state),
    );

    return (
        <div ref={cardRef} className="relative border-surface1 bg-base flex flex-col gap-2 rounded-xl border p-4 shadow-lg transition-colors duration-200 hover:border-accent/50">
            {/* Card-level tooltip — rendered outside overflow-hidden shop */}
            {tooltip && (
                <div
                    className="pointer-events-none absolute z-20 w-52 rounded-lg border border-surface1 bg-mantle p-2.5 shadow-lg"
                    style={{ top: tooltip.top + 6, left: tooltip.left }}
                >
                    {tooltip.data.kind === "building" ? (
                        <>
                            <p className="text-[11px] font-semibold text-text">{tooltip.data.def.name}</p>
                            <p className="mt-0.5 text-[10px] italic text-overlay1">{tooltip.data.def.description}</p>
                            <div className="mt-1.5 border-t border-surface1 pt-1.5 text-[10px] text-subtext0">
                                <p>each produces <span className="font-medium text-accent">{tooltip.data.perUnit < 10 ? tooltip.data.perUnit.toFixed(1) : formatNumber(Math.floor(tooltip.data.perUnit))}</span> CpS</p>
                                {tooltip.data.owned > 0 && (
                                    <p>{tooltip.data.owned} producing <span className="font-medium text-accent">{tooltip.data.effectiveCps < 10 ? tooltip.data.effectiveCps.toFixed(1) : formatNumber(Math.floor(tooltip.data.effectiveCps))}</span>/sec total</p>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="text-[11px] font-semibold text-text">{tooltip.data.def.name}</p>
                            <p className="mt-0.5 text-[10px] italic text-overlay1">{tooltip.data.def.description}</p>
                            <div className="mt-1.5 border-t border-surface1 pt-1.5 text-[10px] text-subtext0">
                                <p>Cost: <span className="font-medium text-yellow">{formatNumber(tooltip.data.def.cost)}</span></p>
                            </div>
                        </>
                    )}
                </div>
            )}

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
                    {formatNumber(displayCount)}
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
                        +{pop.value < 10_000_000 ? pop.value % 1 === 0 ? pop.value.toLocaleString() : pop.value.toFixed(1) : formatNumber(pop.value)}
                    </span>
                ))}
            </button>

            {/* CPS display */}
            <p className="text-center text-[11px] tabular-nums text-overlay1">
                {cpsDisplay > 0 ? `${formatNumber(cpsDisplay)}/sec` : "\u00A0"}
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
                        {/* Upgrades section — only when there are unlocked unpurchased upgrades */}
                        {visibleUpgrades.length > 0 && (
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-semibold tracking-wide text-overlay0 uppercase">
                                    Upgrades
                                </span>
                                {visibleUpgrades.map((def) => (
                                    <UpgradeRow
                                        key={def.id}
                                        def={def}
                                        count={state.count}
                                        onBuy={handleBuyUpgrade}
                                        onHover={showTooltip}
                                        onLeave={hideTooltip}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Divider — only when both sections visible */}
                        {visibleUpgrades.length > 0 && (
                            <div className="border-surface1 border-t" />
                        )}

                        {/* Buildings section */}
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-semibold tracking-wide text-overlay0 uppercase">
                                Buildings
                            </span>
                            {buildingDefs.map((def) => (
                                <BuildingRow
                                    key={def.id}
                                    def={def}
                                    owned={state.buildings[def.id] ?? 0}
                                    effectiveCps={getBuildingEffectiveCps(def, state)}
                                    count={state.count}
                                    onBuy={handleBuyBuilding}
                                    onHover={showTooltip}
                                    onLeave={hideTooltip}
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
// Building row sub-component
// ---------------------------------------------------------------------------

interface BuildingRowProps {
    def: BuildingDef;
    owned: number;
    effectiveCps: number;
    count: number;
    onBuy: (def: BuildingDef) => void;
    onHover: (data: TooltipData, rowEl: HTMLElement) => void;
    onLeave: () => void;
}

function BuildingRow({ def, owned, effectiveCps, count, onBuy, onHover, onLeave }: BuildingRowProps) {
    const cost = getBuildingCost(def, owned);
    const canAfford = count >= cost;
    const Icon = def.icon;
    const perUnit = owned > 0 ? effectiveCps / owned : def.baseCps;

    return (
        <div
            className="flex items-center gap-2 text-[11px]"
            onMouseEnter={(e) => onHover({ kind: "building", def, owned, effectiveCps, perUnit }, e.currentTarget)}
            onMouseLeave={onLeave}
        >
            <Icon className="size-3.5 shrink-0 text-subtext0" />
            <div className="min-w-0 flex-1">
                <span className="truncate text-subtext1">
                    {def.name}
                </span>
                {effectiveCps > 0 && (
                    <span className="ml-1 text-[9px] text-overlay0">
                        ({effectiveCps < 10 ? effectiveCps.toFixed(1) : formatNumber(Math.floor(effectiveCps))}/s)
                    </span>
                )}
            </div>
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
            >
                {formatNumber(cost)}
            </button>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Upgrade row sub-component
// ---------------------------------------------------------------------------

interface UpgradeRowProps {
    def: UpgradeDef;
    count: number;
    onBuy: (def: UpgradeDef) => void;
    onHover: (data: TooltipData, rowEl: HTMLElement) => void;
    onLeave: () => void;
}

function UpgradeRow({ def, count, onBuy, onHover, onLeave }: UpgradeRowProps) {
    const canAfford = count >= def.cost;
    const building = def.buildingId ? buildingDefs.find((b) => b.id === def.buildingId) : undefined;
    const Icon = building ? building.icon : def.icon;

    return (
        <div
            className="flex items-center gap-2 text-[11px]"
            onMouseEnter={(e) => onHover({ kind: "upgrade", def }, e.currentTarget)}
            onMouseLeave={onLeave}
        >
            <Icon className="size-3.5 shrink-0 text-yellow" />
            <span className="min-w-0 flex-1 truncate text-subtext1">
                {def.name}
            </span>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onBuy(def);
                }}
                disabled={!canAfford}
                className={`shrink-0 cursor-pointer rounded px-1.5 py-0.5 tabular-nums font-medium transition-colors ${
                    canAfford
                        ? "bg-yellow/15 text-yellow hover:bg-yellow/25"
                        : "cursor-not-allowed bg-surface0/50 text-overlay0"
                }`}
            >
                {formatNumber(def.cost)}
            </button>
        </div>
    );
}
