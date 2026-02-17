// app/api/github-commits/route.ts

import { NextResponse } from "next/server";

const GITHUB_PAT = process.env.GITHUB_PAT!;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME!;

if (!GITHUB_PAT || !GITHUB_USERNAME) {
    throw new Error(
        "GITHUB_PAT and GITHUB_USERNAME environment variables must be set",
    );
}

// GitHub linguist colors for the language breakdown bar
const langColors: Record<string, string> = {
    TypeScript: "#3178c6",
    JavaScript: "#f1e05a",
    Python: "#3572A5",
    Go: "#00ADD8",
    Rust: "#dea584",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Shell: "#89e051",
    Lua: "#000080",
    Dockerfile: "#384d54",
    Makefile: "#427819",
    C: "#555555",
    "C++": "#f34b7d",
    "C#": "#178600",
    Java: "#b07219",
    Ruby: "#701516",
    Swift: "#F05138",
    Kotlin: "#A97BFF",
    Nix: "#7e7eff",
    MDX: "#fcb32c",
    SCSS: "#c6538c",
    Svelte: "#ff3e00",
    Vue: "#41b883",
    Dart: "#00B4AB",
    PHP: "#4F5D95",
    Zig: "#ec915c",
};

interface GitHubEvent {
    type: string;
    repo: { name: string };
    payload: {
        commits?: {
            sha: string;
            message: string;
        }[];
    };
}

interface CommitDetail {
    stats?: { additions: number; deletions: number };
}

function githubHeaders(): HeadersInit {
    return {
        Accept: "application/vnd.github+json",
        Authorization: `token ${GITHUB_PAT}`,
        "X-GitHub-Api-Version": "2022-11-28",
    };
}

export async function GET() {
    try {
        // 1. Fetch recent public events
        const resEvents = await fetch(
            `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=30`,
            {
                headers: githubHeaders(),
                next: { revalidate: 600 },
            },
        );

        if (!resEvents.ok) {
            console.error(
                `GitHub Events API responded with ${resEvents.status}: ${resEvents.statusText}`,
            );
            return NextResponse.json(
                { commits: [], languages: [] },
                { status: 502 },
            );
        }

        const events: GitHubEvent[] = await resEvents.json();

        if (!Array.isArray(events)) {
            console.error("GitHub Events API returned unexpected response:", events);
            return NextResponse.json(
                { commits: [], languages: [] },
                { status: 502 },
            );
        }

        // 2. Extract commits from PushEvents (latest 4)
        const rawCommits: { sha: string; message: string; repo: string }[] = [];

        for (const event of events) {
            if (event.type !== "PushEvent" || !event.payload.commits) continue;
            for (const commit of event.payload.commits) {
                rawCommits.push({
                    sha: commit.sha,
                    message: commit.message.split("\n")[0], // first line only
                    repo: event.repo.name,
                });
                if (rawCommits.length >= 4) break;
            }
            if (rawCommits.length >= 4) break;
        }

        // 3. Fetch additions/deletions for each commit (in parallel)
        const commits = await Promise.all(
            rawCommits.map(async (c) => {
                try {
                    const res = await fetch(
                        `https://api.github.com/repos/${c.repo}/commits/${c.sha}`,
                        { headers: githubHeaders(), next: { revalidate: 600 } },
                    );
                    const detail: CommitDetail = res.ok
                        ? await res.json()
                        : { stats: undefined };

                    return {
                        sha: c.sha,
                        message: c.message,
                        repo: c.repo,
                        href: `https://github.com/${c.repo}/commit/${c.sha}`,
                        additions: detail.stats?.additions ?? 0,
                        deletions: detail.stats?.deletions ?? 0,
                    };
                } catch {
                    return {
                        sha: c.sha,
                        message: c.message,
                        repo: c.repo,
                        href: `https://github.com/${c.repo}/commit/${c.sha}`,
                        additions: 0,
                        deletions: 0,
                    };
                }
            }),
        );

        // 4. Fetch language breakdown for each unique repo (in parallel)
        const uniqueRepos = [...new Set(rawCommits.map((c) => c.repo))];
        const langMap = new Map<string, number>();

        await Promise.all(
            uniqueRepos.map(async (repo) => {
                try {
                    const res = await fetch(
                        `https://api.github.com/repos/${repo}/languages`,
                        { headers: githubHeaders(), next: { revalidate: 600 } },
                    );
                    if (!res.ok) return;
                    const data: Record<string, number> = await res.json();
                    for (const [lang, bytes] of Object.entries(data)) {
                        langMap.set(lang, (langMap.get(lang) ?? 0) + bytes);
                    }
                } catch {
                    // skip this repo on failure
                }
            }),
        );

        // 5. Sort languages by size descending, assign colors
        const languages = [...langMap.entries()]
            .sort((a, b) => b[1] - a[1])
            .map(([name, size]) => ({
                name,
                size,
                color: langColors[name] ?? "#8b8b8b",
            }));

        return NextResponse.json({ commits, languages });
    } catch (error) {
        console.error("GitHub commits API error:", error);
        return NextResponse.json(
            { commits: [], languages: [] },
            { status: 500 },
        );
    }
}
