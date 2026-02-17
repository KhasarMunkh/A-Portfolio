// app/api/github-commits/route.ts

import { NextResponse } from "next/server";

const GITHUB_PAT = process.env.GITHUB_PAT;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME;

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
    created_at: string;
    payload: {
        commits?: {
            sha: string;
            message: string;
        }[];
        head?: string;
        before?: string;
    };
}

interface CommitDetailResponse {
    sha: string;
    commit: {
        message: string;
        author: { date: string } | null;
    };
    stats?: { additions: number; deletions: number };
}

function githubHeaders(): HeadersInit {
    return {
        Accept: "application/vnd.github+json",
        Authorization: `token ${GITHUB_PAT}`,
        "X-GitHub-Api-Version": "2022-11-28",
    };
}

/** Fetch commit stats from the individual commit endpoint. */
async function fetchCommitDetail(
    repo: string,
    sha: string,
): Promise<CommitDetailResponse | null> {
    try {
        const res = await fetch(
            `https://api.github.com/repos/${repo}/commits/${sha}`,
            { headers: githubHeaders(), next: { revalidate: 600 } },
        );
        if (!res.ok) return null;
        return (await res.json()) as CommitDetailResponse;
    } catch {
        return null;
    }
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
                { commits: [], languages: [], username: GITHUB_USERNAME },
                { status: 502 },
            );
        }

        const events: GitHubEvent[] = await resEvents.json();

        if (!Array.isArray(events)) {
            console.error("GitHub Events API returned unexpected response:", events);
            return NextResponse.json(
                { commits: [], languages: [], username: GITHUB_USERNAME },
                { status: 502 },
            );
        }

        // 2. Extract head commit SHA + message from each PushEvent.
        //    PushEvents always include payload.commits (the head is the last entry).
        //    We collect them in order, deduplicating by SHA.
        const pushEvents = events.filter((e) => e.type === "PushEvent");
        const seenShas = new Set<string>();
        const headCommits: { sha: string; message: string; repo: string; eventDate: string }[] = [];

        for (const event of pushEvents) {
            const inlineHead = event.payload.commits?.at(-1);
            const sha = inlineHead?.sha ?? event.payload.head;
            if (!sha || seenShas.has(sha)) continue;

            seenShas.add(sha);
            headCommits.push({
                sha,
                message: inlineHead?.message.split("\n")[0] ?? "",
                repo: event.repo.name,
                eventDate: event.created_at,
            });

            // We only need a handful; stop early to avoid unnecessary work
            if (headCommits.length >= 8) break;
        }

        // 3. Fetch stats (additions/deletions) for each commit in parallel.
        //    This is a single fetch per commit — no double-fetching.
        const commits = (
            await Promise.all(
                headCommits.map(async (c) => {
                    const detail = await fetchCommitDetail(c.repo, c.sha);

                    // If the inline message was empty (rare fallback), use the one from the API
                    const message =
                        c.message || detail?.commit.message.split("\n")[0] || "";

                    return {
                        sha: c.sha,
                        message,
                        repo: c.repo,
                        href: `https://github.com/${c.repo}/commit/${c.sha}`,
                        additions: detail?.stats?.additions ?? 0,
                        deletions: detail?.stats?.deletions ?? 0,
                        date: detail?.commit.author?.date ?? c.eventDate,
                    };
                }),
            )
        )
            .sort((a, b) => b.date.localeCompare(a.date))
            .slice(0, 4)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .map(({ date: _date, ...rest }) => rest);

        // 4. Fetch language breakdown for each unique repo (in parallel)
        const uniqueRepos = [...new Set(commits.map((c) => c.repo))];
        const langEntries = await Promise.all(
            uniqueRepos.map(async (repo) => {
                try {
                    const res = await fetch(
                        `https://api.github.com/repos/${repo}/languages`,
                        { headers: githubHeaders(), next: { revalidate: 600 } },
                    );
                    if (!res.ok) return {};
                    return (await res.json()) as Record<string, number>;
                } catch {
                    return {};
                }
            }),
        );

        // Aggregate language bytes across repos
        const langMap = new Map<string, number>();
        for (const data of langEntries) {
            for (const [lang, bytes] of Object.entries(data)) {
                langMap.set(lang, (langMap.get(lang) ?? 0) + bytes);
            }
        }

        // 5. Sort languages by size descending, assign colors
        const languages = [...langMap.entries()]
            .sort((a, b) => b[1] - a[1])
            .map(([name, size]) => ({
                name,
                size,
                color: langColors[name] ?? "#8b8b8b",
            }));

        return NextResponse.json({ commits, languages, username: GITHUB_USERNAME });
    } catch (error) {
        console.error("GitHub commits API error:", error);
        return NextResponse.json(
            { commits: [], languages: [], username: GITHUB_USERNAME },
            { status: 500 },
        );
    }
}
