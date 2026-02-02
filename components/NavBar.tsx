"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react/jsx-runtime";

export default function NavBar() {
  return (
    <header
      className="sticky top-0 z-10 select-none
    backdrop-blur-lg bg-base/5 border-b border-mauve/10"
    >
      <div className="mx-auto max-w-6xl flex h-15 items-center justify-between px-4">
        <Breadcrumb />
        <nav className="flex gap-6">
          <Link href="/">Home</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
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
