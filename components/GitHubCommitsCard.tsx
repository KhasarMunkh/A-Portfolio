"use client";

import { useEffect, useState } from "react";
import { GoGitCommit } from "react-icons/go";
import { FaGithub } from "react-icons/fa";
import { GoLinkExternal } from "react-icons/go";

interface Commit {
    sha: string;
    message: string;
    repo: string;
    href: string;
    additions: number;
    deletions: number;
}

interface Language {
    name: string;
    size: number;
    color: string;
}

interface CommitData {
    commits: Commit[];
    languages: Language[];
}

export default function GitHubCommitsCard() {
    const [data, setData] = useState<CommitData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/github-commits")
            .then((res) => res.json())
            .then((json: CommitData) => {
                setData(json);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    const langTotal =
        data?.languages.reduce((sum, lang) => sum + lang.size, 0) ?? 0;

    return (
        <div className="border-surface1 bg-base flex flex-col gap-3 rounded-xl border p-4 shadow-lg transition-colors duration-200 hover:border-accent/50 md:col-span-2">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-text">
                    <GoGitCommit className="text-accent size-5" />
                    <span>Recent Commits</span>
                </h2>
            </div>

            {loading ? (
                <div className="flex flex-1 items-center justify-center py-4">
                    <div className="size-6 animate-spin rounded-full border-2 border-surface1 border-t-accent" />
                </div>
            ) : !data ? (
                <p className="text-sm text-overlay1">
                    Failed to load commits
                </p>
            ) : (
                <>
                    {/* Commit list */}
                    {data.commits.length > 0 ? (
                        <ul className="space-y-1.5 text-sm">
                            {data.commits.slice(0, 4).map((commit) => (
                                <li key={commit.sha}>
                                    <a
                                        href={commit.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-subtext0 hover:text-accent flex min-w-0 items-center gap-2"
                                        title={`${commit.repo}: ${commit.message}`}
                                    >
                                        <span className="text-text flex-shrink-0 font-medium">
                                            {commit.repo.split("/")[1]}:
                                        </span>
                                        <span className="min-w-0 flex-1 truncate">
                                            {commit.message}
                                        </span>
                                        <span className="flex-shrink-0 text-xs whitespace-nowrap">
                                            <span className="text-green">
                                                +{commit.additions}
                                            </span>
                                            <span className="text-surface1">
                                                /
                                            </span>
                                            <span className="text-red">
                                                -{commit.deletions}
                                            </span>
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm italic text-subtext1">
                            No recent public commits.
                        </p>
                    )}

                    {/* Footer: GitHub link + language bar */}
                    <div className="mt-auto flex items-center gap-3">
                        <a
                            href="https://github.com/KhasarMunkh"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group text-accent inline-flex items-center gap-1.5 text-sm hover:underline"
                        >
                            <FaGithub className="size-4" />
                            <span>Profile</span>
                            <GoLinkExternal className="size-3 inline-block transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </a>

                        {langTotal > 0 && (
                            <div
                                className="ml-auto max-w-xs flex-1 sm:max-w-sm md:max-w-md"
                                aria-label="Language breakdown"
                            >
                                <div className="bg-surface2 h-2 w-full rounded-[3px]">
                                    <div className="flex h-full w-full">
                                        {data.languages.map((lang) => (
                                            <div
                                                key={lang.name}
                                                className="group relative h-full first:rounded-l-[3px] last:rounded-r-[3px]"
                                                style={{
                                                    width: `clamp(4px, ${(lang.size / langTotal) * 100}%, ${(lang.size / langTotal) * 100}%)`,
                                                    backgroundColor: lang.color,
                                                }}
                                            >
                                                {/* Tooltip */}
                                                <div className="border-surface1 bg-surface1 pointer-events-none absolute -top-7 left-1/2 z-10 -translate-x-1/2 rounded border px-2 py-0.5 text-xs whitespace-nowrap opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
                                                    <span className="inline-flex items-center gap-2">
                                                        <span
                                                            className="inline-block size-2 rounded"
                                                            style={{
                                                                backgroundColor:
                                                                    lang.color,
                                                            }}
                                                        />
                                                        <span className="text-subtext0">
                                                            {lang.name}
                                                        </span>
                                                        <span className="text-overlay0">
                                                            {Math.round(
                                                                (lang.size /
                                                                    langTotal) *
                                                                    100,
                                                            )}
                                                            %
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
