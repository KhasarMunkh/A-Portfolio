"use client";
import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";
import ThemePicker from "@/components/ThemePicker";

export default function NavBar() {
  return (
    <header
      className="sticky top-0 z-10 select-none
    backdrop-blur-lg bg-base/80 border-b border-accent/10"
    >
      <div className="flex h-15 items-center justify-between px-8 md:px-16 lg:px-24">
        <Breadcrumb />
        <nav className="flex items-center gap-6">
          <Link href="/">Home</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <ThemePicker />
        </nav>
      </div>
    </header>
  );
}

function Breadcrumb() {
  const breadcrumbs = usePathname().split("/").filter(Boolean);

  return (
    <nav aria-label="breadcrumb" className="">
      <ol className="flex items-center mx-5">
        <Link href="/">
          <li className="inline-flex text-accent text-lg">~</li>
        </Link>
        <li className="inline-flex">/</li>
        {breadcrumbs.length > 0 &&
          breadcrumbs.map((crumb, i) => (
            <li key={i} className="inline-flex">
              {crumb}/
            </li>
          ))}
        <li className="aria-hidden:true flex items-center">
          <span className="bg-accent h-4 w-2 inline-block animate-blink items-center ml-0.5"></span>
        </li>
      </ol>
    </nav>
  );
}
