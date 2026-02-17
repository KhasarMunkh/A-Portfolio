import Image from "next/image";
import { Link } from "next-view-transitions";
import { FaUser, FaGithub, FaLinkedin } from "react-icons/fa";
import {
  FaGolang,
  FaReact,
  FaNodeJs,
  FaDocker,
  FaLinux,
  FaGitAlt,
  FaAws,
  FaGraduationCap,
} from "react-icons/fa6";
import {
  SiTypescript,
  SiNextdotjs,
  SiTailwindcss,
  SiMongodb,
  SiNeovim,
  SiArchlinux,
  SiDotnet,
  SiExpo,
  SiExpress,
} from "react-icons/si";
import { PiCodeBold, PiGameControllerBold } from "react-icons/pi";
import type { IconType } from "react-icons";
import LoLRankCard from "@/components/LoLRankCard";

interface Skill {
  name: string;
  icon: IconType;
  color: string;
}

const languages: Skill[] = [
  { name: "TypeScript", icon: SiTypescript, color: "text-blue" },
  { name: "Go", icon: FaGolang, color: "text-sky" },
  { name: "C# / .NET", icon: SiDotnet, color: "text-mauve" },
];

const frameworks: Skill[] = [
  { name: "React", icon: FaReact, color: "text-sapphire" },
  { name: "Next.js", icon: SiNextdotjs, color: "text-text" },
  { name: "React Native", icon: FaReact, color: "text-sapphire" },
  { name: "Expo", icon: SiExpo, color: "text-lavender" },
  { name: "Tailwind CSS", icon: SiTailwindcss, color: "text-teal" },
  { name: "Node.js", icon: FaNodeJs, color: "text-green" },
  { name: "Express", icon: SiExpress, color: "text-green" },
];

const tools: Skill[] = [
  { name: "Neovim", icon: SiNeovim, color: "text-green" },
  { name: "Arch Linux", icon: SiArchlinux, color: "text-sapphire" },
  { name: "Git", icon: FaGitAlt, color: "text-peach" },
  { name: "Docker", icon: FaDocker, color: "text-sapphire" },
  { name: "MongoDB", icon: SiMongodb, color: "text-green" },
  { name: "Linux", icon: FaLinux, color: "text-yellow" },
  { name: "AWS", icon: FaAws, color: "text-peach" },
];

function SkillGrid({ title, skills }: { title: string; skills: Skill[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-subtext0 mb-3">
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <div
            key={skill.name}
            className="inline-flex items-center gap-2 rounded-lg border border-surface1 bg-base px-3 py-2 text-sm transition-colors duration-200 hover:border-accent/50"
          >
            <skill.icon className={`size-4 ${skill.color}`} />
            <span className="text-text">{skill.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-12 px-0 py-8 md:space-y-16 md:px-4 md:py-12">
      {/* Page heading */}
      <div className="flex items-center gap-4 px-4 md:px-0">
        <FaUser className="text-accent text-4xl" />
        <h1 className="text-4xl font-bold text-text">About Me</h1>
      </div>

      {/* Bio section */}
      <section className="flex flex-col gap-8 px-4 md:flex-row md:px-0">
        <div className="shrink-0 flex flex-col items-center gap-2">
          <div className="relative size-48 md:size-64">
            <Image
              src="/flopped.png"
              alt="Khasar"
              fill
              className="rounded-full object-cover"
              priority
            />
          </div>
          {/* Master rank badge */}
          <Image
            src="/ranks/master.png"
            alt="Master rank"
            width={128}
            height={128}
            className="w-28 h-28 md:w-36 md:h-36 -mt-6 drop-shadow-lg pointer-events-none select-none"
          />
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-text">
            Hey, I&apos;m <span className="text-accent">Khasar</span>
          </h2>
          <div className="space-y-3 text-subtext0 text-lg leading-relaxed max-w-prose">
            <p>
              I&apos;m a{" "}
              <span className="font-bold text-text">
                computer science student
              </span>{" "}
              at{" "}
              <span className="font-bold text-text">
                CU Denver
              </span>{" "}
              and a{" "}
              <span className="font-bold text-text">full-stack developer</span>{" "}
              based in{" "}
              <span className="font-bold text-text">Denver, CO</span>. I enjoy
              building things that are fast, clean, and well-architected — from
              CLI tools and real-time multiplayer games to mobile apps and
              dashboards.
            </p>
            <p>
              I care deeply about{" "}
              <span className="font-bold text-text">developer experience</span>{" "}
              and spend just as much time refining my dev environment as I do
              writing code. My daily driver is a meticulously configured{" "}
              <span className="font-bold text-text">Arch Linux</span> setup with{" "}
              <span className="font-bold text-text">Neovim</span> at its core
              — I believe the tools you use should feel like an extension of your
              thinking.
            </p>
            <p>
              Outside of code, I&apos;m a competitive{" "}
              <span className="font-bold text-text">League of Legends</span>{" "}
              player at{" "}
              <span className="font-bold text-text">Master&apos;s</span> level.
              The strategic depth and quick decision-making that comes with
              high-level play translates directly into how I approach problem
              solving in software.
            </p>
          </div>
          <div className="flex gap-3 pt-2">
            <Link
              href="https://github.com/KhasarMunkh"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Github profile in new tab"
              className="inline-flex items-center gap-2 rounded-md bg-surface0 px-3 py-1.5 text-sm text-text transition-colors duration-200 hover:bg-surface1"
            >
              <FaGithub className="size-4" />
              GitHub
            </Link>
            <Link
              href="https://www.linkedin.com/in/khasarmunkh/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open LinkedIn profile in new tab"
              className="inline-flex items-center gap-2 rounded-md bg-surface0 px-3 py-1.5 text-sm text-text transition-colors duration-200 hover:bg-surface1"
            >
              <FaLinkedin className="size-4" />
              LinkedIn
            </Link>
          </div>
        </div>
      </section>

      {/* Skills section */}
      <section className="space-y-6 px-4 md:px-0">
        <h2 className="flex items-center gap-2 text-3xl font-bold text-text">
          <PiCodeBold className="text-accent" />
          Skills &amp; Technologies
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <SkillGrid title="Languages" skills={languages} />
          <SkillGrid title="Frameworks & Libraries" skills={frameworks} />
          <SkillGrid title="Tools & Platforms" skills={tools} />
        </div>
      </section>

      {/* Education section */}
      <section className="space-y-6 px-4 md:px-0">
        <h2 className="flex items-center gap-2 text-3xl font-bold text-text">
          <FaGraduationCap className="text-accent" />
          Education
        </h2>
        <div className="rounded-xl border border-surface1 bg-base p-6 shadow-lg">
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-bold text-text">
              University of Colorado Denver
            </h3>
            <p className="text-lg text-accent">
              B.S. in Computer Science
            </p>
            <p className="text-subtext0">Denver, CO</p>
          </div>
          <p className="mt-4 text-subtext0 leading-relaxed">
            Studying computer science with a focus on software engineering,
            systems programming, and data structures &amp; algorithms.
            Complementing coursework with hands-on project work across the full
            stack — from low-level Go CLI tools to real-time web applications.
          </p>
        </div>
      </section>

      {/* Interests section */}
      <section className="space-y-6 px-4 md:px-0">
        <h2 className="flex items-center gap-2 text-3xl font-bold text-text">
          <PiGameControllerBold className="text-accent" />
          Interests
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <LoLRankCard />
          <InterestCard
            title="Competitive Gaming"
            description="Master-tier League of Legends player. I thrive in high-pressure, strategy-heavy environments where split-second decisions matter."
          />
          <InterestCard
            title="Dev Environments"
            description="Obsessed with crafting the perfect workflow. From Neovim configs to tiling window managers, I love optimizing every keystroke."
          />
          <InterestCard
            title="Open Source"
            description="I believe in building in the open. All of my projects are open source, and I enjoy contributing to the tools I use every day."
          />
        </div>
      </section>
    </div>
  );
}

function InterestCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-surface1 bg-base p-5 shadow-lg transition-colors duration-200 hover:border-accent/50">
      <h3 className="text-lg font-semibold text-text">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-subtext0">
        {description}
      </p>
    </div>
  );
}
