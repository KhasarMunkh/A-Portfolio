"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { PiGameControllerBold } from "react-icons/pi";

interface RankData {
    tier: string;
    rank: string;
    leaguePoints: number;
    wins: number;
    losses: number;
}

const tierColors: Record<string, string> = {
    IRON: "text-overlay1",
    BRONZE: "text-peach",
    SILVER: "text-overlay2",
    GOLD: "text-yellow",
    PLATINUM: "text-teal",
    EMERALD: "text-green",
    DIAMOND: "text-sapphire",
    MASTER: "text-mauve",
    GRANDMASTER: "text-red",
    CHALLENGER: "text-flamingo",
    UNRANKED: "text-subtext0",
};

function formatTier(tier: string) {
    return tier.charAt(0) + tier.slice(1).toLowerCase();
}

export default function LoLRankCard() {
    const [data, setData] = useState<RankData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/lol-rank")
            .then((res) => res.json())
            .then((json: RankData) => {
                setData(json);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    const winRate =
        data && data.wins + data.losses > 0
            ? Math.round((data.wins / (data.wins + data.losses)) * 100)
            : 0;

    const tierColor = data
        ? (tierColors[data.tier] ?? "text-text")
        : "text-text";
    const tierImage =
        data && data.tier !== "UNRANKED"
            ? `/ranks/${data.tier.toLowerCase()}.png`
            : null;

    return (
        <div className="border-surface1 bg-base relative flex flex-col gap-2 rounded-xl border p-4 shadow-lg transition-colors duration-200 hover:border-accent/50 lg:col-span-1">
            {/* Header */}
            <div className="flex items-center gap-2">
                <PiGameControllerBold className="text-accent size-5" />
                <h2 className="text-sm font-semibold text-text">Ranked Solo</h2>
            </div>

            {loading ? (
                <div className="flex flex-1 items-center justify-center py-4">
                    <div className="size-6 animate-spin rounded-full border-2 border-surface1 border-t-accent" />
                </div>
            ) : !data ? (
                <p className="text-sm text-overlay1">Failed to load rank</p>
            ) : (
                <>
                    {/* Tier emblem */}
                    {tierImage && (
                        <div className="relative mx-auto size-28">
                            <Image
                                src={tierImage}
                                alt={`${data.tier} emblem`}
                                fill
                                className="object-contain drop-shadow-lg pointer-events-none select-none"
                            />
                        </div>
                    )}

                    {/* Rank + LP */}
                    <div className="text-center">
                        <p className={`text-xl font-bold ${tierColor}`}>
                            {formatTier(data.tier)}{" "}
                            {data.rank && (
                                <span className="text-text">{data.rank}</span>
                            )}
                        </p>
                        {data.tier !== "UNRANKED" && (
                            <p className="text-sm text-subtext0">
                                {data.leaguePoints} LP
                            </p>
                        )}
                    </div>

                    {/* Win/Loss stats */}
                    {data.tier !== "UNRANKED" && (
                        <div className="flex items-center justify-center gap-3 text-xs text-subtext0">
                            <span>
                                <span className="font-semibold text-green">
                                    {data.wins}W
                                </span>
                                {" / "}
                                <span className="font-semibold text-red">
                                    {data.losses}L
                                </span>
                            </span>
                            <span className="text-overlay1">|</span>
                            <span className="font-semibold text-text">
                                {winRate}%
                            </span>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
