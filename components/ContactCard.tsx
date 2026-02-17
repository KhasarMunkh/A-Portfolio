"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PiTerminalBold } from "react-icons/pi";
import { GoLinkExternal } from "react-icons/go";
import { FaCheck, FaRegCopy } from "react-icons/fa6";

/** Check prefers-reduced-motion (safe for SSR — returns false). */
function prefersReducedMotion(): boolean {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

interface TerminalLine {
    prompt: string;
    outputs: {
        text: string;
        href?: string;
        external?: boolean;
        copyable?: boolean;
    }[];
}

const lines: TerminalLine[] = [
    {
        prompt: "whoami",
        outputs: [{ text: "khasar" }],
    },
    {
        prompt: "email",
        outputs: [
            {
                text: "khasar.munkherdene@gmail.com",
                href: "mailto:khasar.munkherdene@gmail.com",
                copyable: true,
            },
        ],
    },
    {
        prompt: "socials",
        outputs: [
            {
                text: "github.com/KhasarMunkh",
                href: "https://github.com/KhasarMunkh",
                external: true,
            },
            {
                text: "linkedin.com/in/khasarmunkh",
                href: "https://www.linkedin.com/in/khasarmunkh/",
                external: true,
            },
        ],
    },
];

// Character-level typing speed (ms per char)
const CHAR_DELAY = 28;
// Pause between lines (ms)
const LINE_PAUSE = 300;

export default function ContactCard() {
    const [copied, setCopied] = useState(false);

    // Flatten all displayable text into a sequence of characters with metadata
    // so we can type through them linearly
    const charSequence = useMemo(() => {
        const seq: { char: string; lineBreak?: boolean }[] = [];
        for (const line of lines) {
            // The prompt: "$ whoami"
            for (const ch of `$ ${line.prompt}`) {
                seq.push({ char: ch });
            }
            seq.push({ char: "\n", lineBreak: true });

            // Each output line
            for (const output of line.outputs) {
                for (const ch of `  ${output.text}`) {
                    seq.push({ char: ch });
                }
                seq.push({ char: "\n", lineBreak: true });
            }
        }
        return seq;
    }, []);

    const totalChars = charSequence.length;

    // If reduced motion, start fully visible; otherwise start at 0
    const [visibleChars, setVisibleChars] = useState(() =>
        prefersReducedMotion() ? totalChars : 0,
    );

    const animDone = visibleChars >= totalChars;

    // Typing animation — setState only happens inside the async setTimeout callback
    useEffect(() => {
        if (animDone) return;

        // If we just finished a lineBreak char, add an extra pause
        const prevChar =
            visibleChars > 0 ? charSequence[visibleChars - 1] : null;
        const delay = prevChar?.lineBreak ? LINE_PAUSE : CHAR_DELAY;

        const timer = setTimeout(() => {
            setVisibleChars((v) => v + 1);
        }, delay);

        return () => clearTimeout(timer);
    }, [visibleChars, totalChars, charSequence, animDone]);

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(
                "khasar.munkherdene@gmail.com",
            );
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // Fallback: silently fail
        }
    }, []);

    // Render terminal lines based on how many chars are visible
    function renderLines() {
        let charIndex = 0;
        const rendered: React.ReactNode[] = [];

        for (let li = 0; li < lines.length; li++) {
            const line = lines[li];
            const promptStr = `$ ${line.prompt}`;

            // Check if we've reached this prompt yet
            if (charIndex >= visibleChars) break;

            // Render prompt
            const promptVisible = Math.min(
                promptStr.length,
                visibleChars - charIndex,
            );
            rendered.push(
                <div key={`p-${li}`} className="flex">
                    <span className="text-accent">
                        {promptStr.slice(0, 2)}
                    </span>
                    <span className="text-text">
                        {promptStr.slice(2, promptVisible)}
                    </span>
                </div>,
            );
            charIndex += promptStr.length + 1; // +1 for \n

            // Render outputs
            for (let oi = 0; oi < line.outputs.length; oi++) {
                const output = line.outputs[oi];
                const outputStr = `  ${output.text}`;

                if (charIndex >= visibleChars) break;

                const outputVisible = Math.min(
                    outputStr.length,
                    visibleChars - charIndex,
                );
                const visibleText = outputStr.slice(0, outputVisible);

                if (output.href) {
                    rendered.push(
                        <div
                            key={`o-${li}-${oi}`}
                            className="flex items-center gap-1.5"
                        >
                            <a
                                href={output.href}
                                target={output.external ? "_blank" : undefined}
                                rel={
                                    output.external
                                        ? "noopener noreferrer"
                                        : undefined
                                }
                                className="text-subtext0 transition-colors hover:text-accent"
                            >
                                {visibleText}
                                {output.external &&
                                    outputVisible >= outputStr.length && (
                                        <GoLinkExternal className="ml-1 inline-block size-2.5 opacity-50" />
                                    )}
                            </a>
                            {output.copyable &&
                                outputVisible >= outputStr.length && (
                                    <button
                                        onClick={handleCopy}
                                        className="cursor-pointer text-overlay1 transition-colors hover:text-accent"
                                        title={
                                            copied
                                                ? "Copied!"
                                                : "Copy email"
                                        }
                                    >
                                        {copied ? (
                                            <FaCheck className="size-2.5 text-green" />
                                        ) : (
                                            <FaRegCopy className="size-2.5" />
                                        )}
                                    </button>
                                )}
                        </div>,
                    );
                } else {
                    rendered.push(
                        <div key={`o-${li}-${oi}`} className="text-accent">
                            {visibleText}
                        </div>,
                    );
                }

                charIndex += outputStr.length + 1; // +1 for \n
            }
        }

        return rendered;
    }

    return (
        <div className="border-surface1 bg-base flex flex-col gap-2 rounded-xl border p-4 shadow-lg transition-colors duration-200 hover:border-accent/50">
            {/* Header */}
            <div className="flex items-center gap-2">
                <PiTerminalBold className="text-accent size-5" />
                <h2 className="text-sm font-semibold text-text">Contact</h2>
            </div>

            {/* Terminal body */}
            <div className="rounded-lg bg-mantle px-3 py-3 font-mono text-xs leading-relaxed">
                {renderLines()}

                {/* Blinking cursor on the last line */}
                <div className="flex">
                    <span className="text-accent">$ </span>
                    <span className="animate-cursor-blink text-text">
                        █
                    </span>
                </div>
            </div>
        </div>
    );
}
