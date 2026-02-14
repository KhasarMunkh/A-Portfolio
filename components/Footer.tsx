"use client";

import { useEffect, useState, useRef, useSyncExternalStore } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { PiClockBold } from "react-icons/pi";
import { createPersistentStore } from "@/lib/hooks/usePersistentStore";

const totalTimeStore = createPersistentStore<number>("total-time-on-site", 0);

function useTotalTime() {
    const total = useSyncExternalStore(
        totalTimeStore.subscribe,
        totalTimeStore.getSnapshot,
        totalTimeStore.getServerSnapshot,
    );
    return [total, totalTimeStore.set] as const;
}

function formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export default function Footer() {
    const year = new Date().getFullYear();
    const [totalTime, setTotalTime] = useTotalTime();
    const [displayTime, setDisplayTime] = useState("00:00");
    const sessionStartRef = useRef<number>(0);
    const initialTimeRef = useRef<number>(0);

    useEffect(() => {
        sessionStartRef.current = Date.now();
        initialTimeRef.current = totalTime;

        const interval = setInterval(() => {
            const sessionElapsed = Math.floor(
                (Date.now() - sessionStartRef.current) / 1000,
            );
            setDisplayTime(formatTime(initialTimeRef.current + sessionElapsed));
        }, 1000);

        const saveTime = () => {
            const sessionElapsed = Math.floor(
                (Date.now() - sessionStartRef.current) / 1000,
            );
            setTotalTime(initialTimeRef.current + sessionElapsed);
        };

        window.addEventListener("beforeunload", saveTime);

        return () => {
            clearInterval(interval);
            window.removeEventListener("beforeunload", saveTime);
            saveTime();
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="relative mx-auto px-8 md:px-16 lg:px-24 mb-5 mt-12">
            <footer className="bg-crust text-subtext0 border-surface0/20 flex flex-col items-center justify-center gap-y-3 rounded-lg border p-5 text-sm md:flex-row md:justify-between md:gap-y-0">
                {/* Left side */}
                <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 md:justify-start">
                    <span className="whitespace-nowrap">
                        &copy; {year} Khasar
                    </span>

                    <span className="text-surface0 hidden md:inline">-</span>

                    <div
                        className="flex items-center gap-1 whitespace-nowrap"
                        title="Service Status"
                    >
                        <span className="relative mr-1.5 flex h-3 w-3">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green/75 duration-[2000ms]" />
                            <span className="relative inline-flex h-3 w-3 rounded-full bg-green" />
                        </span>
                        <span className="text-subtext1 text-sm font-medium">
                            All Services Nominal
                        </span>
                    </div>
                </div>

                {/* Right side */}
                <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 md:justify-end">
                    <div
                        className="flex items-center gap-1.5"
                        title="How long you have been surfing my site"
                    >
                        <PiClockBold className="text-subtext1 size-3.5" />
                        <span className="text-accent font-mono text-xs">
                            {displayTime}
                        </span>
                    </div>

                    <span className="text-surface0 hidden sm:inline">-</span>

                    <div className="flex items-center gap-x-3">
                        <a
                            href="https://github.com/KhasarMunkh"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                            className="text-subtext1 hover:text-accent transition-colors duration-200"
                        >
                            <FaGithub className="size-4" />
                        </a>
                        <a
                            href="https://www.linkedin.com/in/khasarmunkh/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                            className="text-subtext1 hover:text-accent transition-colors duration-200"
                        >
                            <FaLinkedin className="size-4" />
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
