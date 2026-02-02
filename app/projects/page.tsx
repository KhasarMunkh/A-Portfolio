import { Project, projects } from "@/lib/projects";
import ProjectCard from "@/components/ProjectCard";
import { FaFolderOpen } from "react-icons/fa";

export default function ProjectPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-12 px-0 py-8 md:space-y-16 md:px-4 md:py-12">
      <div className="flex items-center gap-4">
        <FaFolderOpen className="text-sapphire text-4xl"/>
        <h1 className="text-4xl font-bold text-left text-text">Projects</h1>
      </div>
      {projects.length > 0 && (
        <div className="gap-4 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} {...project} />
          ))}
        </div>
      )}
    </div>
  );
}
