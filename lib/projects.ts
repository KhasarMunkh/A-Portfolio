export interface Project {
  slug: string;
  image: { src: string; alt: string };
  title: string;
  description: string;
  tags: string[];
}

export const goAscii: Project = {
  slug: "go-ascii",
  image: { src: "/projects/go-ascii.png", alt: "image of go-ascii" },
  title: "Go-Ascii",
  description:
    "A Go command-line tool that converts images into ASCII, ANSI, or Braille art with optional image filters like blur, posterize, and contrast adjustments.",
  tags: ["Go", "CLI", "Image Processing", "Text Art"],
};

export const termfolio: Project = {
  slug: "termfolio",
  image: {
    src: "/projects/termfolio.png",
    alt: "image of termfolio",
  },
  title: "Termfolio",
  description:
    "An interactive terminal-based portfolio website that runs in the browser, allowing visitors to explore projects and skills through a sandboxed Docker-powered shell experience",
  tags: ["TS", "Express", "Docker", "Node", "AWS EC2", "Caddy", "WebSocket"],
};

export const soloLeveler: Project = {
  slug: "sololeveler",
  image: { src: "/projects/sololeveler.webp", alt: "image of sololeveler app" },
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
};

export const tetris: Project = {
  slug: "tetris",
  image: { src: "/projects/tetris.png", alt: "image of go-ascii" },
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
};

export const ufc: Project = {
  slug: "ufc",
  image: { src: "/projects/ufc.png", alt: "image of UFC match predictor" },
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
};

export const esportsDash: Project = {
  slug: "esportsdash",
  image: {
    src: "/projects/esportsdash.png",
    alt: "image of esports dashboard",
  },
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
};

export const projects = [goAscii, termfolio, soloLeveler, tetris, ufc, esportsDash];
