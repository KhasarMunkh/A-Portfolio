"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSyncExternalStore } from "react";
import { createPersistentStore } from "@/lib/hooks/usePersistentStore";
import { PiCursorClickBold } from "react-icons/pi";

const clickStore = createPersistentStore<number>("clicker-count", 0);

function useClicks(): [number, (value: number) => void] {
    const count = useSyncExternalStore(
        clickStore.subscribe,
        clickStore.getSnapshot,
        clickStore.getServerSnapshot,
    );
    return [count, clickStore.set];
}

const milestones: [number, string][] = [
    [0, "Click to begin..."],
    [1, "Curious Clicker"],
    [10, "Casual Tapper"],
    [50, "Committed Clicker"],
    [100, "Centurion"],
    [250, "Habitual Hitter"],
    [500, "Click Apprentice"],
    [1000, "Kilo Clicker"],
    [2500, "Click Addict"],
    [5000, "Click Wizard"],
    [10000, "Ascended"],
];

function getMilestone(count: number): string {
    let title = milestones[0][1];
    for (const [threshold, label] of milestones) {
        if (count >= threshold) title = label;
    }
    return title;
}

export default function ClickerCard() {
    const [count, setCount] = useClicks();
    const [pops, setPops] = useState<{ id: number; x: number; y: number }[]>(
        [],
    );
    const popId = useRef(0);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Rolling CPS tracker
    const clickTimestamps = useRef<number[]>([]);
    const [cps, setCps] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            clickTimestamps.current = clickTimestamps.current.filter(
                (t) => now - t < 3000,
            );
            setCps(
                clickTimestamps.current.length > 0
                    ? Math.round((clickTimestamps.current.length / 3) * 10) /
                          10
                    : 0,
            );
        }, 200);
        return () => clearInterval(interval);
    }, []);

    const handleClick = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            setCount(count + 1);
            clickTimestamps.current.push(Date.now());

            // Spawn a floating "+1" pop at click position relative to button
            const rect = buttonRef.current?.getBoundingClientRect();
            if (rect) {
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const id = ++popId.current;
                setPops((prev) => [...prev, { id, x, y }]);
                setTimeout(() => {
                    setPops((prev) => prev.filter((p) => p.id !== id));
                }, 600);
            }
        },
        [count, setCount],
    );

    const handleReset = useCallback(() => {
        setCount(0);
        clickTimestamps.current = [];
        setCps(0);
    }, [setCount]);

    const milestone = getMilestone(count);

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
                    {count.toLocaleString()}
                </span>
                <span className="text-xs font-medium text-accent">
                    {milestone}
                </span>

                {/* Floating +1 pops */}
                {pops.map((pop) => (
                    <span
                        key={pop.id}
                        className="pointer-events-none absolute text-sm font-bold text-accent animate-pop"
                        style={{ left: pop.x, top: pop.y }}
                    >
                        +1
                    </span>
                ))}
            </button>

            {/* CPS display */}
            <p className="text-center text-[11px] tabular-nums text-overlay1">
                {cps > 0 ? `${cps} clicks/sec` : "\u00A0"}
            </p>
        </div>
    );
}
