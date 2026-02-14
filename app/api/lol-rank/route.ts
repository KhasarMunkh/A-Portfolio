// app/api/lol-rank/route.ts 

import { NextResponse } from "next/server";

const RIOT_API_KEY = process.env.RIOT_API_KEY!;
const SUMMONER_PUUID = process.env.SUMMONER_PUUID!;

if (!RIOT_API_KEY || !SUMMONER_PUUID) {
    throw new Error(
        "RIOT_API_KEY and SUMMONER_PUUID must be set in environment variables",
    );
}

type LeagueEntry = {
    leagueId: string;
    queueType: string;
    tier: string;
    rank: string;
    puuid: string;
    leaguePoints: number;
    wins: number;
    losses: number;
};

export async function GET() {
    const res = await fetch(
        `https://na1.api.riotgames.com/lol/league/v4/entries/by-puuid/${encodeURIComponent(SUMMONER_PUUID)}`,
        {
            headers: {
                "X-Riot-Token": RIOT_API_KEY!,
            },
            next: {
                revalidate: 600, // Cache the response for 600 seconds
            },
        },
    );

    const entries: LeagueEntry[] = await res.json(); // Ensure the response is fully consumed before returning
    const solo = entries.find((e) => e.queueType === "RANKED_SOLO_5x5");

    if (!solo) {
        return NextResponse.json({
            tier: "UNRANKED",
            rank: "",
            leaguePoints: 0,
            wins: 0,
            losses: 0,
        });
    }

    return NextResponse.json({
        tier: solo?.tier,
        rank: solo?.rank,
        leaguePoints: solo?.leaguePoints,
        wins: solo?.wins,
        losses: solo?.losses,
    });
}
