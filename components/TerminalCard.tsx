import Image from "next/image";
import type { GitHubData } from "@/lib/projects";
import { FaStar } from "react-icons/fa";

interface TerminalCardProps {
  githubData?: GitHubData | null;
  title: string;
  description: string;
  repo?: string;
}

function parseRepo(repoUrl: string): { owner: string; name: string } | null {
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return null;
  return { owner: match[1], name: match[2] };
}

export default function TerminalCard({
  githubData,
  title,
  description,
  repo,
}: TerminalCardProps) {
  const parsed = repo ? parseRepo(repo) : null;
  const owner = githubData?.owner ?? parsed?.owner ?? "";
  const name = githubData?.name ?? parsed?.name ?? title;
  const desc = githubData?.description || description;
  const stars = githubData?.stars ?? 0;
  const avatarUrl = githubData?.avatarUrl;

  return (
    <div className="flex items-center justify-center rounded-xl bg-surface0 p-5">
      <div className="w-full rounded-xl border border-surface1 bg-crust shadow-xl">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-5 py-3">
          <span className="size-3 rounded-full bg-red" />
          <span className="size-3 rounded-full bg-yellow" />
          <span className="size-3 rounded-full bg-green" />
        </div>

        {/* Body */}
        <div className="space-y-4 px-6 pb-6">
          {/* Repo name + stars */}
          <div className="flex items-start justify-between gap-3">
            <p className="text-lg">
              {owner && (
                <>
                  <span className="text-green">{owner}</span>
                  <span className="text-overlay1"> / </span>
                </>
              )}
              <span className="text-accent">{name}</span>
            </p>
            <span className="flex shrink-0 items-center gap-1.5 text-base text-yellow">
              {stars}
              <FaStar className="size-4" />
            </span>
          </div>

          {/* Description */}
          <p className="text-base leading-relaxed text-subtext0 line-clamp-3">
            {desc}
          </p>

          {/* Footer: avatar + username */}
          <div className="flex items-center justify-between pt-2">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={`${owner}'s avatar`}
                width={44}
                height={44}
                className="rounded-md"
              />
            ) : (
              <div />
            )}
            {owner && (
              <span className="text-sm text-overlay1">{owner}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
