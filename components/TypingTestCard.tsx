"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSyncExternalStore } from "react";
import { createPersistentStore } from "@/lib/hooks/usePersistentStore";
import { PiKeyboardBold } from "react-icons/pi";

const bestWpmStore = createPersistentStore<number>("typing-best-wpm", 0);

function useBestWpm(): [number, (value: number) => void] {
    const wpm = useSyncExternalStore(
        bestWpmStore.subscribe,
        bestWpmStore.getSnapshot,
        bestWpmStore.getServerSnapshot,
    );
    return [wpm, bestWpmStore.set];
}

const snippets = [
    'const add = (a: number, b: number) => a + b;',
    'function greet(name: string) { return `Hello, ${name}!`; }',
    'const nums = [1, 2, 3].map((n) => n * 2);',
    'export default function App() { return <h1>Hello</h1>; }',
    'const [count, setCount] = useState(0);',
    'type Result<T> = { ok: true; value: T } | { ok: false };',
    'const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));',
    'for (const key of Object.keys(obj)) { console.log(key); }',
    'const unique = [...new Set(items)];',
    'if (err instanceof Error) throw err;',
];

type Phase = "idle" | "typing" | "done";

export default function TypingTestCard() {
    const [bestWpm, setBestWpm] = useBestWpm();
    const [phase, setPhase] = useState<Phase>("idle");
    const [snippet, setSnippet] = useState(() => snippets[0]);
    const [typed, setTyped] = useState("");
    const [startTime, setStartTime] = useState(0);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const inputRef = useRef<HTMLInputElement>(null);
    const errorCount = useRef(0);

    const pickSnippet = useCallback(() => {
        const next = snippets[Math.floor(Math.random() * snippets.length)];
        return next;
    }, []);

    const startNew = useCallback(() => {
        setSnippet(pickSnippet());
        setTyped("");
        setPhase("idle");
        setWpm(0);
        setAccuracy(100);
        errorCount.current = 0;
        // Focus the hidden input after state settles
        setTimeout(() => inputRef.current?.focus(), 0);
    }, [pickSnippet]);

    // Initialize with a random snippet on mount
    useEffect(() => {
        setSnippet(pickSnippet());
    }, [pickSnippet]);

    const handleInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;

            // Start timer on first character
            if (phase === "idle" && value.length === 1) {
                setPhase("typing");
                setStartTime(Date.now());
            }

            if (phase === "done") return;

            setTyped(value);

            // Count errors for this keystroke
            if (value.length > typed.length) {
                const i = value.length - 1;
                if (i < snippet.length && value[i] !== snippet[i]) {
                    errorCount.current++;
                }
            }

            // Check completion
            if (value.length >= snippet.length) {
                const elapsed = (Date.now() - startTime) / 1000 / 60; // minutes
                const charCount = snippet.length;
                const calculatedWpm =
                    elapsed > 0 ? Math.round(charCount / 5 / elapsed) : 0;
                const totalKeystrokes = value.length;
                const calculatedAccuracy =
                    totalKeystrokes > 0
                        ? Math.round(
                              ((totalKeystrokes - errorCount.current) /
                                  totalKeystrokes) *
                                  100,
                          )
                        : 100;

                setWpm(calculatedWpm);
                setAccuracy(calculatedAccuracy);
                setPhase("done");

                if (calculatedWpm > bestWpm) {
                    setBestWpm(calculatedWpm);
                }
            }
        },
        [phase, typed, snippet, startTime, bestWpm, setBestWpm],
    );

    // Focus input when card is clicked
    const handleCardClick = useCallback(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <div
            onClick={handleCardClick}
            className="border-surface1 bg-base flex flex-col gap-3 rounded-xl border p-4 shadow-lg transition-colors duration-200 hover:border-accent/50 md:col-span-2 cursor-text"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-text">
                    <PiKeyboardBold className="text-accent size-5" />
                    <span>Typing Test</span>
                </h2>
                <div className="flex items-center gap-3">
                    {bestWpm > 0 && (
                        <span className="text-[10px] text-overlay1">
                            best: {bestWpm} wpm
                        </span>
                    )}
                    {phase === "done" && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                startNew();
                            }}
                            className="cursor-pointer text-[10px] text-accent transition-colors hover:text-text"
                        >
                            try again
                        </button>
                    )}
                </div>
            </div>

            {/* Snippet display */}
            <div className="rounded-lg bg-surface0/50 px-3 py-4 font-mono text-sm leading-relaxed">
                {snippet.split("").map((char, i) => {
                    let colorClass = "text-overlay1";
                    if (i < typed.length) {
                        colorClass =
                            typed[i] === char ? "text-green" : "text-red bg-red/10";
                    }
                    // Cursor at current position
                    const isCursor =
                        i === typed.length && phase !== "done";

                    return (
                        <span
                            key={i}
                            className={`${colorClass} ${isCursor ? "border-accent border-l-2" : ""}`}
                        >
                            {char}
                        </span>
                    );
                })}
            </div>

            {/* Hidden input */}
            <input
                ref={inputRef}
                type="text"
                value={typed}
                onChange={handleInput}
                className="sr-only"
                aria-label="Type the snippet shown above"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                disabled={phase === "done"}
            />

            {/* Status bar */}
            <div className="flex items-center justify-between text-[11px] text-overlay1">
                {phase === "idle" && (
                    <span className="text-subtext0">
                        Click here and start typing...
                    </span>
                )}
                {phase === "typing" && (
                    <span className="text-subtext0">
                        {typed.length}/{snippet.length} characters
                    </span>
                )}
                {phase === "done" && (
                    <>
                        <span className="font-semibold text-accent">
                            {wpm} WPM
                        </span>
                        <span>
                            {accuracy}% accuracy
                        </span>
                    </>
                )}
            </div>
        </div>
    );
}
