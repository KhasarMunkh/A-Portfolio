"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PiMusicNotesBold } from "react-icons/pi";

interface Pad {
    label: string;
    key: string;
    frequency: number;
    color: string;
    type: OscillatorType;
    decay: number;
}

const pads: Pad[] = [
    { label: "C4", key: "q", frequency: 261.63, color: "var(--catppuccin-color-red)", type: "sine", decay: 0.4 },
    { label: "D4", key: "w", frequency: 293.66, color: "var(--catppuccin-color-peach)", type: "sine", decay: 0.4 },
    { label: "E4", key: "e", frequency: 329.63, color: "var(--catppuccin-color-yellow)", type: "sine", decay: 0.4 },
    { label: "F4", key: "a", frequency: 349.23, color: "var(--catppuccin-color-green)", type: "triangle", decay: 0.35 },
    { label: "G4", key: "s", frequency: 392.0, color: "var(--catppuccin-color-teal)", type: "triangle", decay: 0.35 },
    { label: "A4", key: "d", frequency: 440.0, color: "var(--catppuccin-color-sapphire)", type: "triangle", decay: 0.35 },
    { label: "B4", key: "z", frequency: 493.88, color: "var(--catppuccin-color-blue)", type: "square", decay: 0.25 },
    { label: "C5", key: "x", frequency: 523.25, color: "var(--catppuccin-color-mauve)", type: "square", decay: 0.25 },
    { label: "D5", key: "c", frequency: 587.33, color: "var(--catppuccin-color-pink)", type: "square", decay: 0.25 },
];

const keyToPadIndex = new Map(pads.map((p, i) => [p.key, i]));

export default function DrumPadCard() {
    const audioCtxRef = useRef<AudioContext | null>(null);
    const [activePads, setActivePads] = useState<Set<number>>(new Set());

    const getAudioCtx = useCallback(() => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new AudioContext();
        }
        // Resume if suspended (browser autoplay policy)
        if (audioCtxRef.current.state === "suspended") {
            audioCtxRef.current.resume();
        }
        return audioCtxRef.current;
    }, []);

    const playTone = useCallback(
        (pad: Pad, index: number) => {
            const ctx = getAudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = pad.type;
            osc.frequency.setValueAtTime(pad.frequency, ctx.currentTime);

            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(
                0.001,
                ctx.currentTime + pad.decay,
            );

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + pad.decay);

            // Visual feedback
            setActivePads((prev) => new Set(prev).add(index));
            setTimeout(() => {
                setActivePads((prev) => {
                    const next = new Set(prev);
                    next.delete(index);
                    return next;
                });
            }, 150);
        },
        [getAudioCtx],
    );

    // Keyboard support
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            // Don't capture if user is typing in an input
            if (
                e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLTextAreaElement
            ) {
                return;
            }

            const index = keyToPadIndex.get(e.key.toLowerCase());
            if (index !== undefined && !e.repeat) {
                playTone(pads[index], index);
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [playTone]);

    return (
        <div className="border-surface1 bg-base flex flex-col gap-2 rounded-xl border p-4 shadow-lg transition-colors duration-200 hover:border-accent/50">
            {/* Header */}
            <div className="flex items-center gap-2">
                <PiMusicNotesBold className="text-accent size-5" />
                <h2 className="text-sm font-semibold text-text">Drum Pad</h2>
            </div>

            {/* 3x3 pad grid */}
            <div className="grid grid-cols-3 gap-1.5">
                {pads.map((pad, i) => {
                    const isActive = activePads.has(i);
                    return (
                        <button
                            key={pad.label}
                            onPointerDown={() => playTone(pad, i)}
                            className={`flex cursor-pointer flex-col items-center justify-center rounded-lg py-3 transition-all duration-100 select-none ${isActive ? "animate-pad-flash" : ""}`}
                            style={{
                                backgroundColor: pad.color,
                                opacity: isActive ? 1 : 0.7,
                            }}
                        >
                            <span className="text-xs font-bold text-base">
                                {pad.label}
                            </span>
                            <span className="text-[9px] uppercase text-base/70">
                                {pad.key}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Hint */}
            <p className="text-center text-[10px] text-overlay1">
                press Q/W/E/A/S/D/Z/X/C
            </p>
        </div>
    );
}
