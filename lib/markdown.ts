export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function extractHeadings(markdown: string): TocHeading[] {
  // Strip fenced code blocks so we don't match comment lines (e.g. "# ...")
  const stripped = markdown.replace(/```[\s\S]*?```/g, "");

  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: TocHeading[] = [];
  let match;

  while ((match = headingRegex.exec(stripped)) !== null) {
    const level = match[1].length;
    const text = match[2].replace(/\*\*(.+?)\*\*/g, "$1").replace(/`(.+?)`/g, "$1").trim();
    headings.push({
      id: slugify(text),
      text,
      level,
    });
  }

  return headings;
}
