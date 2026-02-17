import { notFound } from "next/navigation";
import { Link } from "next-view-transitions";
import { FaGithub, FaExternalLinkAlt, FaTags, FaArrowLeft } from "react-icons/fa";
import { projects, getProjectContent, getGitHubData } from "@/lib/projects";
import { extractHeadings } from "@/lib/markdown";
import { getTagColor } from "@/lib/tags";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import TableOfContents from "@/components/TableOfContents";
import TerminalCard from "@/components/TerminalCard";

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const content = await getProjectContent(slug);
  const headings = extractHeadings(content);
  const githubData = project.repo
    ? await getGitHubData(project.repo)
    : null;

  return (
      <div className="mx-auto max-w-[1800px] px-4 py-8 md:py-12">
      {/* Back link */}
      <Link
        href="/projects"
        className="text-subtext0 hover:text-accent mb-6 inline-flex items-center gap-2 text-sm transition-colors duration-200"
      >
        <FaArrowLeft className="size-3" />
        Back to Projects
      </Link>

      {/* Content area: main column + TOC sidebar */}
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 lg:max-w-[1060px] lg:grid-cols-[1fr_220px]">
        <div className="min-w-0">
          {/* Terminal card hero (inside grid to match markdown width) */}
          <figure
            className="overflow-hidden rounded-xl mb-6"
            style={{ viewTransitionName: `project-image-${slug}` }}
          >
            <TerminalCard
              githubData={githubData}
              title={project.title}
              description={project.description}
              repo={project.repo}
            />
          </figure>

          {/* Title + tags + links header */}
          <div className="mb-8">
            <h1
              className="text-3xl font-bold text-text md:text-4xl"
              style={{ viewTransitionName: `project-title-${slug}` }}
            >
              {project.title}
            </h1>

            <p className="text-subtext0 mt-2 text-lg leading-relaxed">
              {project.description}
            </p>

            {/* Tags */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <FaTags className="text-accent shrink-0" />
              {project.tags.map((tag, i) => (
                <span
                  key={i}
                  className={`rounded-sm bg-surface2 px-2 py-0.5 ${getTagColor(tag)}`}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Links */}
            {(project.repo || project.live) && (
              <div className="mt-4 flex gap-3">
                {project.repo && (
                  <Link
                    href={project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md bg-surface0 px-3 py-1.5 text-sm text-text transition-colors duration-200 hover:bg-surface1"
                  >
                    <FaGithub className="size-4" />
                    Source
                  </Link>
                )}
                {project.live && (
                  <Link
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md bg-surface0 px-3 py-1.5 text-sm text-text transition-colors duration-200 hover:bg-surface1"
                  >
                    <FaExternalLinkAlt className="size-3" />
                    Live Demo
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-surface0 mb-8" />

          {/* Markdown content */}
          <article>
            <MarkdownRenderer content={content} />
          </article>
        </div>
        <TableOfContents headings={headings} />
      </div>
    </div>
  );
}
