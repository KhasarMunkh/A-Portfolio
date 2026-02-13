"use client";
import { useState, useEffect } from "react";
import type { TocHeading } from "@/lib/markdown";

interface TableOfContentsProps {
  headings: TocHeading[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 },
    );

    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter(Boolean) as HTMLElement[];

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  const minLevel = Math.min(...headings.map((h) => h.level));

  return (
    <nav aria-label="Table of contents" className="hidden lg:block">
      <div className="sticky top-20">
        <p className="text-subtext0 mb-3 text-xs font-semibold uppercase tracking-wider">
          On this page
        </p>
        <ul className="space-y-1 border-l border-surface0">
          {headings.map((heading) => {
            const indent = heading.level - minLevel;
            const isActive = activeId === heading.id;
            return (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById(heading.id)
                      ?.scrollIntoView({ behavior: "smooth" });
                    setActiveId(heading.id);
                  }}
                  className={`block border-l-2 py-1 text-sm transition-colors duration-200 ${isActive ? "border-accent text-accent" : "border-transparent text-subtext1 hover:text-text hover:border-surface1"}`}
                  style={{ paddingLeft: `${indent * 12 + 12}px` }}
                >
                  {heading.text}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
