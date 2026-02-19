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

const words = [
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "i",
    "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
    "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
    "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
    "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
    "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
    "people", "into", "year", "your", "good", "some", "could", "them", "see", "other",
    "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
    "back", "after", "use", "two", "how", "our", "work", "first", "well", "way",
    "even", "new", "want", "because", "any", "these", "give", "day", "most", "us",
    "great", "between", "need", "large", "under", "never", "same", "last", "long", "much",
    "right", "where", "before", "must", "home", "big", "high", "end", "still", "each",
    "old", "life", "tell", "write", "become", "here", "show", "house", "both", "again",
    "off", "turn", "real", "leave", "might", "part", "point", "own", "place", "world",
    "around", "small", "while", "found", "keep", "move", "every", "hand", "light", "help",
    "thought", "through", "city", "head", "open", "start", "night", "close", "such", "kind",
    "begin", "next", "live", "walk", "change", "hard", "play", "run", "read", "name",
    "let", "down", "line", "school", "number", "away", "ask", "may", "thing", "man",
    "should", "few", "water", "been", "call", "far", "until", "try", "enough", "set",
    "child", "side", "put", "form", "too", "state", "stand", "very", "often", "fact",
    "feel", "group", "early", "girl", "eye", "face", "many", "young", "story", "hold",
    "later", "always", "many", "best", "better", "love", "power", "study", "learn", "grow",
    "plant", "food", "fish", "earth", "tree", "body", "mind", "room", "heart", "door",
    "stop", "wait", "plan", "table", "love", "sure", "watch", "color", "above", "book",
    "music", "paper", "ready", "idea", "land", "along", "river", "fire", "care", "voice",
    "rest", "deep", "fast", "warm", "able", "free", "strong", "word", "clear", "near",
    "dark", "past", "road", "game", "half", "order", "field", "air", "south", "north",
    "east", "west", "sleep", "class", "piece", "carry", "break", "drive", "cross", "draw",
    "build", "horse", "white", "black", "bring", "front", "quite", "happy", "today", "blue",
    "full", "green", "simple", "reach", "team", "boat", "teach", "pull", "less", "more",
];

function generateWords(count: number): string {
    const result: string[] = [];
    for (let i = 0; i < count; i++) {
        result.push(words[Math.floor(Math.random() * words.length)]);
    }
    return result.join(" ");
}

const WORD_COUNT = 25;

type Phase = "idle" | "typing" | "done";

export default function TypingTestCard() {
    const [bestWpm, setBestWpm] = useBestWpm();
    const [phase, setPhase] = useState<Phase>("idle");
    const [text, setText] = useState("");
    const [typed, setTyped] = useState("");
    const [startTime, setStartTime] = useState(0);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const inputRef = useRef<HTMLInputElement>(null);
    const errorCount = useRef(0);

    // Regenerate words on mount so SSR/client mismatch is avoided
    useEffect(() => {
        setText(generateWords(WORD_COUNT));
    }, []);

    const startNew = useCallback(() => {
        setText(generateWords(WORD_COUNT));
        setTyped("");
        setPhase("idle");
        setWpm(0);
        setAccuracy(100);
        errorCount.current = 0;
        setTimeout(() => inputRef.current?.focus(), 0);
    }, []);

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
                if (i < text.length && value[i] !== text[i]) {
                    errorCount.current++;
                }
            }

            // Check completion
            if (value.length >= text.length) {
                const elapsed = (Date.now() - startTime) / 1000 / 60;
                const charCount = text.length;
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
        [phase, typed, text, startTime, bestWpm, setBestWpm],
    );

    // Focus input when card is clicked
    const handleCardClick = useCallback(() => {
        inputRef.current?.focus();
    }, []);

    // Split text into words for display
    const textWords = text.split(" ");
    let charIndex = 0;

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

            {/* Word display */}
            <div className="rounded-lg bg-surface0/50 px-3 py-4 font-mono text-sm leading-loose">
                {textWords.map((word, wi) => {
                    const wordStart = charIndex;
                    charIndex += word.length + (wi < textWords.length - 1 ? 1 : 0);

                    return (
                        <span key={wi} className="inline">
                            {word.split("").map((char, ci) => {
                                const absIndex = wordStart + ci;
                                let colorClass = "text-overlay1";
                                if (absIndex < typed.length) {
                                    colorClass =
                                        typed[absIndex] === char
                                            ? "text-text"
                                            : "text-red bg-red/10";
                                }
                                const isCursor =
                                    absIndex === typed.length && phase !== "done";

                                return (
                                    <span
                                        key={ci}
                                        className={`${colorClass} ${isCursor ? "border-accent border-l-2" : ""}`}
                                    >
                                        {char}
                                    </span>
                                );
                            })}
                            {/* Space after word */}
                            {wi < textWords.length - 1 && (() => {
                                const spaceIndex = wordStart + word.length;
                                let spaceClass = "text-overlay1";
                                if (spaceIndex < typed.length) {
                                    spaceClass =
                                        typed[spaceIndex] === " "
                                            ? "text-text"
                                            : "text-red bg-red/10";
                                }
                                const isSpaceCursor =
                                    spaceIndex === typed.length && phase !== "done";

                                return (
                                    <span
                                        className={`${spaceClass} ${isSpaceCursor ? "border-accent border-l-2" : ""}`}
                                    >
                                        {" "}
                                    </span>
                                );
                            })()}
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
                aria-label="Type the words shown above"
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
                    <span className="text-subtext0">typing...</span>
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
