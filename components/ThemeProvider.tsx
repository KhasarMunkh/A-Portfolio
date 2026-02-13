"use client";
import { useEffect } from "react";
import { usePalette, paletteNames, useAccent } from "@/lib/theme";

export default function ThemeProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [palette] = usePalette();
  const [accent] = useAccent();

  useEffect(() => {
    const root = document.documentElement;
    paletteNames.forEach((name) => root.classList.remove(name));
    root.classList.add(palette);
  }, [palette]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--catppuccin-color-accent",
      `var(--catppuccin-color-${accent})`,
    );
  }, [accent]);

  return <>{children}</>;
}
