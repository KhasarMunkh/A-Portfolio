import { readFile } from "fs/promises";
import { join } from "path";

export interface Project {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  repo?: string;
  live?: string;
}

export interface GitHubData {
  owner: string;
  name: string;
  description: string;
  stars: number;
  avatarUrl: string;
}

const ghCache = new Map<string, GitHubData>();

export async function getGitHubData(repoUrl: string): Promise<GitHubData | null> {
  if (ghCache.has(repoUrl)) return ghCache.get(repoUrl)!;

  // Extract owner/repo from "https://github.com/Owner/Repo"
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return null;

  const [, owner, repo] = match;

  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;

    const data = await res.json();
    const result: GitHubData = {
      owner: data.owner?.login ?? owner,
      name: data.name ?? repo,
      description: data.description ?? "",
      stars: data.stargazers_count ?? 0,
      avatarUrl: data.owner?.avatar_url ?? "",
    };

    ghCache.set(repoUrl, result);
    return result;
  } catch {
    return null;
  }
}

export async function getProjectContent(slug: string): Promise<string> {
  const filePath = join(process.cwd(), "content", "projects", `${slug}.md`);
  try {
    return await readFile(filePath, "utf-8");
  } catch {
    return "";
  }
}

export const goAscii: Project = {
  slug: "go-ascii",
  title: "Go-Ascii",
  description:
    "A Go command-line tool that converts images into ASCII, ANSI, or Braille art with optional image filters like blur, posterize, and contrast adjustments.",
  tags: ["Go", "CLI", "Image Processing", "Text Art"],
  repo: "https://github.com/KhasarMunkh/go-ascii",
};

export const termfolio: Project = {
  slug: "termfolio",
  title: "Termfolio",
  description:
    "An interactive terminal-based portfolio website that runs in the browser, allowing visitors to explore projects and skills through a sandboxed Docker-powered shell experience",
  tags: ["TS", "Express", "Docker", "Node", "AWS EC2", "Caddy", "WebSocket"],
  repo: "https://github.com/KhasarMunkh/termfolio",
};

export const soloLeveler: Project = {
  slug: "sololeveler",
  title: "Solo Leveler",
  description:
    "A gamified personal development mobile app built with Expo/React Native where users set weekly goals across fitness, school, work, and habits. Features AI-powered schedule generation, XP/leveling system, streaks, and boss battles for motivation.",
  tags: [
    "React Native",
    "Expo",
    "TS",
    "MongoDB",
    "Express",
    "Clerk Auth",
    "Productivity",
    "Mobile App",
  ],
  repo: "https://github.com/KhasarMunkh/sololeveler",
};

export const tetris: Project = {
  slug: "tetris",
  title: "Multiplayer Tetris",
  description:
    "A real-time multiplayer Tetris game with ELO matchmaking, garbage attack mechanics, and SRS rotation, built with React, TS, Socket.IO, and MongoDB.",
  tags: [
    "TS",
    "React",
    "Node.js",
    "Socket.IO",
    "MongoDB",
    "Multiplayer",
    "Game",
    "Vite",
  ],
  repo: "https://github.com/KhasarMunkh/tetris",
};

export const ufc: Project = {
  slug: "ufc",
  title: "UFC Match Predictor",
  description:
    "A C# machine learning application using ML.NET's Random Forest algorithm to predict UFC fight outcomes based on fighter statistics and differential performance metrics.",
  tags: [
    "C#",
    ".NET",
    "ML",
    "Binary Classification",
    "Random Forest",
    "Sports Analytics",
    "UFC",
  ],
  repo: "https://github.com/KhasarMunkh/ufc",
};

export const esportsDash: Project = {
  slug: "esportsdash",
  title: "Esports Dash",
  description:
    "A real-time League of Legends esports dashboard built with Next.js that displays live matches, upcoming schedules, tournaments, and professional player profiles using PandaScore API data.",
  tags: [
    "Next.js",
    "TS",
    "Tailwind",
    "Esports",
    "LoL",
    "SWR",
    "Real-time Dashboard",
  ],
  repo: "https://github.com/KhasarMunkh/esportsdash",
};

export const godo: Project = {
  slug: "godo",
  title: "Godo",
  description: "A simple, directory-specific todo manager for your terminal.",
  tags: ["Go", "CLI", "Productivity", "Shell"],
  repo: "https://github.com/KhasarMunkh/godo",
};

export const projects = [goAscii, termfolio, soloLeveler, tetris, ufc, esportsDash, godo];
