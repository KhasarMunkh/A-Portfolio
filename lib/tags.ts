const tagColors: Record<string, string> = {
    // Languages
    Go: "text-sky",
    TypeScript: "text-blue",
    TS: "text-blue",
    "C#": "text-mauve",

    // Frontend
    React: "text-sapphire",
    "React Native": "text-sapphire",
    "Next.js": "text-text",
    Expo: "text-lavender",
    "Tailwind": "text-teal",
    Vite: "text-yellow",
    SWR: "text-overlay2",

    // Backend / Runtime
    Node: "text-green",
    "Node.js": "text-green",
    Express: "text-green",

    // Databases
    MongoDB: "text-green",

    // Infrastructure / DevOps
    Docker: "text-sapphire",
    "AWS EC2": "text-peach",
    Caddy: "text-teal",

    // Real-time
    WebSocket: "text-mauve",
    "Socket.IO": "text-mauve",

    // Auth
    "Clerk Auth": "text-lavender",

    // ML
    ".NET": "text-pink",
    "ML": "text-pink",
    "Binary Classification": "text-flamingo",
    "Random Forest": "text-rosewater",

    // Categories / Domains
    CLI: "text-lavender",
    "Image Processing": "text-pink",
    "Text Art": "text-flamingo",
    Productivity: "text-green",
    "Mobile App": "text-peach",
    Multiplayer: "text-red",
    Game: "text-maroon",
    "Sports Analytics": "text-peach",
    UFC: "text-red",
    Esports: "text-red",
    "LoL": "text-yellow",
    "Real-time Dashboard": "text-teal",
  };

  const fallback = "bg-surface1 text-subtext0";

  export function getTagColor(tag: string): string {
    return tagColors[tag] ?? fallback;
  }
