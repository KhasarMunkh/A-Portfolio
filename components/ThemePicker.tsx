"use client";
import { useState, useRef, useEffect } from "react";
import { PiPaletteBold } from "react-icons/pi";
import {
  usePalette,
  paletteNames,
  useAccent,
  accentColorNames,
} from "@/lib/theme";

export default function ThemePicker() {
  const [palette, setPalette] = usePalette();
  const [accent, setAccent] = useAccent();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Change theme"
        className="text-subtext0 hover:text-accent cursor-pointer rounded-md p-1.5 transition-colors duration-200"
      >
        <PiPaletteBold className="size-5" />
      </button>
      {open && (
        <div className="bg-base ring-surface0 absolute right-0 top-full mt-2 min-w-64 rounded-lg p-3 shadow-lg ring-1">
          {/* Palette section */}
          <p className="text-subtext0 mb-1.5 text-[10px] font-semibold uppercase tracking-wider">
            Theme
          </p>
          <div className="flex gap-1">
            {paletteNames.map((name) => {
              const isSelected = palette === name;
              return (
                <button
                  key={name}
                  onClick={() => setPalette(name)}
                  className={`flex-1 cursor-pointer rounded-md px-1.5 py-1.5 text-center text-xs font-medium transition-all duration-200 ${isSelected ? "bg-surface0 text-text ring-accent/70 shadow-sm ring-1 ring-inset" : "text-subtext1 hover:bg-surface0/50 hover:text-text"}`}
                >
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="bg-surface0 my-2.5 h-px" />

          {/* Accent color section */}
          <p className="text-subtext0 mb-1.5 text-[10px] font-semibold uppercase tracking-wider">
            Accent
          </p>
          <div className="grid grid-cols-7 gap-1.5">
            {accentColorNames.map((name) => {
              const isSelected = accent === name;
              return (
                <button
                  key={name}
                  onClick={() => setAccent(name)}
                  aria-label={`Select ${name} accent color`}
                  title={name.charAt(0).toUpperCase() + name.slice(1)}
                  style={{ backgroundColor: `var(--catppuccin-color-${name})` }}
                  className={`aspect-square cursor-pointer rounded-md transition-all duration-150 ${isSelected ? "scale-110 ring-2 ring-text/50 ring-offset-2 ring-offset-base" : "opacity-70 hover:scale-110 hover:opacity-100"}`}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
