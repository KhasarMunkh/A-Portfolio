import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaLinkedin, FaLinkedinIn } from "react-icons/fa";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl space-y-12 px-0 py-8 md:space-y-16 md:px-4 md:py-12">
      {/* Section: Intro/hero */}
      <section className="space-y-5 px-4 md:px-0 flex gap-6">
        <div className="relative size-64">
          <Image
            src="/flopped.png"
            alt="Khasar"
            fill
            className="object-cover rounded-full"
          />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-left text-text">
            Hi, I&apos;m <span className="text-peach">Khasar</span>
          </h1>
          <p className="text-subtext0 max-w-prose text-lg leading-relaxed">
            A computer science student based in{" "}
            <span className="text-text font-bold">Denver, CO </span>at{" "}
            <span className="font-bold text-text">CU Denver </span>and{" "}
            <span className="font-bold text-text">full-stack </span>
            developer who enjoys clean architecture, performant systems, and
            finely tuned dev environments. I’m a{" "}
            <span className="font-bold text-text">Neovim </span>power user and
            <span className="font-bold text-text"> Arch Linux </span>
            enjoyer, and when I’m not building side projects, you’ll usually
            find me competing in{" "}
            <span className="font-bold text-text"> League of Legends </span>
            at a Master’s level.
          </p>
          <div className="flex gap-3">
            <Link
              href="https://github.com/KhasarMunkh"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Github profile in new tab"
            >
              <FaGithub className="w-6 h-6" />
            </Link>
            <Link
              href="https://www.linkedin.com/in/khasarmunkh/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open linkedin profile in new tab"
            >
              <FaLinkedin className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
