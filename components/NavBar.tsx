"use client";
import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";
import ThemePicker from "@/components/ThemePicker";

export default function NavBar() {
  return (
    <header
      className="sticky top-0 z-10 h-24 p-5 pb-10 select-none"
      style={{
        mask: "linear-gradient(black, black, transparent)",
        WebkitMask: "linear-gradient(black, black, transparent)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <div className="mx-auto flex h-full max-w-[1800px] items-center justify-between px-4">
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
