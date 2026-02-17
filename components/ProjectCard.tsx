import { Link } from "next-view-transitions";
import { FaTags } from "react-icons/fa";
import { getTagColor } from "@/lib/tags";
import TerminalCard from "@/components/TerminalCard";
import type { GitHubData } from "@/lib/projects";

interface ProjectCardProps {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  repo?: string;
  githubData?: GitHubData | null;
}

export default function ProjectCard({
  slug,
  title,
  description,
  tags,
  repo,
  githubData,
}: ProjectCardProps) {
  return (
    <article className="w-full">
      <Link
        href={`/projects/${slug}`}
        className="
        h-full
        grid grid-rows-[auto_1fr_auto]
        overflow-hidden
        p-4
        rounded-xl
        border-2
        border-surface1
        transition-color duration-200 ease-out hover:border-accent
        transition-transform hover:scale-[1.01] 
        focus-visible:border-accent focus-visible:outline-none
      "
      >
        <div className="rounded-lg bg-base overflow-hidden h-full">
          {/* Row 1: Terminal Card */}
          <figure
            className="w-full overflow-hidden"
            style={{ viewTransitionName: `project-image-${slug}` }}
          >
            <TerminalCard
              githubData={githubData}
              title={title}
              description={description}
              repo={repo}
            />
          </figure>

          {/* Row 2: Title + description */}
          <div className="flex flex-col p-4 pb-0">
            <h3
              className="text-lg font-semibold"
              style={{ viewTransitionName: `project-title-${slug}` }}
            >
              {title}
            </h3>
            <p className="mt-2 text-sm text-subtext1 line-clamp-3">
              {description}
            </p>
          </div>

          {/* Row 3: Tags */}
          {tags.length > 0 && (
            <div className="flex max-h-8 gap-2 p-4 flex-wrap overflow-hidden pt-3 text-xs items-center">
              <FaTags className="text-accent shrink-0" />
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className={`px-2 rounded-sm bg-surface2 whitespace-nowrap ${getTagColor(tag)}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
